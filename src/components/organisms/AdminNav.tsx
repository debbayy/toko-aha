"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

/**
 * ORGANISM: AdminNav
 * Menu navigasi panel admin. Butuh "use client" hanya untuk tahu
 * halaman mana yang sedang aktif (usePathname).
 */

const links = [
  { href: "/admin", label: "Ringkasan" },
  { href: "/admin/pesanan", label: "Pesanan" },
  { href: "/admin/produk", label: "Produk" },
  { href: "/admin/kategori", label: "Kategori" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Menu admin" className="flex gap-1 overflow-x-auto lg:flex-col">
      {links.map((link) => {
        // "/admin" hanya aktif bila persis sama; menu lain aktif juga untuk sub-halamannya.
        const isActive = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-control px-3 py-2 text-sm font-semibold whitespace-nowrap",
              isActive ? "bg-ink text-on-ink" : "text-ink-muted hover:bg-surface hover:text-ink",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
