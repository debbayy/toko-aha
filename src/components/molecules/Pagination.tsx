import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * MOLECULE: Pagination
 * Navigasi "Sebelumnya / Halaman X dari Y / Berikutnya".
 * `buildHref` menerima nomor halaman dan mengembalikan URL-nya.
 */

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
};

const linkClass = "inline-flex h-10 items-center rounded-control border border-line px-4 text-sm font-semibold";

export function Pagination({ currentPage, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label="Navigasi halaman" className="flex items-center justify-between gap-4">
      {hasPrevious ? (
        <Link href={buildHref(currentPage - 1)} className={cn(linkClass, "hover:bg-surface")}>
          Sebelumnya
        </Link>
      ) : (
        <span className={cn(linkClass, "opacity-40")} aria-disabled="true">
          Sebelumnya
        </span>
      )}

      <p className="text-sm text-ink-muted">
        Halaman <span className="font-semibold text-ink">{currentPage}</span> dari {totalPages}
      </p>

      {hasNext ? (
        <Link href={buildHref(currentPage + 1)} className={cn(linkClass, "hover:bg-surface")}>
          Berikutnya
        </Link>
      ) : (
        <span className={cn(linkClass, "opacity-40")} aria-disabled="true">
          Berikutnya
        </span>
      )}
    </nav>
  );
}
