import { z } from "zod";

/**
 * Semua aturan validasi input form ada di file ini.
 * Dipakai di Server Action (wajib) — validasi di browser hanya bonus kenyamanan.
 */

const phoneRegex = /^(\+62|62|0)8\d{7,12}$/; // contoh valid: 081234567890, +6281234567890

// ---------- Akun ----------

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Format email tidak valid")),
  password: z.string().min(1, "Password wajib diisi"),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Nama minimal 2 karakter").max(80, "Nama terlalu panjang"),
    email: z.string().trim().toLowerCase().pipe(z.email("Format email tidak valid")),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .max(72, "Password maksimal 72 karakter"), // batas bcrypt
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak sama",
  });

// ---------- Belanja ----------

export const cartQuantitySchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int("Jumlah harus bilangan bulat").min(1, "Minimal 1").max(99, "Maksimal 99"),
});

export const checkoutSchema = z.object({
  recipientName: z.string().trim().min(2, "Nama penerima minimal 2 karakter").max(80),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s-]/g, "")) // izinkan "0812-3456 7890"
    .pipe(z.string().regex(phoneRegex, "Nomor HP tidak valid, contoh: 081234567890")),
  address: z.string().trim().min(10, "Alamat terlalu pendek, tulis lengkap ya").max(300),
  city: z.string().trim().min(2, "Kota wajib diisi").max(60),
  postalCode: z.string().trim().regex(/^\d{5}$/, "Kode pos harus 5 angka"),
  notes: z
    .string()
    .trim()
    .max(200, "Catatan maksimal 200 karakter")
    .optional()
    .transform((value) => value || undefined), // string kosong -> undefined
});

// ---------- Admin ----------

export const productSchema = z.object({
  name: z.string().trim().min(3, "Nama produk minimal 3 karakter").max(120),
  description: z.string().trim().min(10, "Deskripsi minimal 10 karakter").max(5000),
  price: z.coerce.number().int("Harga harus bilangan bulat").min(100, "Harga minimal Rp100").max(1_000_000_000),
  stock: z.coerce.number().int("Stok harus bilangan bulat").min(0, "Stok tidak boleh minus").max(1_000_000),
  imageUrl: z
    .string()
    .trim()
    .refine((value) => value === "" || /^https?:\/\/\S+$/.test(value), "URL gambar harus diawali http:// atau https://")
    .transform((value) => value || null),
  categoryId: z
    .string()
    .optional()
    .transform((value) => value || null),
  // Checkbox HTML hanya mengirim "on" bila dicentang
  isActive: z
    .string()
    .optional()
    .transform((value) => value === "on"),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Nama kategori minimal 2 karakter").max(50),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ProductInput = z.infer<typeof productSchema>;

/** Mengubah error Zod menjadi { namaField: ["pesan"] } untuk ditampilkan di form. */
export function toFieldErrors(error: z.ZodError): Record<string, string[] | undefined> {
  return z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
}
