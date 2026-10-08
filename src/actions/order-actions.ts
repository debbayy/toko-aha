"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { formDataToObject, type FormState } from "@/lib/form-state";
import { checkoutSchema, toFieldErrors } from "@/lib/validation";
import { db } from "@/server/db";
import { requireUser } from "@/server/dal";
import { changeOrderStatus, OrderError, placeOrderFromCart } from "@/server/services/order-service";

/** Checkout: ubah isi keranjang menjadi pesanan. */
export async function placeOrderAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser("/checkout");
  const values = formDataToObject(formData);

  const parsed = checkoutSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error), values };
  }

  let orderNumber: string;
  try {
    // $transaction: semua langkah sukses semua, atau gagal semua.
    orderNumber = await db.$transaction((tx) => placeOrderFromCart(tx, user.id, parsed.data));
  } catch (error) {
    if (error instanceof OrderError) {
      return { message: error.message, values };
    }
    throw error; // error tak terduga -> ditangkap error.tsx
  }

  revalidatePath("/", "layout");
  // redirect diletakkan di luar try/catch karena redirect bekerja dengan melempar error khusus.
  redirect(`/pesanan/${orderNumber}?baru=1`);
}

/** Pembeli membatalkan pesanannya sendiri (hanya saat status PENDING). */
export async function cancelMyOrderAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser("/pesanan");
  const orderId = String(formData.get("orderId") ?? "");

  try {
    await db.$transaction((tx) =>
      changeOrderStatus(tx, orderId, "CANCELLED", { type: "customer", userId: user.id }),
    );
  } catch (error) {
    if (error instanceof OrderError) return { message: error.message };
    throw error;
  }

  revalidatePath("/pesanan", "layout");
  return { success: true, message: "Pesanan dibatalkan." };
}
