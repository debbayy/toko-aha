import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";
import { Button, ButtonLink } from "./Button";
import { Input } from "./Input";
import { Price } from "./Price";
import { Skeleton } from "./Skeleton";

describe("Button", () => {
  it("default-nya type=button agar tidak submit form tanpa sengaja", () => {
    render(<Button>Simpan</Button>);
    expect(screen.getByRole("button", { name: "Simpan" })).toHaveAttribute("type", "button");
  });

  it("bisa dinonaktifkan", () => {
    render(<Button disabled>Simpan</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("ButtonLink dirender sebagai link", () => {
    render(<ButtonLink href="/produk">Belanja</ButtonLink>);
    expect(screen.getByRole("link", { name: "Belanja" })).toHaveAttribute("href", "/produk");
  });
});

describe("Price", () => {
  it("menampilkan harga dalam Rupiah", () => {
    render(<Price amount={150000} />);
    expect(screen.getByText("Rp 150.000")).toBeInTheDocument();
  });

  it("memakai latar kuning saat highlight", () => {
    render(<Price amount={1000} highlight />);
    expect(screen.getByText("Rp 1.000")).toHaveClass("bg-tag");
  });
});

describe("Badge", () => {
  it("menampilkan teks dengan warna sesuai tone", () => {
    render(<Badge tone="danger">Stok habis</Badge>);
    expect(screen.getByText("Stok habis")).toHaveClass("text-danger");
  });
});

describe("Input", () => {
  it("menandai aria-invalid saat ada error", () => {
    render(<Input aria-label="Email" invalid />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  });
});

describe("Skeleton", () => {
  it("disembunyikan dari pembaca layar", () => {
    render(<Skeleton className="h-4" />);
    expect(screen.getByTestId("skeleton")).toHaveAttribute("aria-hidden", "true");
  });
});
