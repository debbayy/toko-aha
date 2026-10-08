import "server-only";
import { cache } from "react";
import type { Prisma } from "@/generated/prisma/client";
import type { CatalogParams } from "@/lib/catalog-params";
import { storeConfig } from "@/lib/config";
import { db } from "@/server/db";

/**
 * Query untuk halaman publik toko (katalog & detail produk).
 * Hanya produk aktif (`isActive: true`) yang boleh tampil ke pembeli.
 */

/** Field yang dibutuhkan kartu produk — sengaja dibatasi agar data yang dikirim kecil. */
const productCardSelect = {
  id: true,
  name: true,
  slug: true,
  price: true,
  stock: true,
  imageUrl: true,
  category: { select: { name: true } },
} satisfies Prisma.ProductSelect;

export type ProductCardData = Prisma.ProductGetPayload<{ select: typeof productCardSelect }>;

export function getCategories() {
  return db.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });
}

export function getLatestProducts(limit = 8): Promise<ProductCardData[]> {
  return db.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: productCardSelect,
  });
}

const sortToOrderBy: Record<CatalogParams["sort"], Prisma.ProductOrderByWithRelationInput> = {
  terbaru: { createdAt: "desc" },
  termurah: { price: "asc" },
  termahal: { price: "desc" },
};

export async function searchProducts(params: CatalogParams) {
  const pageSize = storeConfig.productsPerPage;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(params.query && { name: { contains: params.query, mode: "insensitive" } }),
    ...(params.categorySlug && { category: { slug: params.categorySlug } }),
  };

  // Jalankan dua query sekaligus (paralel) agar lebih cepat.
  const [products, totalCount] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: [sortToOrderBy[params.sort], { id: "asc" }],
      skip: (params.page - 1) * pageSize,
      take: pageSize,
      select: productCardSelect,
    }),
    db.product.count({ where }),
  ]);

  return {
    products,
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
  };
}

/** `cache` agar generateMetadata & page tidak query dua kali untuk produk yang sama. */
export const getProductBySlug = cache((slug: string) =>
  db.product.findFirst({
    where: { slug, isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      stock: true,
      imageUrl: true,
      category: { select: { name: true, slug: true } },
    },
  }),
);
