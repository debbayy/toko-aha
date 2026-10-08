import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/auth";
import { db } from "@/server/db";

/**
 * DAL = Data Access Layer.
 *
 * Semua pengecekan "siapa yang sedang login" dan "boleh atau tidak"
 * dilakukan lewat fungsi-fungsi di file ini. Jangan cek role langsung
 * dari session di tempat lain — selalu panggil fungsi di sini.
 */

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
};

/**
 * Mengembalikan user yang sedang login, atau `null` bila belum login.
 * `cache()` membuat fungsi ini hanya query database sekali per request,
 * walaupun dipanggil di banyak komponen.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  // Ambil ulang dari database: memastikan user masih ada & role-nya terbaru.
  return db.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });
});

/** Wajib login. Bila belum, arahkan ke halaman masuk lalu kembali ke `returnTo`. */
export async function requireUser(returnTo = "/"): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/masuk?callbackUrl=${encodeURIComponent(returnTo)}`);
  }
  return user;
}

/** Wajib login sebagai ADMIN. User biasa diarahkan ke beranda. */
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser("/admin");
  if (user.role !== "ADMIN") {
    redirect("/");
  }
  return user;
}
