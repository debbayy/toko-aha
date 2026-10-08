import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductCard } from "./ProductCard";

const baseProps = {
  name: "Kaos Polos",
  slug: "kaos-polos",
  price: 79000,
  stock: 20,
  imageUrl: "https://contoh.com/kaos.jpg",
  categoryName: "Pakaian",
};

describe("ProductCard", () => {
  it("menampilkan info produk dan link ke halaman detail", () => {
    render(<ProductCard {...baseProps} />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/produk/kaos-polos");
    expect(screen.getByRole("heading", { name: "Kaos Polos" })).toBeInTheDocument();
    expect(screen.getByText("Rp 79.000")).toBeInTheDocument();
    expect(screen.getByText("Pakaian")).toBeInTheDocument();
  });

  it("menampilkan label stok habis", () => {
    render(<ProductCard {...baseProps} stock={0} />);
    expect(screen.getByText("Stok habis")).toBeInTheDocument();
  });

  it("menampilkan sisa stok bila tinggal sedikit", () => {
    render(<ProductCard {...baseProps} stock={3} />);
    expect(screen.getByText("Sisa 3")).toBeInTheDocument();
  });

  it("tidak menampilkan label stok bila stok masih banyak", () => {
    render(<ProductCard {...baseProps} />);
    expect(screen.queryByText(/Sisa|Stok habis/)).not.toBeInTheDocument();
  });
});
