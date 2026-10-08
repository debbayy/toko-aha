"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import type { FormState } from "@/lib/form-state";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { loginSchema, registerSchema, toFieldErrors } from "@/lib/validation";
import { db } from "@/server/db";

/**
 * Server Action untuk login, daftar, dan keluar.
 * Fungsi dengan parameter (prevState, formData) dipakai bersama `useActionState`.
 */

export async function loginAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const values = { email: String(formData.get("email") ?? "") };
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error), values };
  }

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: safeRedirectPath(formData.get("callbackUrl")),
    });
  } catch (error) {
    // AuthError = email/password salah. Error lain (termasuk redirect sukses)
    // harus dilempar ulang supaya Next.js bisa memprosesnya.
    if (error instanceof AuthError) {
      return { message: "Email atau password salah.", values };
    }
    throw error;
  }

  return {};
}

export async function registerAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
  };
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error), values };
  }

  const { name, email, password } = parsed.data;

  const existingUser = await db.user.findUnique({ where: { email }, select: { id: true } });
  if (existingUser) {
    return { fieldErrors: { email: ["Email ini sudah terdaftar. Silakan masuk."] }, values };
  }

  // Password TIDAK PERNAH disimpan apa adanya, hanya hasil hash-nya.
  const passwordHash = await bcrypt.hash(password, 12);
  await db.user.create({ data: { name, email, passwordHash } });

  // Langsung login setelah daftar. signIn akan melakukan redirect.
  await signIn("credentials", {
    email,
    password,
    redirectTo: safeRedirectPath(formData.get("callbackUrl")),
  });

  return {};
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
