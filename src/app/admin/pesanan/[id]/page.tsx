import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/molecules/PageHeading";
import { OrderDetailView } from "@/components/organisms/OrderDetailView";
import { OrderStatusForm } from "@/components/organisms/OrderStatusForm";
import { getOrderForAdmin } from "@/server/queries/orders";

export const metadata: Metadata = { title: "Detail pesanan" };

export default async function AdminOrderDetailPage({ params }: PageProps<"/admin/pesanan/[id]">) {
  const { id } = await params;
  const order = await getOrderForAdmin(id);

  if (!order) notFound();

  return (
    <div className="flex flex-col gap-8">
      <Link href="/admin/pesanan" className="text-sm font-semibold text-brand hover:underline">
        Semua pesanan
      </Link>

      <PageHeading title={order.orderNumber} description={`Akun pembeli: ${order.user.name} (${order.user.email})`} />

      <section className="flex flex-col gap-3 rounded-panel border border-line p-5">
        <h2 className="text-base font-bold">Ubah status</h2>
        <OrderStatusForm orderId={order.id} status={order.status} />
      </section>

      <OrderDetailView order={order} />
    </div>
  );
}
