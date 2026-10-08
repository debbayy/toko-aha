import { beforeEach, describe, expect, it, vi } from "vitest";
import { changeOrderStatus, OrderError, type OrderTx, placeOrderFromCart } from "./order-service";

/**
 * Test ini TIDAK memakai database sungguhan.
 * Kita membuat "database palsu" (mock) dengan vi.fn(), lalu memeriksa
 * apakah service memanggilnya dengan cara yang benar.
 */

function createMockTx() {
  return {
    cartItem: { findMany: vi.fn(), deleteMany: vi.fn() },
    product: { updateMany: vi.fn(), update: vi.fn() },
    order: { create: vi.fn(), findUnique: vi.fn(), updateMany: vi.fn() },
  };
}

type MockTx = ReturnType<typeof createMockTx>;
const asTx = (mock: MockTx) => mock as unknown as OrderTx;

const shipping = {
  recipientName: "Budi",
  phone: "081234567890",
  address: "Jl. Merdeka No. 10",
  city: "Bandung",
  postalCode: "40111",
  notes: undefined,
};

const options = {
  shippingRule: { flatRate: 15_000, freeShippingMin: 300_000 },
  createOrderNumber: () => "INV-TEST-0001",
};

const kaos = { id: "p1", name: "Kaos", price: 50_000, isActive: true };

describe("placeOrderFromCart", () => {
  let tx: MockTx;

  beforeEach(() => {
    tx = createMockTx();
  });

  it("membuat pesanan, mengurangi stok, dan mengosongkan keranjang", async () => {
    // Arrange: keranjang berisi 2 kaos, stok cukup
    tx.cartItem.findMany.mockResolvedValue([{ quantity: 2, product: kaos }]);
    tx.product.updateMany.mockResolvedValue({ count: 1 });
    tx.order.create.mockResolvedValue({ orderNumber: "INV-TEST-0001" });

    // Act
    const orderNumber = await placeOrderFromCart(asTx(tx), "user-1", shipping, options);

    // Assert
    expect(orderNumber).toBe("INV-TEST-0001");

    expect(tx.product.updateMany).toHaveBeenCalledWith({
      where: { id: "p1", isActive: true, stock: { gte: 2 } },
      data: { stock: { decrement: 2 } },
    });

    const createdOrder = tx.order.create.mock.calls[0][0].data;
    expect(createdOrder).toMatchObject({
      userId: "user-1",
      subtotal: 100_000,
      shippingCost: 15_000,
      total: 115_000,
    });
    expect(createdOrder.items.create).toEqual([{ productId: "p1", productName: "Kaos", price: 50_000, quantity: 2 }]);

    expect(tx.cartItem.deleteMany).toHaveBeenCalledWith({ where: { userId: "user-1" } });
  });

  it("menolak keranjang kosong", async () => {
    tx.cartItem.findMany.mockResolvedValue([]);

    await expect(placeOrderFromCart(asTx(tx), "user-1", shipping, options)).rejects.toThrow("Keranjang kamu masih kosong");
    expect(tx.order.create).not.toHaveBeenCalled();
  });

  it("menolak bila stok tidak cukup (updateMany tidak mengubah baris apa pun)", async () => {
    tx.cartItem.findMany.mockResolvedValue([{ quantity: 5, product: kaos }]);
    tx.product.updateMany.mockResolvedValue({ count: 0 });

    await expect(placeOrderFromCart(asTx(tx), "user-1", shipping, options)).rejects.toBeInstanceOf(OrderError);
    expect(tx.order.create).not.toHaveBeenCalled();
  });

  it("menolak produk yang sudah tidak dijual", async () => {
    tx.cartItem.findMany.mockResolvedValue([{ quantity: 1, product: { ...kaos, isActive: false } }]);

    await expect(placeOrderFromCart(asTx(tx), "user-1", shipping, options)).rejects.toThrow("sudah tidak dijual");
  });
});

describe("changeOrderStatus", () => {
  let tx: MockTx;

  const pendingOrder = {
    status: "PENDING",
    userId: "user-1",
    items: [
      { productId: "p1", quantity: 2 },
      { productId: null, quantity: 1 }, // produk sudah dihapus admin
    ],
  };

  beforeEach(() => {
    tx = createMockTx();
    tx.order.updateMany.mockResolvedValue({ count: 1 });
  });

  it("admin bisa memproses pesanan PENDING", async () => {
    tx.order.findUnique.mockResolvedValue(pendingOrder);

    await changeOrderStatus(asTx(tx), "order-1", "PROCESSING", { type: "admin" });

    expect(tx.order.updateMany).toHaveBeenCalledWith({
      where: { id: "order-1", status: "PENDING" },
      data: { status: "PROCESSING" },
    });
    expect(tx.product.update).not.toHaveBeenCalled(); // stok tidak berubah
  });

  it("pembatalan mengembalikan stok (melewati produk yang sudah dihapus)", async () => {
    tx.order.findUnique.mockResolvedValue(pendingOrder);

    await changeOrderStatus(asTx(tx), "order-1", "CANCELLED", { type: "customer", userId: "user-1" });

    expect(tx.product.update).toHaveBeenCalledTimes(1);
    expect(tx.product.update).toHaveBeenCalledWith({ where: { id: "p1" }, data: { stock: { increment: 2 } } });
  });

  it("pembeli tidak bisa mengubah pesanan milik orang lain", async () => {
    tx.order.findUnique.mockResolvedValue(pendingOrder);

    await expect(
      changeOrderStatus(asTx(tx), "order-1", "CANCELLED", { type: "customer", userId: "user-lain" }),
    ).rejects.toThrow("Pesanan tidak ditemukan");
  });

  it("pembeli tidak bisa membatalkan pesanan yang sudah diproses", async () => {
    tx.order.findUnique.mockResolvedValue({ ...pendingOrder, status: "PROCESSING" });

    await expect(
      changeOrderStatus(asTx(tx), "order-1", "CANCELLED", { type: "customer", userId: "user-1" }),
    ).rejects.toBeInstanceOf(OrderError);
  });

  it("admin tidak bisa loncat status", async () => {
    tx.order.findUnique.mockResolvedValue(pendingOrder);

    await expect(changeOrderStatus(asTx(tx), "order-1", "COMPLETED", { type: "admin" })).rejects.toBeInstanceOf(OrderError);
  });

  it("gagal bila status sudah diubah orang lain di waktu yang sama", async () => {
    tx.order.findUnique.mockResolvedValue(pendingOrder);
    tx.order.updateMany.mockResolvedValue({ count: 0 });

    await expect(changeOrderStatus(asTx(tx), "order-1", "PROCESSING", { type: "admin" })).rejects.toThrow("baru saja berubah");
  });
});
