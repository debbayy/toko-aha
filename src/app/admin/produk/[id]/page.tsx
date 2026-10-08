import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/molecules/PageHeading";
import { ProductForm } from "@/components/organisms/ProductForm";
import { getProductForEdit } from "@/server/queries/admin-catalog";
import { getCategories } from "@/server/queries/catalog";

export const metadata: Metadata = { title: "Edit produk" };

export default async function EditProductPage({ params }: PageProps<"/admin/produk/[id]">) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductForEdit(id), getCategories()]);

  if (!product) notFound();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <PageHeading title="Edit produk" description={product.name} />
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
