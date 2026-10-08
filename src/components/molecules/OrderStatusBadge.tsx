import { Badge, type BadgeTone } from "@/components/atoms/Badge";
import { ORDER_STATUS_LABEL, type OrderStatusValue } from "@/lib/order-status";

/** MOLECULE: Badge status pesanan dengan warna sesuai statusnya. */

const statusTone: Record<OrderStatusValue, BadgeTone> = {
  PENDING: "tag",
  PROCESSING: "info",
  SHIPPED: "info",
  COMPLETED: "success",
  CANCELLED: "danger",
};

export function OrderStatusBadge({ status }: { status: OrderStatusValue }) {
  return <Badge tone={statusTone[status]}>{ORDER_STATUS_LABEL[status]}</Badge>;
}
