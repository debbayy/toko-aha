import Link from "next/link";
import { removeCartItemAction, updateCartItemAction } from "@/actions/cart-actions";
import { Icon } from "@/components/atoms/Icon";
import { Price } from "@/components/atoms/Price";
import { ProductImage } from "@/components/molecules/ProductImage";
import type { Cart } from "@/server/queries/cart";

/**
 * ORGANISM: CartItemRow
 * Satu baris barang di keranjang.
 *
 * Tombol +/− dan hapus adalah <form> kecil yang memanggil Server Action,
 * jadi komponen ini adalah Server Component dan tidak menambah JavaScript di browser.
 */

type CartItem = Cart["items"][number];

export function CartItemRow({ item }: { item: CartItem }) {
  const { product, quantity } = item;
  const stepperButton = "grid size-9 place-items-center hover:bg-surface disabled:opacity-30";

  return (
    <li className="flex gap-4 py-5">
      <Link href={`/produk/${product.slug}`} className="w-20 shrink-0 sm:w-24">
        <ProductImage src={product.imageUrl} alt={product.name} className="rounded-xl border border-line" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/produk/${product.slug}`} className="line-clamp-2 text-sm font-medium hover:underline">
            {product.name}
          </Link>
          <Price amount={product.price * quantity} className="shrink-0 text-sm" />
        </div>

        <p className="text-xs text-ink-muted">
          <Price amount={product.price} className="font-normal" /> / barang
        </p>

        {!item.isAvailable && (
          <p className="text-xs font-medium text-danger">
            {product.isActive ? `Stok tinggal ${product.stock}. Kurangi jumlahnya.` : "Produk ini sudah tidak dijual."}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center overflow-hidden rounded-control border border-line">
            <form action={updateCartItemAction}>
              <input type="hidden" name="itemId" value={item.id} />
              <input type="hidden" name="quantity" value={quantity - 1} />
              <button type="submit" className={stepperButton} aria-label={`Kurangi ${product.name}`}>
                <Icon name="minus" className="size-4" />
              </button>
            </form>
            <span className="w-10 text-center text-sm font-semibold tabular-nums" aria-label="Jumlah">
              {quantity}
            </span>
            <form action={updateCartItemAction}>
              <input type="hidden" name="itemId" value={item.id} />
              <input type="hidden" name="quantity" value={quantity + 1} />
              <button
                type="submit"
                className={stepperButton}
                disabled={quantity >= product.stock}
                aria-label={`Tambah ${product.name}`}
              >
                <Icon name="plus" className="size-4" />
              </button>
            </form>
          </div>

          <form action={removeCartItemAction}>
            <input type="hidden" name="itemId" value={item.id} />
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-control px-2 py-1.5 text-xs font-medium text-ink-muted hover:bg-surface hover:text-danger"
            >
              <Icon name="trash" className="size-4" /> Hapus
            </button>
          </form>
        </div>
      </div>
    </li>
  );
}
