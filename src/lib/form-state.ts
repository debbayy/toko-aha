/**
 * Bentuk standar balasan Server Action untuk form.
 * Semua form di app ini memakai bentuk yang sama supaya mudah dipahami.
 */
export type FormState = {
  /** Pesan umum, misalnya "Email atau password salah". */
  message?: string;
  /** Pesan error per field, misalnya { email: ["Email tidak valid"] }. */
  fieldErrors?: Record<string, string[] | undefined>;
  /** Nilai yang sudah diketik user, agar form tidak kosong lagi saat ada error. */
  values?: Record<string, string>;
  success?: boolean;
};

export const initialFormState: FormState = {};

/** Mengambil semua field teks dari FormData menjadi object biasa. */
export function formDataToObject(formData: FormData): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && !key.startsWith("$ACTION")) {
      result[key] = value;
    }
  }
  return result;
}
