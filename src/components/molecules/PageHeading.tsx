import type { ReactNode } from "react";

/**
 * MOLECULE: PageHeading
 * Judul halaman + deskripsi singkat + tombol aksi opsional di kanan.
 */

type PageHeadingProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeading({ title, description, action }: PageHeadingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="text-sm text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
