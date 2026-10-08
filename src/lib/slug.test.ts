import { describe, expect, it } from "vitest";
import { slugify, withRandomSuffix } from "./slug";

describe("slugify", () => {
  it.each([
    ["Kaos Polos Hitam", "kaos-polos-hitam"],
    ["  Spasi   Berlebih  ", "spasi-berlebih"],
    ["Kaos (XL) & Topi!", "kaos-xl-topi"],
    ["Café Crème", "cafe-creme"],
    ["--sudah--ada--strip--", "sudah-ada-strip"],
  ])('"%s" menjadi "%s"', (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });

  it("mengembalikan string kosong bila tidak ada huruf/angka", () => {
    expect(slugify("!!!")).toBe("");
  });
});

describe("withRandomSuffix", () => {
  it("menambahkan 4 karakter acak di belakang slug", () => {
    // random palsu supaya hasilnya bisa ditebak
    expect(withRandomSuffix("kaos", () => 0)).toBe("kaos-0000");
    expect(withRandomSuffix("kaos")).toMatch(/^kaos-[a-z0-9]{4}$/);
  });
});
