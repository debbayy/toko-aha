import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * ATOM: Badge
 * Label kecil untuk status atau info singkat.
 * <Badge tone="success">Selesai</Badge>
 */

export type BadgeTone = "neutral" | "tag" | "success" | "warning" | "danger" | "info";

const toneClass: Record<BadgeTone, string> = {
  neutral: "bg-surface text-ink-muted",
  tag: "bg-tag text-on-tag",
  success: "bg-success/12 text-success",
  warning: "bg-warning/12 text-warning",
  danger: "bg-danger/12 text-danger",
  info: "bg-brand/12 text-brand",
};

type BadgeProps = {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
};

export function Badge({ tone = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
