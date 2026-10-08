import type { ReactNode } from "react";
import { Price } from "@/components/atoms/Price";
import { SummaryRow } from "@/components/molecules/SummaryRow";
import type { OrderTotals } from "@/lib/pricing";

/**
 * ORGANISM: OrderSummary
 * Ringkasan subtotal, ongkir, dan total. Dipakai di keranjang, checkout, dan detail pesanan.
 * `children` untuk menaruh tombol aksi di bagian bawah (misalnya "Lanjut ke checkout").
 */

type OrderSummaryProps = {
  totals: OrderTotals;
  /** Pesan tambahan, misalnya info sisa belanja untuk gratis ongkir. */
  note?: string;
  children?: ReactNode;
};

export function OrderSummary({ totals, note, children }: OrderSummaryProps) {
  return (
    <section aria-label="Ringkasan belanja" className="flex flex-col gap-4 rounded-panel bg-surface p-5">
      <h2 className="text-base font-bold">Ringkasan</h2>
      <dl className="flex flex-col gap-2.5">
        <SummaryRow label="Subtotal" value={<Price amount={totals.subtotal} className="font-medium" />} />
        <SummaryRow
          label="Ongkos kirim"
          value={totals.shippingCost === 0 && totals.subtotal > 0 ? "Gratis" : <Price amount={totals.shippingCost} className="font-medium" />}
        />
        <div className="my-1 border-t border-dashed border-line" />
        <SummaryRow label="Total" value={<Price amount={totals.total} highlight />} emphasize />
      </dl>
      {note && <p className="text-xs text-ink-muted">{note}</p>}
      {children}
    </section>
  );
}
