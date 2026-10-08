import { describe, expect, it } from "vitest";
import { generateOrderNumber } from "./order-number";

describe("generateOrderNumber", () => {
  it("memakai format INV-YYYYMMDD-XXXXXX", () => {
    expect(generateOrderNumber()).toMatch(/^INV-\d{8}-[A-Z2-9]{6}$/);
  });

  it("memakai tanggal Jakarta, bukan UTC", () => {
    // 20:00 UTC tanggal 8 = 03:00 WIB tanggal 9
    const now = new Date("2026-10-08T20:00:00Z");
    const bytes = new Uint8Array([0, 1, 2, 3, 4, 5]);
    expect(generateOrderNumber(now, bytes)).toBe("INV-20261009-ABCDEF");
  });

  it("tidak memakai karakter yang mudah tertukar (I, O, 0, 1)", () => {
    for (let i = 0; i < 50; i++) {
      const randomPart = generateOrderNumber().split("-")[2];
      expect(randomPart).not.toMatch(/[IO01]/);
    }
  });
});
