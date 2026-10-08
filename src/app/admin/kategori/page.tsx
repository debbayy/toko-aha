import type { Metadata } from "next";
import { deleteCategoryAction } from "@/actions/admin-actions";
import { ConfirmButton } from "@/components/molecules/ConfirmButton";
import { PageHeading } from "@/components/molecules/PageHeading";
import { CategoryForm } from "@/components/organisms/CategoryForm";
import { getCategoriesWithCount } from "@/server/queries/admin-catalog";

export const metadata: Metadata = { title: "Kategori" };

export default async function AdminCategoriesPage() {
  const categories = await getCategoriesWithCount();

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <PageHeading title="Kategori" description="Kelompokkan produk agar pembeli lebih mudah mencari." />

      <CategoryForm />

      {categories.length > 0 && (
        <ul className="divide-y divide-line rounded-panel border border-line">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-sm font-semibold">{category.name}</p>
                <p className="text-xs text-ink-muted">{category._count.products} produk</p>
              </div>
              <form action={deleteCategoryAction}>
                <input type="hidden" name="categoryId" value={category.id} />
                <ConfirmButton
                  message={`Hapus kategori "${category.name}"? Produknya tidak ikut terhapus.`}
                  className="rounded-control px-3 py-2 text-danger hover:bg-danger/8"
                >
                  Hapus
                </ConfirmButton>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
