/**
 * Perhitungan harga keranjang & pesanan.
 *
 * PENTING: Harga SELALU dihitung ulang di server dari data database,
 * jangan pernah percaya harga yang dikirim dari browser.
 */

export type PricedItem = {
  price: number; // harga satuan (Rupiah)
  quantity: number;
};

export type ShippingRule = {
  flatRate: number;
  /** Minimal subtotal untuk gratis ongkir. 0 = tidak ada gratis ongkir. */
  freeShippingMin: number;
};

export type OrderTotals = {
  subtotal: number;
  shippingCost: number;
  total: number;
};

export function calculateSubtotal(items: PricedItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateShipping(subtotal: number, rule: ShippingRule): number {
  if (subtotal === 0) return 0; // keranjang kosong tidak kena ongkir
  const isFreeShipping = rule.freeShippingMin > 0 && subtotal >= rule.freeShippingMin;
  return isFreeShipping ? 0 : rule.flatRate;
}

export function calculateOrderTotals(items: PricedItem[], rule: ShippingRule): OrderTotals {
  const subtotal = calculateSubtotal(items);
  const shippingCost = calculateShipping(subtotal, rule);
  return { subtotal, shippingCost, total: subtotal + shippingCost };
}

/** Sisa belanja agar dapat gratis ongkir (0 bila sudah gratis / fitur mati). */
export function amountUntilFreeShipping(subtotal: number, rule: ShippingRule): number {
  if (rule.freeShippingMin <= 0) return 0;
  return Math.max(rule.freeShippingMin - subtotal, 0);
}
