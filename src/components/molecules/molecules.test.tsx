import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";
import { FormField } from "./FormField";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Pagination } from "./Pagination";
import { ProductImage } from "./ProductImage";

describe("ProductImage", () => {
  it("menampilkan skeleton selama gambar belum dimuat", () => {
    render(<ProductImage src="https://contoh.com/kaos.jpg" alt="Kaos" />);

    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    expect(screen.getByAltText("Kaos")).toHaveClass("opacity-0");
  });

  it("menyembunyikan skeleton & menampilkan gambar setelah dimuat", () => {
    render(<ProductImage src="https://contoh.com/kaos.jpg" alt="Kaos" />);

    fireEvent.load(screen.getByAltText("Kaos")); // simulasikan gambar selesai diunduh

    expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();
    expect(screen.getByAltText("Kaos")).toHaveClass("opacity-100");
  });

  it("menampilkan ikon pengganti bila gambar gagal dimuat", () => {
    render(<ProductImage src="https://contoh.com/rusak.jpg" alt="Kaos" />);

    fireEvent.error(screen.getByAltText("Kaos"));

    expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Kaos" }).tagName).toBe("DIV");
  });

  it("langsung menampilkan ikon pengganti bila produk tidak punya gambar", () => {
    render(<ProductImage src={null} alt="Tanpa gambar" />);
    expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Tanpa gambar" })).toBeInTheDocument();
  });

  it("memakai lazy loading kecuali diberi priority", () => {
    const { rerender } = render(<ProductImage src="https://contoh.com/a.jpg" alt="A" />);
    expect(screen.getByAltText("A")).toHaveAttribute("loading", "lazy");

    rerender(<ProductImage src="https://contoh.com/a.jpg" alt="A" priority />);
    expect(screen.getByAltText("A")).toHaveAttribute("loading", "eager");
  });
});

describe("FormField", () => {
  it("menghubungkan label dengan input", () => {
    render(
      <FormField label="Email" htmlFor="email">
        <input id="email" />
      </FormField>,
    );
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("menampilkan error dan menyembunyikan hint", () => {
    render(
      <FormField label="Email" htmlFor="email" hint="Contoh: budi@mail.com" error="Email tidak valid">
        <input id="email" />
      </FormField>,
    );
    expect(screen.getByText("Email tidak valid")).toBeInTheDocument();
    expect(screen.queryByText("Contoh: budi@mail.com")).not.toBeInTheDocument();
  });
});

describe("Pagination", () => {
  const buildHref = (page: number) => `/produk?halaman=${page}`;

  it("tidak tampil bila hanya ada satu halaman", () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} buildHref={buildHref} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("menonaktifkan 'Sebelumnya' di halaman pertama", () => {
    render(<Pagination currentPage={1} totalPages={3} buildHref={buildHref} />);
    expect(screen.queryByRole("link", { name: "Sebelumnya" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Berikutnya" })).toHaveAttribute("href", "/produk?halaman=2");
  });
});

describe("OrderStatusBadge", () => {
  it("menampilkan label status dalam Bahasa Indonesia", () => {
    render(<OrderStatusBadge status="SHIPPED" />);
    expect(screen.getByText("Dikirim")).toBeInTheDocument();
  });
});

describe("EmptyState", () => {
  it("menampilkan judul, deskripsi, dan aksi", () => {
    render(<EmptyState icon="cart" title="Keranjang kosong" description="Ayo belanja" action={<button type="button">Belanja</button>} />);
    expect(screen.getByRole("heading", { name: "Keranjang kosong" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Belanja" })).toBeInTheDocument();
  });
});
