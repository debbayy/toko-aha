import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/**
 * ATOM: Input, Textarea, Select
 * Elemen form dasar dengan gaya yang seragam.
 * Prop `invalid` memberi garis merah saat ada error validasi.
 */

const fieldBase =
  "w-full rounded-control border bg-canvas px-3 text-sm text-ink placeholder:text-ink-muted/70 " +
  "transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

type InvalidProp = { invalid?: boolean };

export function Input({ invalid, className, ...props }: ComponentProps<"input"> & InvalidProp) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(fieldBase, "h-11", invalid ? "border-danger" : "border-line", className)}
      {...props}
    />
  );
}

export function Textarea({ invalid, className, ...props }: ComponentProps<"textarea"> & InvalidProp) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(fieldBase, "min-h-24 py-2.5", invalid ? "border-danger" : "border-line", className)}
      {...props}
    />
  );
}

export function Select({ invalid, className, ...props }: ComponentProps<"select"> & InvalidProp) {
  return (
    <select
      aria-invalid={invalid || undefined}
      className={cn(fieldBase, "h-11", invalid ? "border-danger" : "border-line", className)}
      {...props}
    />
  );
}
