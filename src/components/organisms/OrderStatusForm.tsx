"use client";

import { useActionState } from "react";
import { updateOrderStatusAction } from "@/actions/admin-actions";
import { Alert } from "@/components/atoms/Alert";
import { SubmitButton } from "@/components/molecules/SubmitButton";
import { initialFormState } from "@/lib/form-state";
import { getNextStatuses, ORDER_STATUS_LABEL, type OrderStatusValue } from "@/lib/order-status";

/**
 * ORGANISM: OrderStatusForm
 * Tombol-tombol untuk memindahkan pesanan ke status berikutnya.
 * Hanya status yang diizinkan (lihat lib/order-status.ts) yang ditampilkan.
 */

const actionLabel: Record<OrderStatusValue, string> = {
  PENDING: "Kembalikan ke menunggu",
  PROCESSING: "Proses pesanan",
  SHIPPED: "Tandai dikirim",
  COMPLETED: "Tandai selesai",
  CANCELLED: "Batalkan pesanan",
};

export function OrderStatusForm({ orderId, status }: { orderId: string; status: OrderStatusValue }) {
  const [state, formAction] = useActionState(updateOrderStatusAction, initialFormState);
  const nextStatuses = getNextStatuses(status);

  if (nextStatuses.length === 0) {
    return <p className="text-sm text-ink-muted">Pesanan sudah {ORDER_STATUS_LABEL[status].toLowerCase()}. Tidak ada aksi lanjutan.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {state.message && <Alert tone={state.success ? "success" : "danger"}>{state.message}</Alert>}
      <div className="flex flex-wrap gap-2">
        {nextStatuses.map((nextStatus) => (
          <form key={nextStatus} action={formAction}>
            <input type="hidden" name="orderId" value={orderId} />
            <input type="hidden" name="status" value={nextStatus} />
            <SubmitButton variant={nextStatus === "CANCELLED" ? "secondary" : "primary"} pendingText="Menyimpan…">
              {actionLabel[nextStatus]}
            </SubmitButton>
          </form>
        ))}
      </div>
    </div>
  );
}
