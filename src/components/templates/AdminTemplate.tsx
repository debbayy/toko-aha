import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/atoms/Container";
import { Logo } from "@/components/atoms/Logo";
import { AdminNav } from "@/components/organisms/AdminNav";

/**
 * TEMPLATE: AdminTemplate
 * Tata letak panel admin: menu di samping (laptop) atau di atas (HP).
 */
export function AdminTemplate({ adminName, children }: { adminName: string; children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-line">
        <Container className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-semibold text-ink-muted">Admin</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-ink-muted sm:inline">{adminName}</span>
            <Link href="/" className="font-semibold text-brand hover:underline">
              Lihat toko
            </Link>
          </div>
        </Container>
      </header>

      <Container className="grid gap-6 py-6 lg:grid-cols-[200px_1fr] lg:gap-10 lg:py-10">
        <aside>
          <AdminNav />
        </aside>
        <main className="min-w-0">{children}</main>
      </Container>
    </div>
  );
}
