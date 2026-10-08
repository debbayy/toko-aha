import type { ReactNode } from "react";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { SiteHeader } from "@/components/organisms/SiteHeader";
import type { CurrentUser } from "@/server/dal";

/**
 * TEMPLATE: StoreTemplate
 * Kerangka halaman toko: header di atas, konten di tengah, footer di bawah.
 * Template hanya mengatur TATA LETAK — datanya dikirim dari layout/page.
 */

type StoreTemplateProps = {
  user: CurrentUser | null;
  cartCount: number;
  children: ReactNode;
};

export function StoreTemplate({ user, cartCount, children }: StoreTemplateProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader user={user} cartCount={cartCount} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
