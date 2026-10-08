import Link from "next/link";
import { Badge } from "@/components/atoms/Badge";
import { Price } from "@/components/atoms/Price";
import { Skeleton } from "@/components/atoms/Skeleton";
import { ProductImage } from "@/components/molecules/ProductImage";

/**
 * ORGANISM: ProductCard
 * Kartu produk di katalog: gambar (dengan skeleton), nama, harga, dan info stok.
 * Satu kartu = satu link besar ke halaman detail produk.
 */

export type ProductCardProps = {
  name: string;
  slug: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  categoryName?: string | null;
  priority?: boolean;
};

export function ProductCard({ name, slug, price, stock, imageUrl, categoryName, priority }: ProductCardProps) {
  const isSoldOut = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  return (
    <Link href={`/produk/${slug}`} className="group flex flex-col gap-3">
      <div className="relative">
        <ProductImage
          src={imageUrl}
          alt={name}
          priority={priority}
          className="rounded-panel border border-line transition group-hover:border-ink-muted/40"
        />
        {isSoldOut && (
          <Badge tone="neutral" className="absolute top-2 left-2 bg-canvas/90">
            Stok habis
          </Badge>
        )}
        {isLowStock && (
          <Badge tone="tag" className="absolute top-2 left-2">
            Sisa {stock}
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-1 px-0.5">
        {categoryName && <p className="text-xs text-ink-muted">{categoryName}</p>}
        <h3 className="line-clamp-2 text-sm leading-snug font-medium group-hover:underline">{name}</h3>
        <Price amount={price} className="text-base" />
      </div>
    </Link>
  );
}

/** Versi skeleton dari ProductCard, dipakai di loading.tsx */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-square w-full rounded-panel" />
      <div className="flex flex-col gap-2 px-0.5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  );
}
