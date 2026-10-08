/**
 * Mengubah teks bebas menjadi "slug" untuk URL.
 * Contoh: "Kaos Polos Hitam (XL)" -> "kaos-polos-hitam-xl"
 */
export function slugify(text: string): string {
  return text
    .normalize("NFKD") // pisahkan huruf dari aksen: "é" -> "e" + aksen
    .replace(/[̀-ͯ]/g, "") // buang aksennya
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // buang karakter selain huruf, angka, spasi, strip
    .replace(/[\s-]+/g, "-") // spasi/strip berurutan -> satu strip
    .replace(/^-+|-+$/g, ""); // buang strip di awal & akhir
}

/**
 * Menambahkan akhiran acak agar slug unik.
 * Dipakai bila slug yang sama sudah ada di database.
 */
export function withRandomSuffix(slug: string, random: () => number = Math.random): string {
  const suffix = Math.floor(random() * 36 ** 4)
    .toString(36)
    .padStart(4, "0");
  return `${slug}-${suffix}`;
}
