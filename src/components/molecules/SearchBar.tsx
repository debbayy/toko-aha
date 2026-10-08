import { Icon } from "@/components/atoms/Icon";

/**
 * MOLECULE: SearchBar
 * Form pencarian biasa (method GET ke /produk?q=...).
 * Tidak butuh JavaScript sama sekali — tetap jalan walau JS belum ter-load.
 */
export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/produk" role="search" className="relative w-full">
      <label htmlFor="site-search" className="sr-only">
        Cari produk
      </label>
      <Icon name="search" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted" />
      <input
        id="site-search"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Cari produk…"
        className="h-10 w-full rounded-full border border-line bg-surface pr-4 pl-9 text-sm placeholder:text-ink-muted focus:border-brand focus:bg-canvas focus:outline-none"
      />
    </form>
  );
}
