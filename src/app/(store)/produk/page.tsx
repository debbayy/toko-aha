import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { EmptyState } from "@/components/molecules/EmptyState";
import { PageHeading } from "@/components/molecules/PageHeading";
import { Pagination } from "@/components/molecules/Pagination";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { buildCatalogUrl, parseCatalogParams, SORT_OPTIONS, type SortOption } from "@/lib/catalog-params";
import { cn } from "@/lib/cn";
import { getCategories, searchProducts } from "@/server/queries/catalog";

export const metadata: Metadata = { title: "Semua produk" };

/** Halaman katalog: cari, filter kategori, urutkan, dan halaman. */
export default async function CatalogPage({ searchParams }: PageProps<"/produk">) {
  const params = parseCatalogParams(await searchParams);
  const [categories, result] = await Promise.all([getCategories(), searchProducts(params)]);

  const activeCategory = categories.find((category) => category.slug === params.categorySlug);
  const title = params.query ? `Hasil untuk "${params.query}"` : (activeCategory?.name ?? "Semua produk");

  const chipClass = (isActive: boolean) =>
    cn(
      "inline-flex h-9 items-center rounded-full border px-3.5 text-sm font-medium whitespace-nowrap",
      isActive ? "border-ink bg-ink text-on-ink" : "border-line hover:border-ink",
    );

  return (
    <Container className="flex flex-col gap-8 py-10">
      <PageHeading title={title} description={`${result.totalCount} produk`} />

      <div className="flex flex-col gap-4 border-b border-line pb-6">
        {/* Filter kategori (berupa link biasa, tanpa JavaScript) */}
        <nav aria-label="Filter kategori" className="-mx-4 overflow-x-auto px-4">
          <ul className="flex gap-2">
            <li>
              <Link href={buildCatalogUrl({ ...params, categorySlug: null, page: 1 })} className={chipClass(!params.categorySlug)}>
                Semua
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={buildCatalogUrl({ ...params, categorySlug: category.slug, page: 1 })}
                  className={chipClass(category.slug === params.categorySlug)}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Pilihan urutan */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="text-ink-muted">Urutkan:</span>
          {(Object.keys(SORT_OPTIONS) as SortOption[]).map((sort) => (
            <Link
              key={sort}
              href={buildCatalogUrl({ ...params, sort, page: 1 })}
              aria-current={params.sort === sort ? "true" : undefined}
              className={cn("font-medium", params.sort === sort ? "text-ink underline underline-offset-4" : "text-ink-muted hover:text-ink")}
            >
              {SORT_OPTIONS[sort]}
            </Link>
          ))}
        </div>
      </div>

      {result.products.length > 0 ? (
        <>
          <ProductGrid products={result.products} />
          <Pagination
            currentPage={params.page}
            totalPages={result.totalPages}
            buildHref={(page) => buildCatalogUrl({ ...params, page })}
          />
        </>
      ) : (
        <EmptyState
          icon="search"
          title="Produk tidak ditemukan"
          description="Coba kata kunci lain atau lihat semua kategori."
          action={<ButtonLink href="/produk" variant="secondary">Lihat semua produk</ButtonLink>}
        />
      )}
    </Container>
  );
}
