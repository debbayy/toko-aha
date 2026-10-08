import { describe, expect, it } from "vitest";
import { canCustomerCancel, canTransition, getNextStatuses, isOrderStatus } from "./order-status";

describe("aturan status pesanan", () => {
  it("alur normal boleh maju satu langkah", () => {
    expect(canTransition("PENDING", "PROCESSING")).toBe(true);
    expect(canTransition("PROCESSING", "SHIPPED")).toBe(true);
    expect(canTransition("SHIPPED", "COMPLETED")).toBe(true);
  });

  it("tidak boleh loncat atau mundur", () => {
    expect(canTransition("PENDING", "COMPLETED")).toBe(false);
    expect(canTransition("SHIPPED", "PENDING")).toBe(false);
  });

  it("tidak bisa dibatalkan setelah dikirim", () => {
    expect(canTransition("SHIPPED", "CANCELLED")).toBe(false);
  });

  it("status akhir tidak punya langkah lanjutan", () => {
    expect(getNextStatuses("COMPLETED")).toEqual([]);
    expect(getNextStatuses("CANCELLED")).toEqual([]);
  });

  it("pembeli hanya boleh batal saat masih menunggu konfirmasi", () => {
    expect(canCustomerCancel("PENDING")).toBe(true);
    expect(canCustomerCancel("PROCESSING")).toBe(false);
  });
});

describe("isOrderStatus", () => {
  it("mengenali status yang valid", () => {
    expect(isOrderStatus("SHIPPED")).toBe(true);
  });

  it("menolak nilai lain", () => {
    expect(isOrderStatus("shipped")).toBe(false);
    expect(isOrderStatus(null)).toBe(false);
    expect(isOrderStatus(123)).toBe(false);
  });
});
