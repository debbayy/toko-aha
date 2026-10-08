import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "./safe-redirect";

describe("safeRedirectPath", () => {
  it("mengizinkan path di website sendiri", () => {
    expect(safeRedirectPath("/keranjang")).toBe("/keranjang");
    expect(safeRedirectPath("/produk?q=kaos")).toBe("/produk?q=kaos");
  });

  it.each(["https://situs-palsu.com", "//situs-palsu.com", "/\\situs-palsu.com", "javascript:alert(1)"])(
    "menolak URL berbahaya: %s",
    (target) => {
      expect(safeRedirectPath(target)).toBe("/");
    },
  );

  it("memakai fallback untuk nilai kosong atau bukan string", () => {
    expect(safeRedirectPath(undefined, "/produk")).toBe("/produk");
    expect(safeRedirectPath(["/a", "/b"])).toBe("/");
  });
});
