import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/atoms/Container";
import { Icon } from "@/components/atoms/Icon";
import { Price } from "@/components/atoms/Price";
import { ProductImage } from "@/components/molecules/ProductImage";
import { AddToCartForm } from "@/components/organisms/AddToCartForm";
import { buildCatalogUrl } from "@/lib/catalog-params";
import { storeConfig } from "@/lib/config";
import { formatRupiah } from "@/lib/format";
import { getProductBySlug } from "@/server/queries/catalog";

export async function generateMetadata({ params }: PageProps<"/produk/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produk tidak ditemukan" };

  return {
    title: product.name,
    description: product.description.slice(0, 155),
    openGraph: product.imageUrl ? { images: [product.imageUrl] } : undefined,
  };
}

/** Halaman detail satu produk. */
export default async function ProductDetailPage({ params }: PageProps<"/produk/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound(); // tampilkan halaman 404

  return (
    <Container className="py-8 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-ink-muted">
        <Link href="/produk" className="hover:text-ink">
          Produk
        </Link>
        {product.category && (
          <>
            <span aria-hidden="true">/</span>
            <Link href={buildCatalogUrl({ categorySlug: product.category.slug })} className="hover:text-ink">
              {product.category.name}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <ProductImage src={product.imageUrl} alt={product.name} priority className="rounded-panel border border-line" />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl leading-tight font-extrabold tracking-tight sm:text-3xl">{product.name}</h1>
            <Price amount={product.price} highlight className="self-start text-2xl" />
          </div>

          <AddToCartForm productId={product.id} stock={product.stock} returnTo={`/produk/${product.slug}`} />

          {storeConfig.freeShippingMin > 0 && (
            <p className="flex items-center gap-2 text-sm text-ink-muted">
              <Icon name="truck" className="size-4 shrink-0" />
              Gratis ongkir untuk belanja mulai {formatRupiah(storeConfig.freeShippingMin)}
            </p>
          )}

          <section aria-labelledby="description-heading" className="flex flex-col gap-2 border-t border-line pt-6">
            <h2 id="description-heading" className="text-base font-bold">
              Deskripsi
            </h2>
            {/* whitespace-pre-line: baris baru yang diketik admin tetap tampil sebagai baris baru */}
            <p className="max-w-prose text-sm leading-relaxed whitespace-pre-line text-ink-muted">{product.description}</p>
          </section>
        </div>
      </div>
    </Container>
  );
}
