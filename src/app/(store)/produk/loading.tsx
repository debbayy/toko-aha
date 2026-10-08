import { Container } from "@/components/atoms/Container";
import { Skeleton } from "@/components/atoms/Skeleton";
import { ProductGridSkeleton } from "@/components/organisms/ProductGrid";

/**
 * loading.tsx otomatis tampil selama page.tsx di folder yang sama masih mengambil data.
 * Bentuknya dibuat mirip halaman aslinya agar tidak "loncat" saat data muncul.
 */
export default function CatalogLoading() {
  return (
    <Container className="flex flex-col gap-8 py-10">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex gap-2 border-b border-line pb-6">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <ProductGridSkeleton />
    </Container>
  );
}
