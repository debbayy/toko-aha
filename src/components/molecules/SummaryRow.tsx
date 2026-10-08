import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** MOLECULE: Satu baris "label ...... nilai" di ringkasan belanja. */
export function SummaryRow({ label, value, emphasize = false }: { label: string; value: ReactNode; emphasize?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between gap-4", emphasize ? "text-base font-bold" : "text-sm")}>
      <dt className={emphasize ? undefined : "text-ink-muted"}>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
