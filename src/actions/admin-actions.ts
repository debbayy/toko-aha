"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { formDataToObject, type FormState } from "@/lib/form-state";
import { isOrderStatus } from "@/lib/order-status";
import { slugify, withRandomSuffix } from "@/lib/slug";
import { categorySchema, productSchema, toFieldErrors } from "@/lib/validation";
import { db } from "@/server/db";
import { requireAdmin } from "@/server/dal";
import { changeOrderStatus, OrderError } from "@/server/services/order-service";

/**
 * Server Action khusus admin.
 * Baris pertama setiap fungsi WAJIB `await requireAdmin()` —
 * Server Action bisa dipanggil langsung lewat HTTP, jadi menyembunyikan
 * tombol di UI saja tidak cukup untuk keamanan.
 */

/** Membuat slug unik. Bila "kaos-polos" sudah dipakai, jadi "kaos-polos-x7k2". */
async function createUniqueProductSlug(name: string, ignoreProductId?: string): Promise<string> {
  const baseSlug = slugify(name) || "produk";
  const taken = await db.product.findFirst({
    where: { slug: baseSlug, NOT: ignoreProductId ? { id: ignoreProductId } : undefined },
    select: { id: true },
  });
  return taken ? withRandomSuffix(baseSlug) : baseSlug;
}

// ---------- Produk ----------

export async function saveProductAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = formDataToObject(formData);
  const productId = values.id || undefined; // ada id = edit, tidak ada = produk baru

  const parsed = productSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error), values };
  }

  const data = parsed.data;
  const slug = await createUniqueProductSlug(data.name, productId);

  if (productId) {
    await db.product.update({ where: { id: productId }, data: { ...data, slug } });
  } else {
    await db.product.create({ data: { ...data, slug } });
  }

  revalidatePath("/", "layout");
  redirect("/admin/produk");
}

export async function toggleProductActiveAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const productId = String(formData.get("productId") ?? "");
  const product = await db.product.findUnique({ where: { id: productId }, select: { isActive: true } });
  if (!product) return;

  await db.product.update({ where: { id: productId }, data: { isActive: !product.isActive } });
  revalidatePath("/", "layout");
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const productId = String(formData.get("productId") ?? "");

  // Riwayat pesanan tetap aman karena OrderItem menyimpan salinan nama & harga.
  await db.product.deleteMany({ where: { id: productId } });
  revalidatePath("/", "layout");
}

// ---------- Kategori ----------

export async function createCategoryAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = formDataToObject(formData);
  const parsed = categorySchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error), values };
  }

  const slug = slugify(parsed.data.name);
  const exists = await db.category.findUnique({ where: { slug }, select: { id: true } });
  if (exists) {
    return { fieldErrors: { name: ["Kategori dengan nama ini sudah ada."] }, values };
  }

  await db.category.create({ data: { name: parsed.data.name, slug } });
  revalidatePath("/", "layout");
  return { success: true, message: "Kategori ditambahkan." };
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const categoryId = String(formData.get("categoryId") ?? "");

  // Produk di kategori ini tidak ikut terhapus, kategorinya saja yang dikosongkan.
  await db.category.deleteMany({ where: { id: categoryId } });
  revalidatePath("/", "layout");
}

// ---------- Pesanan ----------

export async function updateOrderStatusAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const orderId = String(formData.get("orderId") ?? "");
  const nextStatus = formData.get("status");

  if (!isOrderStatus(nextStatus)) {
    return { message: "Status tidak valid." };
  }

  try {
    await db.$transaction((tx) => changeOrderStatus(tx, orderId, nextStatus, { type: "admin" }));
  } catch (error) {
    if (error instanceof OrderError) return { message: error.message };
    throw error;
  }

  revalidatePath("/", "layout");
  return { success: true, message: "Status pesanan diperbarui." };
}
