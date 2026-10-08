import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/**
 * ATOM: Button
 * Tombol dasar dengan beberapa variasi tampilan.
 *
 * <Button>Simpan</Button>
 * <Button variant="secondary" size="sm">Batal</Button>
 * <ButtonLink href="/produk">Lihat produk</ButtonLink>   // tampil seperti tombol, tapi berupa link
 */

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-ink text-on-ink hover:opacity-90",
  secondary: "border border-line bg-canvas text-ink hover:bg-surface",
  ghost: "text-ink hover:bg-surface",
  danger: "bg-danger text-white hover:opacity-90",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

type StyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export function buttonClassName({ variant = "primary", size = "md", fullWidth = false }: StyleProps = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-control font-semibold transition",
    "disabled:pointer-events-none disabled:opacity-50",
    variantClass[variant],
    sizeClass[size],
    fullWidth && "w-full",
  );
}

type ButtonProps = ComponentProps<"button"> & StyleProps;

export function Button({ variant, size, fullWidth, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonClassName({ variant, size, fullWidth }), className)} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & StyleProps;

export function ButtonLink({ variant, size, fullWidth, className, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonClassName({ variant, size, fullWidth }), className)} {...props} />;
}
