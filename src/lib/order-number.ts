import { randomBytes } from "node:crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // tanpa I, O, 0, 1 agar tidak tertukar saat dibaca

/**
 * Membuat nomor pesanan yang mudah dibaca pelanggan.
 * Format: INV-YYYYMMDD-XXXXXX   contoh: INV-20261008-K7Q2MZ
 *
 * Parameter `now` dan `bytes` bisa diisi saat unit test agar hasilnya bisa ditebak.
 */
export function generateOrderNumber(now: Date = new Date(), bytes: Uint8Array = randomBytes(6)): string {
  // Pakai tanggal zona Jakarta supaya cocok dengan tanggal yang dilihat pembeli.
  const datePart = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(now)
    .replaceAll("-", "");

  const randomPart = Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join("");

  return `INV-${datePart}-${randomPart}`;
}
