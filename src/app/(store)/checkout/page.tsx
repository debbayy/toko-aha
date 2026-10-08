import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/atoms/Container";
import { PageHeading } from "@/components/molecules/PageHeading";
import { CheckoutForm } from "@/components/organisms/CheckoutForm";
import { OrderSummary } from "@/components/organisms/OrderSummary";
import { requireUser } from "@/server/dal";
import { getCart } from "@/server/queries/cart";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const user = await requireUser("/checkout");
  const cart = await getCart(user.id);

  // Keranjang kosong / bermasalah -> kembali ke keranjang.
  if (cart.items.length === 0 || cart.hasUnavailableItems) {
    redirect("/keranjang");
  }

  return (
    <Container className="flex flex-col gap-8 py-10">
      <PageHeading title="Checkout" description="Isi alamat pengiriman, lalu buat pesanan." />

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <CheckoutForm defaultName={user.name} />

        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary totals={cart.totals}>
            <ul className="flex flex-col gap-1.5 border-t border-line pt-4 text-sm text-ink-muted">
              {cart.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3">
                  <span className="truncate">{item.product.name}</span>
                  <span className="shrink-0 tabular-nums">× {item.quantity}</span>
                </li>
              ))}
            </ul>
          </OrderSummary>
        </div>
      </div>
    </Container>
  );
}
