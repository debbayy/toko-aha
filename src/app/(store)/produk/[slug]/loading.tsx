import { Container } from "@/components/atoms/Container";
import { Skeleton } from "@/components/atoms/Skeleton";

export default function ProductDetailLoading() {
  return (
    <Container className="py-8 sm:py-12">
      <Skeleton className="mb-6 h-4 w-40" />
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <Skeleton className="aspect-square w-full rounded-panel" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-4/5" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="mt-4 h-11 w-40" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="mt-6 h-24 w-full" />
        </div>
      </div>
    </Container>
  );
}
