/**
 * Konfigurasi toko yang dibaca dari environment variable.
 * Semua nilai punya default agar app tetap jalan saat development.
 */

function readNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export const storeConfig = {
  name: process.env.NEXT_PUBLIC_STORE_NAME || "Dropsip",
  /** Ongkos kirim flat dalam Rupiah. */
  shippingFlatRate: readNumber(process.env.SHIPPING_FLAT_RATE, 15_000),
  /** Minimal belanja untuk gratis ongkir. 0 = fitur gratis ongkir mati. */
  freeShippingMin: readNumber(process.env.FREE_SHIPPING_MIN, 300_000),
  /** Jumlah produk per halaman di katalog. */
  productsPerPage: 12,
  /** Batas jumlah satu produk di keranjang (mencegah input aneh). */
  maxQuantityPerItem: 99,
} as const;
