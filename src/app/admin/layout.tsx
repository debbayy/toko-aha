import type { Metadata } from "next";
import { AdminTemplate } from "@/components/templates/AdminTemplate";
import { requireAdmin } from "@/server/dal";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false }, // jangan sampai panel admin muncul di Google
};

/**
 * Semua halaman di /admin melewati layout ini.
 * `requireAdmin()` menolak user yang bukan admin.
 * (Server Action admin tetap mengecek ulang sendiri — lihat actions/admin-actions.ts)
 */
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdmin();

  return <AdminTemplate adminName={admin.name}>{children}</AdminTemplate>;
}
