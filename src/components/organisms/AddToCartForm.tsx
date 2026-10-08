"use client";

import { useActionState, useState } from "react";
import { addToCartAction } from "@/actions/cart-actions";
import { Alert } from "@/components/atoms/Alert";
import { ButtonLink } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { SubmitButton } from "@/components/molecules/SubmitButton";
import { initialFormState } from "@/lib/form-state";

/**
 * ORGANISM: AddToCartForm
 * Pilih jumlah lalu masukkan ke keranjang.
 * Validasi stok yang sebenarnya tetap dilakukan di server (addToCartAction).
 */

type AddToCartFormProps = {
  productId: string;
  stock: number;
  /** Halaman tujuan setelah login, bila user belum login. */
  returnTo: string;
};

export function AddToCartForm({ productId, stock, returnTo }: AddToCartFormProps) {
  const [state, formAction] = useActionState(addToCartAction, initialFormState);
  const [quantity, setQuantity] = useState(1);

  if (stock === 0) {
    return <Alert>Stok sedang habis. Cek lagi nanti ya.</Alert>;
  }

  const maxQuantity = Math.min(stock, 99);
  const stepperButton = "grid size-11 place-items-center text-ink hover:bg-surface disabled:opacity-30";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="returnTo" value={returnTo} />

      <div className="flex items-center gap-3">
        <div className="flex items-center overflow-hidden rounded-control border border-line">
          <button
            type="button"
            className={stepperButton}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Kurangi jumlah"
          >
            <Icon name="minus" className="size-4" />
          </button>
          <input
            name="quantity"
            type="number"
            inputMode="numeric"
            min={1}
            max={maxQuantity}
            value={quantity}
            onChange={(event) => {
              const value = Number(event.target.value);
              setQuantity(Number.isNaN(value) ? 1 : Math.min(Math.max(1, value), maxQuantity));
            }}
            aria-label="Jumlah"
            className="h-11 w-14 [appearance:textfield] border-x border-line bg-canvas text-center text-sm font-semibold tabular-nums focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            type="button"
            className={stepperButton}
            onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
            disabled={quantity >= maxQuantity}
            aria-label="Tambah jumlah"
          >
            <Icon name="plus" className="size-4" />
          </button>
        </div>
        <p className="text-sm text-ink-muted">Stok {stock}</p>
      </div>

      <SubmitButton size="lg" fullWidth pendingText="Menambahkan…">
        Masukkan keranjang
      </SubmitButton>

      {state.message && (
        <div className="flex flex-col gap-2" aria-live="polite">
          <Alert tone={state.success ? "success" : "danger"}>{state.message}</Alert>
          {state.success && (
            <ButtonLink href="/keranjang" variant="secondary" fullWidth>
              Lihat keranjang
            </ButtonLink>
          )}
        </div>
      )}
    </form>
  );
}
