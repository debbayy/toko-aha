import { describe, expect, it } from "vitest";
import { amountUntilFreeShipping, calculateOrderTotals, calculateShipping, calculateSubtotal } from "./pricing";

const rule = { flatRate: 15_000, freeShippingMin: 300_000 };

describe("calculateSubtotal", () => {
  it("menjumlahkan harga × jumlah setiap barang", () => {
    const items = [
      { price: 50_000, quantity: 2 }, // 100.000
      { price: 25_000, quantity: 1 }, //  25.000
    ];
    expect(calculateSubtotal(items)).toBe(125_000);
  });

  it("menghasilkan 0 untuk keranjang kosong", () => {
    expect(calculateSubtotal([])).toBe(0);
  });
});

describe("calculateShipping", () => {
  it("memakai tarif flat bila belum mencapai minimal gratis ongkir", () => {
    expect(calculateShipping(299_999, rule)).toBe(15_000);
  });

  it("gratis bila subtotal tepat di batas minimal", () => {
    expect(calculateShipping(300_000, rule)).toBe(0);
  });

  it("tidak ada ongkir untuk keranjang kosong", () => {
    expect(calculateShipping(0, rule)).toBe(0);
  });

  it("selalu kena ongkir bila fitur gratis ongkir dimatikan (0)", () => {
    expect(calculateShipping(5_000_000, { flatRate: 15_000, freeShippingMin: 0 })).toBe(15_000);
  });
});

describe("calculateOrderTotals", () => {
  it("total = subtotal + ongkir", () => {
    expect(calculateOrderTotals([{ price: 100_000, quantity: 1 }], rule)).toEqual({
      subtotal: 100_000,
      shippingCost: 15_000,
      total: 115_000,
    });
  });
});

describe("amountUntilFreeShipping", () => {
  it("menghitung sisa belanja untuk gratis ongkir", () => {
    expect(amountUntilFreeShipping(250_000, rule)).toBe(50_000);
  });

  it("tidak pernah negatif", () => {
    expect(amountUntilFreeShipping(500_000, rule)).toBe(0);
  });
});
