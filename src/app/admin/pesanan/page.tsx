import type { Metadata } from "next";
import Link from "next/link";
import { Price } from "@/components/atoms/Price";
import { EmptyState } from "@/components/molecules/EmptyState";
import { OrderStatusBadge } from "@/components/molecules/OrderStatusBadge";
import { PageHeading } from "@/components/molecules/PageHeading";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";
import { isOrderStatus, ORDER_STATUS_LABEL, ORDER_STATUSES } from "@/lib/order-status";
import { getAllOrders } from "@/server/queries/orders";

export const metadata: Metadata = { title: "Pesanan" };

export default async function AdminOrdersPage({ searchParams }: PageProps<"/admin/pesanan">) {
  const { status } = await searchParams;
  const activeStatus = isOrderStatus(status) ? status : undefined;
  const orders = await getAllOrders(activeStatus);

  const tabClass = (isActive: boolean) =>
    cn(
      "inline-flex h-9 items-center rounded-full border px-3.5 text-sm font-medium whitespace-nowrap",
      isActive ? "border-ink bg-ink text-on-ink" : "border-line hover:border-ink",
    );

  return (
    <div className="flex flex-col gap-6">
      <PageHeading title="Pesanan" />

      <nav aria-label="Filter status" className="-mx-4 overflow-x-auto px-4">
        <ul className="flex gap-2">
          <li>
            <Link href="/admin/pesanan" className={tabClass(!activeStatus)}>
              Semua
            </Link>
          </li>
          {ORDER_STATUSES.map((value) => (
            <li key={value}>
              <Link href={`/admin/pesanan?status=${value}`} className={tabClass(activeStatus === value)}>
                {ORDER_STATUS_LABEL[value]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {orders.length === 0 ? (
        <EmptyState icon="package" title="Tidak ada pesanan" description="Pesanan dengan status ini akan muncul di sini." />
      ) : (
        <div className="overflow-x-auto rounded-panel border border-line">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-surface text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Nomor</th>
                <th className="px-4 py-3 font-medium">Pembeli</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-surface/60">
                  <td className="px-4 py-3">
                    <Link href={`/admin/pesanan/${order.id}`} className="font-mono font-bold text-brand hover:underline">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.recipientName}</p>
                    <p className="text-xs text-ink-muted">{order.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{formatDateTime(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Price amount={order.total} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
