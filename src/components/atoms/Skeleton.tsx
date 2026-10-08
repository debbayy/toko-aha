import { cn } from "@/lib/cn";

/**
 * ATOM: Skeleton
 * Kotak abu-abu berkilau sebagai "placeholder" saat konten sedang dimuat.
 * Atur ukuran & bentuknya lewat className, contoh:
 *   <Skeleton className="h-4 w-32" />
 *   <Skeleton className="aspect-square w-full rounded-panel" />
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      data-testid="skeleton"
      className={cn(
        "rounded-md bg-[length:200%_100%] animate-shimmer",
        "bg-[linear-gradient(90deg,var(--color-surface)_25%,var(--color-line)_50%,var(--color-surface)_75%)]",
        className,
      )}
    />
  );
}
