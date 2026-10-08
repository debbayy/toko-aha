"use client";

import { useActionState } from "react";
import { cancelMyOrderAction } from "@/actions/order-actions";
import { Alert } from "@/components/atoms/Alert";
import { SubmitButton } from "@/components/molecules/SubmitButton";
import { initialFormState } from "@/lib/form-state";

/** ORGANISM: Tombol batalkan pesanan milik pembeli, dengan konfirmasi dulu. */
export function CancelOrderForm({ orderId }: { orderId: string }) {
  const [state, formAction] = useActionState(cancelMyOrderAction, initialFormState);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm("Batalkan pesanan ini? Tindakan ini tidak bisa diurungkan.")) {
          event.preventDefault();
        }
      }}
      className="flex flex-col gap-3"
    >
      <input type="hidden" name="orderId" value={orderId} />
      {state.message && <Alert tone={state.success ? "success" : "danger"}>{state.message}</Alert>}
      <SubmitButton variant="secondary" pendingText="Membatalkan…">
        Batalkan pesanan
      </SubmitButton>
    </form>
  );
}
