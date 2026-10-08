import Link from "next/link";
import { ButtonLink } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { EmptyState } from "@/components/molecules/EmptyState";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { buildCatalogUrl } from "@/lib/catalog-params";
import { storeConfig } from "@/lib/config";
import { formatRupiah } from "@/lib/format";
import { getCategories, getLatestProducts } from "@/server/queries/catalog";

/** Halaman beranda. */
export default async function HomePage() {
  const [categories, products] = await Promise.all([getCategories(), getLatestProducts(8)]);

  return (
    <>
      <Hero />

      <Container className="flex flex-col gap-12 py-12">
        {categories.length > 0 && (
          <section aria-labelledby="category-heading" className="flex flex-col gap-4">
            <h2 id="category-heading" className="text-lg font-bold">
              Belanja per kategori
            </h2>
            <ul className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={buildCatalogUrl({ categorySlug: category.slug })}
                    className="inline-flex h-10 items-center rounded-full border border-line px-4 text-sm font-medium hover:border-ink hover:bg-surface"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="latest-heading" className="flex flex-col gap-6">
          <div className="flex items-end justify-between">
            <h2 id="latest-heading" className="text-lg font-bold">
              Baru masuk
            </h2>
            <Link href="/produk" className="text-sm font-semibold text-brand hover:underline">
              Lihat semua produk
            </Link>
          </div>

          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <EmptyState icon="package" title="Belum ada produk" description="Produk yang ditambahkan admin akan muncul di sini." />
          )}
        </section>
      </Container>
    </>
  );
}

/**
 * Bagian pembuka. Elemen khas toko ini: "label paket" dengan barcode,
 * menampilkan info gratis ongkir — mengingatkan pembeli bahwa barangnya akan dikirim.
 */
function Hero() {
  const hasFreeShipping = storeConfig.freeShippingMin > 0;

  return (
    <section className="border-b border-line bg-surface">
      <Container className="grid items-center gap-10 py-12 sm:py-16 md:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-5">
          <h1 className="max-w-xl text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-5xl">
            Pilih barangnya, kami yang kemas dan kirim.
          </h1>
          <p className="max-w-md text-base text-ink-muted">
            Pesan dalam beberapa langkah, lalu pantau statusnya dari halaman pesanan sampai barang tiba.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/produk" size="lg">
              Mulai belanja
            </ButtonLink>
            <ButtonLink href="/pesanan" size="lg" variant="secondary">
              Cek pesanan
            </ButtonLink>
          </div>
        </div>

        <div aria-hidden="true" className="mx-auto w-full max-w-xs rotate-2 rounded-xl border-2 border-ink bg-canvas p-5 font-mono text-ink shadow-[6px_6px_0_var(--color-ink)]">
          <div className="flex items-center justify-between border-b-2 border-dashed border-ink pb-3 text-xs font-bold">
            <span>{storeConfig.name}</span>
            <span className="rounded bg-tag px-1.5 py-0.5 text-on-tag">REGULER</span>
          </div>
          <div className="flex flex-col gap-1 py-4">
            <span className="text-xs text-ink-muted">Kepada</span>
            <span className="text-lg font-bold">Kamu</span>
            <span className="text-xs text-ink-muted">Di mana pun di Indonesia</span>
          </div>
          <div className="h-12 bg-[repeating-linear-gradient(90deg,var(--color-ink)_0_2px,transparent_2px_4px,var(--color-ink)_4px_7px,transparent_7px_9px)]" />
          <p className="pt-3 text-center text-xs font-bold">
            {hasFreeShipping ? `GRATIS ONGKIR ≥ ${formatRupiah(storeConfig.freeShippingMin)}` : "SIAP DIKIRIM"}
          </p>
        </div>
      </Container>
    </section>
  );
}
