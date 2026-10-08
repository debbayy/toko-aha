import "server-only";
import type { OrderStatus, Prisma } from "@/generated/prisma/client";
import { db } from "@/server/db";

const orderDetailSelect = {
  id: true,
  orderNumber: true,
  status: true,
  recipientName: true,
  phone: true,
  address: true,
  city: true,
  postalCode: true,
  notes: true,
  subtotal: true,
  shippingCost: true,
  total: true,
  createdAt: true,
  items: {
    select: {
      id: true,
      productName: true,
      price: true,
      quantity: true,
      product: { select: { slug: true, imageUrl: true } },
    },
  },
} satisfies Prisma.OrderSelect;

export type OrderDetail = Prisma.OrderGetPayload<{ select: typeof orderDetailSelect }>;

// ---------- Untuk pembeli ----------

export function getUserOrders(userId: string) {
  return db.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      total: true,
      createdAt: true,
      _count: { select: { items: true } },
    },
  });
}

/** `userId` wajib ikut di filter agar user tidak bisa membuka pesanan orang lain. */
export function getUserOrderByNumber(userId: string, orderNumber: string) {
  return db.order.findFirst({
    where: { orderNumber, userId },
    select: orderDetailSelect,
  });
}

// ---------- Untuk admin ----------

export function getAllOrders(status?: OrderStatus) {
  return db.order.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      orderNumber: true,
      status: true,
      total: true,
      createdAt: true,
      recipientName: true,
      user: { select: { email: true } },
    },
  });
}

export function getOrderForAdmin(orderId: string) {
  return db.order.findUnique({
    where: { id: orderId },
    select: { ...orderDetailSelect, user: { select: { name: true, email: true } } },
  });
}

export async function getDashboardStats() {
  const [productCount, lowStockCount, pendingCount, revenue, recentOrders] = await Promise.all([
    db.product.count({ where: { isActive: true } }),
    db.product.count({ where: { isActive: true, stock: { lte: 5 } } }),
    db.order.count({ where: { status: "PENDING" } }),
    db.order.aggregate({ where: { status: "COMPLETED" }, _sum: { total: true } }),
    db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, orderNumber: true, status: true, total: true, createdAt: true, recipientName: true },
    }),
  ]);

  return {
    productCount,
    lowStockCount,
    pendingCount,
    completedRevenue: revenue._sum.total ?? 0,
    recentOrders,
  };
}
