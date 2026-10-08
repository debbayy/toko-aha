import type { Metadata } from "next";
import Link from "next/link";
import { deleteProductAction, toggleProductActiveAction } from "@/actions/admin-actions";
import { Badge } from "@/components/atoms/Badge";
import { ButtonLink } from "@/components/atoms/Button";
import { Price } from "@/components/atoms/Price";
import { ConfirmButton } from "@/components/molecules/ConfirmButton";
import { EmptyState } from "@/components/molecules/EmptyState";
import { PageHeading } from "@/components/molecules/PageHeading";
import { ProductImage } from "@/components/molecules/ProductImage";
import { getAllProductsForAdmin } from "@/server/queries/admin-catalog";

export const metadata: Metadata = { title: "Produk" };

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="Produk"
        description={`${products.length} produk`}
        action={<ButtonLink href="/admin/produk/baru">Tambah produk</ButtonLink>}
      />

      {products.length === 0 ? (
        <EmptyState
          icon="package"
          title="Belum ada produk"
          description="Tambahkan produk pertamamu agar pembeli bisa mulai belanja."
          action={<ButtonLink href="/admin/produk/baru">Tambah produk</ButtonLink>}
        />
      ) : (
        <ul className="divide-y divide-line rounded-panel border border-line">
          {products.map((product) => (
            <li key={product.id} className="flex flex-wrap items-center gap-4 p-4">
              <div className="w-14 shrink-0">
                <ProductImage src={product.imageUrl} alt={product.name} className="rounded-lg border border-line" />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/admin/produk/${product.id}`} className="truncate text-sm font-semibold hover:underline">
                    {product.name}
                  </Link>
                  {!product.isActive && <Badge>Disembunyikan</Badge>}
                  {product.stock === 0 && <Badge tone="danger">Stok habis</Badge>}
                </div>
                <p className="text-xs text-ink-muted">
                  <Price amount={product.price} className="font-medium text-ink" /> &nbsp;Stok {product.stock}
                  {product.category && `, ${product.category.name}`}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Link href={`/admin/produk/${product.id}`} className="rounded-control px-3 py-2 text-sm font-semibold hover:bg-surface">
                  Edit
                </Link>
                <form action={toggleProductActiveAction}>
                  <input type="hidden" name="productId" value={product.id} />
                  <button type="submit" className="rounded-control px-3 py-2 text-sm font-semibold hover:bg-surface">
                    {product.isActive ? "Sembunyikan" : "Tampilkan"}
                  </button>
                </form>
                <form action={deleteProductAction}>
                  <input type="hidden" name="productId" value={product.id} />
                  <ConfirmButton
                    message={`Hapus "${product.name}"? Riwayat pesanan tetap tersimpan.`}
                    className="rounded-control px-3 py-2 text-danger hover:bg-danger/8"
                  >
                    Hapus
                  </ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
