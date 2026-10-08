import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { Price } from "@/components/atoms/Price";
import { EmptyState } from "@/components/molecules/EmptyState";
import { OrderStatusBadge } from "@/components/molecules/OrderStatusBadge";
import { PageHeading } from "@/components/molecules/PageHeading";
import { formatDateTime } from "@/lib/format";
import { requireUser } from "@/server/dal";
import { getUserOrders } from "@/server/queries/orders";

export const metadata: Metadata = { title: "Pesanan saya" };

export default async function MyOrdersPage() {
  const user = await requireUser("/pesanan");
  const orders = await getUserOrders(user.id);

  return (
    <Container className="flex flex-col gap-8 py-10">
      <PageHeading title="Pesanan saya" />

      {orders.length === 0 ? (
        <EmptyState
          icon="package"
          title="Belum ada pesanan"
          description="Pesanan yang kamu buat akan tampil di sini beserta statusnya."
          action={<ButtonLink href="/produk">Mulai belanja</ButtonLink>}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/pesanan/${order.orderNumber}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-panel border border-line p-4 hover:border-ink-muted/50 sm:p-5"
              >
                <div className="flex flex-col gap-1">
                  <p className="font-mono text-sm font-bold">{order.orderNumber}</p>
                  <p className="text-xs text-ink-muted">
                    {formatDateTime(order.createdAt)}, {order._count.items} jenis barang
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusBadge status={order.status} />
                  <Price amount={order.total} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
