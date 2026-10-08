import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * ATOM: Alert
 * Kotak pesan untuk info, sukses, atau error di atas form.
 */

type AlertTone = "info" | "success" | "danger";

const toneClass: Record<AlertTone, string> = {
  info: "border-brand/30 bg-brand/8 text-ink",
  success: "border-success/30 bg-success/8 text-success",
  danger: "border-danger/30 bg-danger/8 text-danger",
};

export function Alert({ tone = "info", children }: { tone?: AlertTone; children: ReactNode }) {
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cn("rounded-control border px-4 py-3 text-sm", toneClass[tone])}>
      {children}
    </div>
  );
}
