"use client";

import { useActionState } from "react";
import { loginAction, registerAction } from "@/actions/auth-actions";
import { Alert } from "@/components/atoms/Alert";
import { Input } from "@/components/atoms/Input";
import { FormField } from "@/components/molecules/FormField";
import { SubmitButton } from "@/components/molecules/SubmitButton";
import { initialFormState } from "@/lib/form-state";

/**
 * ORGANISM: LoginForm & RegisterForm
 * `callbackUrl` = halaman tujuan setelah berhasil masuk.
 */

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction] = useActionState(loginAction, initialFormState);
  const errors = state.fieldErrors;

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      {state.message && <Alert tone="danger">{state.message}</Alert>}

      <FormField label="Email" htmlFor="email" error={errors?.email?.[0]}>
        <Input id="email" name="email" type="email" autoComplete="email" defaultValue={state.values?.email} invalid={Boolean(errors?.email)} required />
      </FormField>

      <FormField label="Password" htmlFor="password" error={errors?.password?.[0]}>
        <Input id="password" name="password" type="password" autoComplete="current-password" invalid={Boolean(errors?.password)} required />
      </FormField>

      <SubmitButton size="lg" fullWidth pendingText="Masuk…">
        Masuk
      </SubmitButton>
    </form>
  );
}

export function RegisterForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction] = useActionState(registerAction, initialFormState);
  const errors = state.fieldErrors;

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      {state.message && <Alert tone="danger">{state.message}</Alert>}

      <FormField label="Nama lengkap" htmlFor="name" error={errors?.name?.[0]}>
        <Input id="name" name="name" autoComplete="name" defaultValue={state.values?.name} invalid={Boolean(errors?.name)} required />
      </FormField>

      <FormField label="Email" htmlFor="email" error={errors?.email?.[0]}>
        <Input id="email" name="email" type="email" autoComplete="email" defaultValue={state.values?.email} invalid={Boolean(errors?.email)} required />
      </FormField>

      <FormField label="Password" htmlFor="password" error={errors?.password?.[0]} hint="Minimal 8 karakter">
        <Input id="password" name="password" type="password" autoComplete="new-password" invalid={Boolean(errors?.password)} required />
      </FormField>

      <FormField label="Ulangi password" htmlFor="confirmPassword" error={errors?.confirmPassword?.[0]}>
        <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" invalid={Boolean(errors?.confirmPassword)} required />
      </FormField>

      <SubmitButton size="lg" fullWidth pendingText="Membuat akun…">
        Buat akun
      </SubmitButton>
    </form>
  );
}
