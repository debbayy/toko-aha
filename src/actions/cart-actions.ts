"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { storeConfig } from "@/lib/config";
import type { FormState } from "@/lib/form-state";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { cartQuantitySchema } from "@/lib/validation";
import { db } from "@/server/db";
import { getCurrentUser, requireUser } from "@/server/dal";

/**
 * Server Action untuk keranjang belanja.
 * Setiap aksi SELALU memeriksa ulang user yang login & stok di database.
 */

export async function addToCartAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) {
    // Belum login: arahkan ke halaman masuk, lalu kembali ke halaman produk.
    const returnTo = safeRedirectPath(formData.get("returnTo"), "/produk");
    redirect(`/masuk?callbackUrl=${encodeURIComponent(returnTo)}`);
  }

  const parsed = cartQuantitySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { message: "Jumlah tidak valid." };
  }

  const { productId, quantity } = parsed.data;

  const product = await db.product.findFirst({
    where: { id: productId, isActive: true },
    select: { stock: true },
  });
  if (!product) {
    return { message: "Produk tidak ditemukan." };
  }

  const existing = await db.cartItem.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
    select: { quantity: true },
  });

  const maxAllowed = Math.min(product.stock, storeConfig.maxQuantityPerItem);
  const newQuantity = (existing?.quantity ?? 0) + quantity;

  if (newQuantity > maxAllowed) {
    return { message: `Stok tersisa ${product.stock}. Di keranjang sudah ada ${existing?.quantity ?? 0}.` };
  }

  // upsert = update bila sudah ada, create bila belum.
  await db.cartItem.upsert({
    where: { userId_productId: { userId: user.id, productId } },
    update: { quantity: newQuantity },
    create: { userId: user.id, productId, quantity: newQuantity },
  });

  revalidatePath("/", "layout"); // perbarui angka keranjang di header
  return { success: true, message: "Berhasil masuk keranjang." };
}

export async function updateCartItemAction(formData: FormData): Promise<void> {
  const user = await requireUser("/keranjang");
  const itemId = String(formData.get("itemId") ?? "");
  const quantity = Number(formData.get("quantity"));

  if (!Number.isInteger(quantity)) return;

  if (quantity < 1) {
    // Filter `userId` mencegah user menghapus keranjang orang lain.
    await db.cartItem.deleteMany({ where: { id: itemId, userId: user.id } });
  } else {
    const item = await db.cartItem.findFirst({
      where: { id: itemId, userId: user.id },
      select: { product: { select: { stock: true } } },
    });
    if (!item) return;

    const safeQuantity = Math.min(quantity, item.product.stock, storeConfig.maxQuantityPerItem);
    await db.cartItem.update({ where: { id: itemId }, data: { quantity: Math.max(safeQuantity, 1) } });
  }

  revalidatePath("/", "layout");
}

export async function removeCartItemAction(formData: FormData): Promise<void> {
  const user = await requireUser("/keranjang");
  const itemId = String(formData.get("itemId") ?? "");

  await db.cartItem.deleteMany({ where: { id: itemId, userId: user.id } });
  revalidatePath("/", "layout");
}
