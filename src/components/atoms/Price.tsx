import { cn } from "@/lib/cn";
import { formatRupiah } from "@/lib/format";

/**
 * ATOM: Price
 * Menampilkan harga Rupiah. `tabular-nums` membuat lebar tiap angka sama,
 * sehingga harga di dalam daftar terlihat rapi sejajar.
 *
 * <Price amount={150000} />            -> Rp 150.000
 * <Price amount={150000} highlight />  -> Rp 150.000 dengan latar kuning label
 */

type PriceProps = {
  amount: number;
  highlight?: boolean;
  className?: string;
};

export function Price({ amount, highlight = false, className }: PriceProps) {
  return (
    <span
      className={cn(
        "font-bold tabular-nums",
        highlight && "inline-block rounded-md bg-tag px-1.5 py-0.5 text-on-tag",
        className,
      )}
    >
      {formatRupiah(amount)}
    </span>
  );
}
