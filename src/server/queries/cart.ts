import "server-only";
import { storeConfig } from "@/lib/config";
import { calculateOrderTotals } from "@/lib/pricing";
import { db } from "@/server/db";

/** Isi keranjang milik user + ringkasan harganya. */
export async function getCart(userId: string) {
  const items = await db.cartItem.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      quantity: true,
      product: {
        select: { id: true, name: true, slug: true, price: true, stock: true, imageUrl: true, isActive: true },
      },
    },
  });

  // Item dianggap bermasalah bila produknya dinonaktifkan atau stok tidak cukup.
  const itemsWithStatus = items.map((item) => ({
    ...item,
    isAvailable: item.product.isActive && item.product.stock >= item.quantity,
  }));

  const totals = calculateOrderTotals(
    itemsWithStatus.map((item) => ({ price: item.product.price, quantity: item.quantity })),
    { flatRate: storeConfig.shippingFlatRate, freeShippingMin: storeConfig.freeShippingMin },
  );

  return {
    items: itemsWithStatus,
    totals,
    hasUnavailableItems: itemsWithStatus.some((item) => !item.isAvailable),
  };
}

export type Cart = Awaited<ReturnType<typeof getCart>>;

/** Jumlah total barang di keranjang (untuk badge di header). */
export async function getCartCount(userId: string): Promise<number> {
  const result = await db.cartItem.aggregate({
    where: { userId },
    _sum: { quantity: true },
  });
  return result._sum.quantity ?? 0;
}
