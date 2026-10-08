/**
 * Helper untuk menampilkan angka & tanggal dalam format Indonesia.
 */

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

/** 150000 -> "Rp 150.000" */
export function formatRupiah(amount: number): string {
  // Intl memakai spasi khusus (non-breaking space). Kita ganti ke spasi biasa
  // supaya hasilnya konsisten dan mudah dites.
  return rupiahFormatter.format(amount).replace(/ /g, " ");
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});

/** Date -> "8 Oktober 2026 pukul 19.20" */
export function formatDateTime(date: Date): string {
  return dateFormatter.format(date);
}
