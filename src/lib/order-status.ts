/**
 * Aturan status pesanan dalam satu tempat.
 *
 * Alur normal:  PENDING -> PROCESSING -> SHIPPED -> COMPLETED
 * Pembatalan hanya boleh sebelum barang dikirim.
 */

// Didefinisikan ulang di sini (bukan diimpor dari Prisma) supaya file ini
// bisa dipakai di komponen client tanpa ikut membawa kode database.
export const ORDER_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"] as const;
export type OrderStatusValue = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABEL: Record<OrderStatusValue, string> = {
  PENDING: "Menunggu konfirmasi",
  PROCESSING: "Diproses",
  SHIPPED: "Dikirim",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const ALLOWED_TRANSITIONS: Record<OrderStatusValue, OrderStatusValue[]> = {
  PENDING: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

export function getNextStatuses(current: OrderStatusValue): OrderStatusValue[] {
  return ALLOWED_TRANSITIONS[current];
}

export function canTransition(from: OrderStatusValue, to: OrderStatusValue): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

/** Pembeli hanya boleh membatalkan pesanan yang belum diproses toko. */
export function canCustomerCancel(status: OrderStatusValue): boolean {
  return status === "PENDING";
}

export function isOrderStatus(value: unknown): value is OrderStatusValue {
  return typeof value === "string" && (ORDER_STATUSES as readonly string[]).includes(value);
}
