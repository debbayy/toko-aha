import type { ReactNode } from "react";

/** MOLECULE: Kotak angka ringkasan di dashboard admin. */
export function StatCard({ label, value, note }: { label: string; value: ReactNode; note?: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-panel border border-line p-5">
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="text-2xl font-extrabold tabular-nums">{value}</p>
      {note && <p className="text-xs text-ink-muted">{note}</p>}
    </div>
  );
}
