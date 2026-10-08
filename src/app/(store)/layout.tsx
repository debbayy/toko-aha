import { StoreTemplate } from "@/components/templates/StoreTemplate";
import { getCurrentUser } from "@/server/dal";
import { getCartCount } from "@/server/queries/cart";

/** Layout semua halaman toko: ambil data user & keranjang, lalu serahkan ke template. */
export default async function StoreLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();
  const cartCount = user ? await getCartCount(user.id) : 0;

  return (
    <StoreTemplate user={user} cartCount={cartCount}>
      {children}
    </StoreTemplate>
  );
}
