import { describe, expect, it } from "vitest";
import { checkoutSchema, productSchema, registerSchema } from "./validation";

const validCheckout = {
  recipientName: "Budi Santoso",
  phone: "0812-3456 7890",
  address: "Jl. Merdeka No. 10, RT 01/RW 02",
  city: "Bandung",
  postalCode: "40111",
  notes: "",
};

describe("checkoutSchema", () => {
  it("menerima data yang benar dan merapikan nomor HP", () => {
    const result = checkoutSchema.parse(validCheckout);
    expect(result.phone).toBe("081234567890");
    expect(result.notes).toBeUndefined(); // catatan kosong -> undefined
  });

  it("menolak nomor HP yang bukan nomor Indonesia", () => {
    const result = checkoutSchema.safeParse({ ...validCheckout, phone: "12345" });
    expect(result.success).toBe(false);
  });

  it("menolak kode pos yang bukan 5 angka", () => {
    const result = checkoutSchema.safeParse({ ...validCheckout, postalCode: "4011" });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  const validRegister = { name: "Sari", email: "SARI@Mail.com", password: "rahasia123", confirmPassword: "rahasia123" };

  it("mengubah email menjadi huruf kecil", () => {
    expect(registerSchema.parse(validRegister).email).toBe("sari@mail.com");
  });

  it("menolak konfirmasi password yang berbeda", () => {
    const result = registerSchema.safeParse({ ...validRegister, confirmPassword: "beda" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(["confirmPassword"]);
  });

  it("menolak password kurang dari 8 karakter", () => {
    const result = registerSchema.safeParse({ ...validRegister, password: "pendek", confirmPassword: "pendek" });
    expect(result.success).toBe(false);
  });
});

describe("productSchema", () => {
  const validProduct = {
    name: "Kaos Polos",
    description: "Kaos katun yang nyaman dipakai",
    price: "75000",
    stock: "10",
    imageUrl: "",
    categoryId: "",
    isActive: "on",
  };

  it("mengubah input teks dari form menjadi tipe yang benar", () => {
    expect(productSchema.parse(validProduct)).toEqual({
      name: "Kaos Polos",
      description: "Kaos katun yang nyaman dipakai",
      price: 75000,
      stock: 10,
      imageUrl: null,
      categoryId: null,
      isActive: true,
    });
  });

  it("checkbox yang tidak dicentang berarti tidak aktif", () => {
    const { isActive, ...rest } = validProduct;
    void isActive;
    expect(productSchema.parse(rest).isActive).toBe(false);
  });

  it("menolak stok minus dan URL gambar yang bukan http(s)", () => {
    expect(productSchema.safeParse({ ...validProduct, stock: "-1" }).success).toBe(false);
    expect(productSchema.safeParse({ ...validProduct, imageUrl: "ftp://gambar.jpg" }).success).toBe(false);
  });
});
