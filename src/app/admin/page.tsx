import Link from "next/link";
import { Price } from "@/components/atoms/Price";
import { OrderStatusBadge } from "@/components/molecules/OrderStatusBadge";
import { PageHeading } from "@/components/molecules/PageHeading";
import { StatCard } from "@/components/molecules/StatCard";
import { formatDateTime, formatRupiah } from "@/lib/format";
import { getDashboardStats } from "@/server/queries/orders";

/** Dashboard admin: angka penting + pesanan terbaru. */
export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="flex flex-col gap-8">
      <PageHeading title="Ringkasan" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Menunggu konfirmasi" value={stats.pendingCount} note="Pesanan baru yang perlu diproses" />
        <StatCard label="Pendapatan" value={formatRupiah(stats.completedRevenue)} note="Dari pesanan selesai" />
        <StatCard label="Produk aktif" value={stats.productCount} />
        <StatCard label="Stok menipis" value={stats.lowStockCount} note="Stok 5 atau kurang" />
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">Pesanan terbaru</h2>
          <Link href="/admin/pesanan" className="text-sm font-semibold text-brand hover:underline">
            Semua pesanan
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <p className="text-sm text-ink-muted">Belum ada pesanan masuk.</p>
        ) : (
          <ul className="divide-y divide-line rounded-panel border border-line">
            {stats.recentOrders.map((order) => (
              <li key={order.id}>
                <Link href={`/admin/pesanan/${order.id}`} className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-surface">
                  <div className="flex flex-col gap-0.5">
                    <p className="font-mono text-sm font-bold">{order.orderNumber}</p>
                    <p className="text-xs text-ink-muted">
                      {order.recipientName}, {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <OrderStatusBadge status={order.status} />
                    <Price amount={order.total} className="text-sm" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
