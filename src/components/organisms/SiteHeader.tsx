import Link from "next/link";
import { logoutAction } from "@/actions/auth-actions";
import { Container } from "@/components/atoms/Container";
import { Icon } from "@/components/atoms/Icon";
import { Logo } from "@/components/atoms/Logo";
import { SearchBar } from "@/components/molecules/SearchBar";
import type { CurrentUser } from "@/server/dal";

/**
 * ORGANISM: SiteHeader
 * Header toko: logo, pencarian, keranjang, dan menu akun.
 *
 * Menu akun memakai elemen <details> bawaan HTML, jadi bisa buka-tutup
 * TANPA JavaScript — salah satu cara membuat halaman tetap ringan.
 */

type SiteHeaderProps = {
  user: CurrentUser | null;
  cartCount: number;
};

export function SiteHeader({ user, cartCount }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/90 backdrop-blur">
      <Container className="flex h-16 items-center gap-3 sm:gap-6">
        <Logo />

        <div className="hidden flex-1 sm:block">
          <SearchBar />
        </div>

        <nav className="ml-auto flex items-center gap-1" aria-label="Menu utama">
          <Link
            href="/produk"
            className="hidden h-10 items-center rounded-control px-3 text-sm font-semibold hover:bg-surface md:inline-flex"
          >
            Semua produk
          </Link>

          <Link
            href="/keranjang"
            className="relative grid size-10 place-items-center rounded-control hover:bg-surface"
            aria-label={`Keranjang, ${cartCount} barang`}
          >
            <Icon name="cart" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-tag px-1 text-[10px] font-bold text-on-tag">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {user ? <AccountMenu user={user} /> : <GuestLinks />}
        </nav>
      </Container>

      {/* Di layar HP, kolom pencarian tampil di baris kedua */}
      <Container className="pb-3 sm:hidden">
        <SearchBar />
      </Container>
    </header>
  );
}

function GuestLinks() {
  return (
    <Link href="/masuk" className="inline-flex h-10 items-center rounded-control bg-ink px-4 text-sm font-semibold text-on-ink">
      Masuk
    </Link>
  );
}

function AccountMenu({ user }: { user: CurrentUser }) {
  const firstName = user.name.split(" ")[0];
  const menuItemClass = "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-surface";

  return (
    <details className="group relative">
      <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-control px-2 hover:bg-surface [&::-webkit-details-marker]:hidden">
        <span className="grid size-7 place-items-center rounded-full bg-surface text-xs font-bold uppercase">
          {firstName.charAt(0)}
        </span>
        <span className="hidden max-w-24 truncate text-sm font-semibold sm:inline">{firstName}</span>
      </summary>

      <div className="absolute right-0 mt-2 w-52 rounded-panel border border-line bg-canvas p-1.5 shadow-lg">
        <p className="truncate px-3 py-2 text-xs text-ink-muted">{user.email}</p>
        <Link href="/pesanan" className={menuItemClass}>
          <Icon name="package" className="size-4" /> Pesanan saya
        </Link>
        {user.role === "ADMIN" && (
          <Link href="/admin" className={menuItemClass}>
            <Icon name="shield" className="size-4" /> Panel admin
          </Link>
        )}
        <form action={logoutAction}>
          <button type="submit" className={menuItemClass}>
            <Icon name="logout" className="size-4" /> Keluar
          </button>
        </form>
      </div>
    </details>
  );
}
