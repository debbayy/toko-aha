import type { OrderStatus, Prisma } from "@/generated/prisma/client";
import { storeConfig } from "@/lib/config";
import { generateOrderNumber } from "@/lib/order-number";
import { canCustomerCancel, canTransition } from "@/lib/order-status";
import { calculateOrderTotals, type ShippingRule } from "@/lib/pricing";
import type { CheckoutInput } from "@/lib/validation";

/**
 * Logika bisnis pesanan (checkout, ubah status, batal).
 *
 * Kenapa dipisah dari Server Action?
 * - Server Action fokus ke: cek login, baca form, redirect.
 * - Service fokus ke: aturan bisnis. Karena menerima `tx` (koneksi database)
 *   sebagai parameter, service ini mudah dites dengan database palsu (mock).
 *
 * Semua fungsi di sini WAJIB dipanggil di dalam `db.$transaction(...)`
 * supaya bila satu langkah gagal, semua perubahan dibatalkan.
 */

/** Error yang pesannya aman ditampilkan langsung ke user. */
export class OrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderError";
  }
}

/** Bagian database yang dipakai service ini. */
export type OrderTx = Pick<Prisma.TransactionClient, "cartItem" | "product" | "order">;

type PlaceOrderOptions = {
  shippingRule?: ShippingRule;
  createOrderNumber?: () => string;
};

/**
 * Mengubah isi keranjang user menjadi pesanan.
 * Mengembalikan nomor pesanan yang baru dibuat.
 */
export async function placeOrderFromCart(
  tx: OrderTx,
  userId: string,
  shipping: CheckoutInput,
  options: PlaceOrderOptions = {},
): Promise<string> {
  const shippingRule = options.shippingRule ?? {
    flatRate: storeConfig.shippingFlatRate,
    freeShippingMin: storeConfig.freeShippingMin,
  };
  const createOrderNumber = options.createOrderNumber ?? (() => generateOrderNumber());

  // 1. Ambil isi keranjang beserta harga TERBARU dari database.
  const cartItems = await tx.cartItem.findMany({
    where: { userId },
    select: {
      quantity: true,
      product: { select: { id: true, name: true, price: true, isActive: true } },
    },
  });

  if (cartItems.length === 0) {
    throw new OrderError("Keranjang kamu masih kosong.");
  }

  // 2. Kurangi stok satu per satu.
  //    `updateMany` dengan syarat `stock >= quantity` membuat pengecekan & pengurangan
  //    terjadi dalam satu perintah database. Ini mencegah stok minus saat dua orang
  //    membeli barang terakhir di waktu yang hampir bersamaan.
  for (const { product, quantity } of cartItems) {
    if (!product.isActive) {
      throw new OrderError(`"${product.name}" sudah tidak dijual. Hapus dari keranjang dulu ya.`);
    }

    const result = await tx.product.updateMany({
      where: { id: product.id, isActive: true, stock: { gte: quantity } },
      data: { stock: { decrement: quantity } },
    });

    if (result.count === 0) {
      throw new OrderError(`Stok "${product.name}" tidak mencukupi. Kurangi jumlahnya di keranjang.`);
    }
  }

  // 3. Hitung total di server.
  const totals = calculateOrderTotals(
    cartItems.map(({ product, quantity }) => ({ price: product.price, quantity })),
    shippingRule,
  );

  // 4. Simpan pesanan + salinan nama & harga produk saat ini.
  const order = await tx.order.create({
    data: {
      orderNumber: createOrderNumber(),
      userId,
      ...shipping,
      ...totals,
      items: {
        create: cartItems.map(({ product, quantity }) => ({
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity,
        })),
      },
    },
    select: { orderNumber: true },
  });

  // 5. Kosongkan keranjang.
  await tx.cartItem.deleteMany({ where: { userId } });

  return order.orderNumber;
}

type StatusChangeActor = { type: "admin" } | { type: "customer"; userId: string };

/**
 * Mengubah status pesanan sesuai aturan di `lib/order-status.ts`.
 * Bila status baru adalah CANCELLED, stok produk dikembalikan.
 */
export async function changeOrderStatus(
  tx: OrderTx,
  orderId: string,
  nextStatus: OrderStatus,
  actor: StatusChangeActor,
): Promise<void> {
  const order = await tx.order.findUnique({
    where: { id: orderId },
    select: { status: true, userId: true, items: { select: { productId: true, quantity: true } } },
  });

  // Pembeli hanya boleh mengubah pesanan miliknya sendiri.
  const isOwner = actor.type === "admin" || order?.userId === actor.userId;
  if (!order || !isOwner) {
    throw new OrderError("Pesanan tidak ditemukan.");
  }

  const isAllowed =
    actor.type === "admin"
      ? canTransition(order.status, nextStatus)
      : nextStatus === "CANCELLED" && canCustomerCancel(order.status);

  if (!isAllowed) {
    throw new OrderError("Status pesanan tidak bisa diubah ke status tersebut.");
  }

  // Syarat `status: order.status` memastikan tidak ada orang lain yang
  // mengubah status di antara langkah baca dan langkah tulis.
  const updated = await tx.order.updateMany({
    where: { id: orderId, status: order.status },
    data: { status: nextStatus },
  });

  if (updated.count === 0) {
    throw new OrderError("Status pesanan baru saja berubah. Muat ulang halaman lalu coba lagi.");
  }

  if (nextStatus === "CANCELLED") {
    for (const item of order.items) {
      // productId bisa null bila produknya sudah dihapus admin.
      if (!item.productId) continue;
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }
  }
}
