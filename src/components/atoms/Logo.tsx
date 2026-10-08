import Link from "next/link";
import { storeConfig } from "@/lib/config";

/**
 * ATOM: Logo
 * Nama toko dengan potongan "label paket" kuning di depannya.
 */
export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight text-ink">
      <span aria-hidden="true" className="h-5 w-2.5 -skew-x-12 rounded-[3px] bg-tag" />
      <span className="text-lg">{storeConfig.name}</span>
    </Link>
  );
}
