import type { Metadata } from "next";
import { ButtonLink } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { EmptyState } from "@/components/molecules/EmptyState";
import { PageHeading } from "@/components/molecules/PageHeading";
import { CartItemRow } from "@/components/organisms/CartItemRow";
import { OrderSummary } from "@/components/organisms/OrderSummary";
import { storeConfig } from "@/lib/config";
import { formatRupiah } from "@/lib/format";
import { amountUntilFreeShipping } from "@/lib/pricing";
import { requireUser } from "@/server/dal";
import { getCart } from "@/server/queries/cart";

export const metadata: Metadata = { title: "Keranjang" };

export default async function CartPage() {
  const user = await requireUser("/keranjang");
  const cart = await getCart(user.id);

  if (cart.items.length === 0) {
    return (
      <Container className="py-10">
        <EmptyState
          icon="cart"
          title="Keranjangmu masih kosong"
          description="Barang yang kamu masukkan ke keranjang akan tampil di sini."
          action={<ButtonLink href="/produk">Mulai belanja</ButtonLink>}
        />
      </Container>
    );
  }

  const remaining = amountUntilFreeShipping(cart.totals.subtotal, {
    flatRate: storeConfig.shippingFlatRate,
    freeShippingMin: storeConfig.freeShippingMin,
  });
  const shippingNote = remaining > 0 ? `Tambah ${formatRupiah(remaining)} lagi untuk gratis ongkir.` : undefined;

  return (
    <Container className="flex flex-col gap-8 py-10">
      <PageHeading title="Keranjang" description={`${cart.items.length} jenis barang`} />

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <ul className="divide-y divide-line border-y border-line">
          {cart.items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </ul>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary totals={cart.totals} note={shippingNote}>
            {cart.hasUnavailableItems ? (
              <p className="text-sm font-medium text-danger">Perbaiki barang yang ditandai merah sebelum checkout.</p>
            ) : (
              <ButtonLink href="/checkout" size="lg" fullWidth>
                Lanjut ke checkout
              </ButtonLink>
            )}
          </OrderSummary>
        </div>
      </div>
    </Container>
  );
}
