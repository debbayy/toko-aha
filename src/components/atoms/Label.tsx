import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** ATOM: Label untuk elemen form. */
export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("text-sm font-medium text-ink", className)} {...props} />;
}
