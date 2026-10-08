import type { Metadata } from "next";
import { PageHeading } from "@/components/molecules/PageHeading";
import { ProductForm } from "@/components/organisms/ProductForm";
import { getCategories } from "@/server/queries/catalog";

export const metadata: Metadata = { title: "Tambah produk" };

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <PageHeading title="Tambah produk" />
      <ProductForm categories={categories} />
    </div>
  );
}
