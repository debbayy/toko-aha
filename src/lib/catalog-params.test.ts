import { describe, expect, it } from "vitest";
import { buildCatalogUrl, parseCatalogParams } from "./catalog-params";

describe("parseCatalogParams", () => {
  it("memakai nilai default bila query string kosong", () => {
    expect(parseCatalogParams({})).toEqual({ query: "", categorySlug: null, sort: "terbaru", page: 1 });
  });

  it("membaca semua parameter yang valid", () => {
    const result = parseCatalogParams({ q: " kaos ", kategori: "pakaian", urut: "termurah", halaman: "3" });
    expect(result).toEqual({ query: "kaos", categorySlug: "pakaian", sort: "termurah", page: 3 });
  });

  it("mengganti nilai aneh dengan default", () => {
    const result = parseCatalogParams({ urut: "acak", halaman: "-2" });
    expect(result.sort).toBe("terbaru");
    expect(result.page).toBe(1);
  });

  it("mengambil nilai pertama bila parameter dobel", () => {
    expect(parseCatalogParams({ q: ["topi", "kaos"] }).query).toBe("topi");
  });
});

describe("buildCatalogUrl", () => {
  it("tidak menambah parameter yang bernilai default", () => {
    expect(buildCatalogUrl({ sort: "terbaru", page: 1 })).toBe("/produk");
  });

  it("menyusun query string dari parameter", () => {
    expect(buildCatalogUrl({ query: "kaos", categorySlug: "pakaian", sort: "termahal", page: 2 })).toBe(
      "/produk?q=kaos&kategori=pakaian&urut=termahal&halaman=2",
    );
  });
});
