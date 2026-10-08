import { describe, expect, it } from "vitest";
import { formatDateTime, formatRupiah } from "./format";

describe("formatRupiah", () => {
  it("memformat angka dengan pemisah ribuan titik", () => {
    expect(formatRupiah(150000)).toBe("Rp 150.000");
  });

  it("memformat nol", () => {
    expect(formatRupiah(0)).toBe("Rp 0");
  });

  it("memformat angka jutaan", () => {
    expect(formatRupiah(1_250_000)).toBe("Rp 1.250.000");
  });
});

describe("formatDateTime", () => {
  it("menampilkan tanggal dalam zona waktu Jakarta (UTC+7)", () => {
    // 12:20 UTC = 19:20 WIB
    const result = formatDateTime(new Date("2026-10-08T12:20:00Z"));
    expect(result).toContain("8 Oktober 2026");
    expect(result).toContain("19.20");
  });
});
