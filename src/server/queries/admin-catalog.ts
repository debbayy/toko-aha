import "server-only";
import { db } from "@/server/db";

/** Query katalog untuk admin: termasuk produk yang tidak aktif. */

export function getAllProductsForAdmin() {
  return db.product.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      stock: true,
      imageUrl: true,
      isActive: true,
      category: { select: { name: true } },
    },
  });
}

export function getProductForEdit(productId: string) {
  return db.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      stock: true,
      imageUrl: true,
      categoryId: true,
      isActive: true,
    },
  });
}

export function getCategoriesWithCount() {
  return db.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, _count: { select: { products: true } } },
  });
}
