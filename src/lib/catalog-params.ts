/**
 * Membaca query string katalog (?q=kaos&kategori=pakaian&urut=termurah&halaman=2)
 * menjadi object yang aman dipakai. Nilai aneh akan diganti nilai default.
 */

export const SORT_OPTIONS = {
  terbaru: "Terbaru",
  termurah: "Harga terendah",
  termahal: "Harga tertinggi",
} as const;

export type SortOption = keyof typeof SORT_OPTIONS;

export type CatalogParams = {
  query: string;
  categorySlug: string | null;
  sort: SortOption;
  page: number;
};

type RawSearchParams = Record<string, string | string[] | undefined>;

/** Ambil nilai pertama bila parameter muncul lebih dari sekali (?q=a&q=b). */
function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseCatalogParams(searchParams: RawSearchParams): CatalogParams {
  const query = (first(searchParams.q) ?? "").trim().slice(0, 100);
  const categorySlug = first(searchParams.kategori)?.trim() || null;

  const rawSort = first(searchParams.urut);
  const sort: SortOption = rawSort && rawSort in SORT_OPTIONS ? (rawSort as SortOption) : "terbaru";

  const rawPage = Number(first(searchParams.halaman));
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  return { query, categorySlug, sort, page };
}

/** Kebalikan dari parse: membuat URL katalog dengan parameter yang diubah. */
export function buildCatalogUrl(params: Partial<CatalogParams>): string {
  const search = new URLSearchParams();
  if (params.query) search.set("q", params.query);
  if (params.categorySlug) search.set("kategori", params.categorySlug);
  if (params.sort && params.sort !== "terbaru") search.set("urut", params.sort);
  if (params.page && params.page > 1) search.set("halaman", String(params.page));

  const queryString = search.toString();
  return queryString ? `/produk?${queryString}` : "/produk";
}
