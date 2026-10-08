import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Alert } from "@/components/atoms/Alert";
import { Container } from "@/components/atoms/Container";
import { PageHeading } from "@/components/molecules/PageHeading";
import { CancelOrderForm } from "@/components/organisms/CancelOrderForm";
import { OrderDetailView } from "@/components/organisms/OrderDetailView";
import { canCustomerCancel } from "@/lib/order-status";
import { requireUser } from "@/server/dal";
import { getUserOrderByNumber } from "@/server/queries/orders";

export const metadata: Metadata = { title: "Detail pesanan" };

export default async function MyOrderDetailPage({ params, searchParams }: PageProps<"/pesanan/[orderNumber]">) {
  const { orderNumber } = await params;
  const { baru } = await searchParams;
  const user = await requireUser(`/pesanan/${orderNumber}`);

  const order = await getUserOrderByNumber(user.id, orderNumber);
  if (!order) notFound();

  return (
    <Container className="flex flex-col gap-8 py-10">
      <Link href="/pesanan" className="text-sm font-semibold text-brand hover:underline">
        Semua pesanan
      </Link>

      {baru === "1" && (
        <Alert tone="success">
          Pesanan berhasil dibuat. Kami akan mengonfirmasi dan memprosesnya secepatnya.
        </Alert>
      )}

      <PageHeading
        title={order.orderNumber}
        action={canCustomerCancel(order.status) ? <CancelOrderForm orderId={order.id} /> : undefined}
      />

      <OrderDetailView order={order} />
    </Container>
  );
}
