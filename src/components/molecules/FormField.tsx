import type { ReactNode } from "react";
import { Label } from "@/components/atoms/Label";

/**
 * MOLECULE: FormField
 * Gabungan Label + input + pesan error/petunjuk.
 *
 * <FormField label="Email" htmlFor="email" error={errors?.email?.[0]}>
 *   <Input id="email" name="email" />
 * </FormField>
 */

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function FormField({ label, htmlFor, error, hint, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-ink-muted">{hint}</p>
      )}
    </div>
  );
}
