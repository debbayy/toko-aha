import Link from "next/link";
import { Price } from "@/components/atoms/Price";
import { OrderStatusBadge } from "@/components/molecules/OrderStatusBadge";
import { ProductImage } from "@/components/molecules/ProductImage";
import { OrderSummary } from "@/components/organisms/OrderSummary";
import { formatDateTime } from "@/lib/format";
import type { OrderDetail } from "@/server/queries/orders";

/**
 * ORGANISM: OrderDetailView
 * Isi lengkap satu pesanan. Dipakai di halaman pembeli DAN admin,
 * jadi tampilan keduanya selalu konsisten.
 */
export function OrderDetailView({ order }: { order: OrderDetail }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <p className="text-sm text-ink-muted">Dipesan {formatDateTime(order.createdAt)}</p>
        </div>

        <section aria-labelledby="items-heading" className="flex flex-col gap-2">
          <h2 id="items-heading" className="text-base font-bold">
            Barang
          </h2>
          <ul className="divide-y divide-line">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-4">
                <div className="w-16 shrink-0">
                  <ProductImage src={item.product?.imageUrl ?? null} alt={item.productName} className="rounded-lg border border-line" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  {item.product ? (
                    <Link href={`/produk/${item.product.slug}`} className="truncate text-sm font-medium hover:underline">
                      {item.productName}
                    </Link>
                  ) : (
                    <p className="truncate text-sm font-medium">{item.productName}</p>
                  )}
                  <p className="text-xs text-ink-muted">
                    {item.quantity} × <Price amount={item.price} className="font-normal" />
                  </p>
                </div>
                <Price amount={item.price * item.quantity} className="text-sm" />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="shipping-heading" className="flex flex-col gap-2">
          <h2 id="shipping-heading" className="text-base font-bold">
            Dikirim ke
          </h2>
          <address className="text-sm leading-relaxed text-ink-muted not-italic">
            <span className="font-semibold text-ink">{order.recipientName}</span>
            <br />
            {order.phone}
            <br />
            {order.address}
            <br />
            {order.city} {order.postalCode}
          </address>
          {order.notes && <p className="text-sm text-ink-muted">Catatan: {order.notes}</p>}
        </section>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <OrderSummary totals={{ subtotal: order.subtotal, shippingCost: order.shippingCost, total: order.total }} />
      </div>
    </div>
  );
}
