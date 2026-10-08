import { ProductCard, ProductCardSkeleton } from "@/components/organisms/ProductCard";
import type { ProductCardData } from "@/server/queries/catalog";

/**
 * ORGANISM: ProductGrid
 * Grid responsif: 2 kolom di HP, 3 di tablet, 4 di laptop.
 */

const gridClass = "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4";

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <div className={gridClass}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          name={product.name}
          slug={product.slug}
          price={product.price}
          stock={product.stock}
          imageUrl={product.imageUrl}
          categoryName={product.category?.name}
          // 4 gambar pertama langsung dimuat karena pasti terlihat di layar
          priority={index < 4}
        />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={gridClass} aria-busy="true" aria-label="Memuat produk">
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
