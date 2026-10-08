"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * MOLECULE: ConfirmButton
 * Tombol submit yang meminta konfirmasi dulu sebelum form dikirim.
 * Cocok untuk aksi berbahaya seperti menghapus data.
 */

type ConfirmButtonProps = {
  message: string;
  children: ReactNode;
  className?: string;
};

export function ConfirmButton({ message, children, className }: ConfirmButtonProps) {
  return (
    <button
      type="submit"
      className={cn("text-sm font-semibold", className)}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
