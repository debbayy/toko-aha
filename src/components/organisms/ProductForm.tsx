"use client";

import { useActionState } from "react";
import { saveProductAction } from "@/actions/admin-actions";
import { Alert } from "@/components/atoms/Alert";
import { ButtonLink } from "@/components/atoms/Button";
import { Input, Select, Textarea } from "@/components/atoms/Input";
import { FormField } from "@/components/molecules/FormField";
import { ProductImage } from "@/components/molecules/ProductImage";
import { SubmitButton } from "@/components/molecules/SubmitButton";
import { initialFormState } from "@/lib/form-state";

/**
 * ORGANISM: ProductForm
 * Satu form untuk TAMBAH dan EDIT produk.
 * Bila `product` diisi -> mode edit (id dikirim sebagai hidden input).
 */

export type ProductFormValues = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  categoryId: string | null;
  isActive: boolean;
};

type ProductFormProps = {
  categories: { id: string; name: string }[];
  product?: ProductFormValues;
};

export function ProductForm({ categories, product }: ProductFormProps) {
  const [state, formAction] = useActionState(saveProductAction, initialFormState);
  const errors = state.fieldErrors;

  // Prioritas nilai awal: yang terakhir diketik (bila ada error) -> data produk -> kosong
  const value = (name: keyof ProductFormValues) => state.values?.[name] ?? String(product?.[name] ?? "");
  const isActiveDefault = state.values ? state.values.isActive === "on" : (product?.isActive ?? true);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {product && <input type="hidden" name="id" value={product.id} />}
      {state.message && <Alert tone="danger">{state.message}</Alert>}

      <FormField label="Nama produk" htmlFor="name" error={errors?.name?.[0]}>
        <Input id="name" name="name" defaultValue={value("name")} invalid={Boolean(errors?.name)} required />
      </FormField>

      <FormField label="Deskripsi" htmlFor="description" error={errors?.description?.[0]}>
        <Textarea id="description" name="description" rows={6} defaultValue={value("description")} invalid={Boolean(errors?.description)} required />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Harga (Rupiah)" htmlFor="price" error={errors?.price?.[0]} hint="Tanpa titik, contoh: 150000">
          <Input id="price" name="price" type="number" inputMode="numeric" min={100} defaultValue={value("price")} invalid={Boolean(errors?.price)} required />
        </FormField>

        <FormField label="Stok" htmlFor="stock" error={errors?.stock?.[0]}>
          <Input id="stock" name="stock" type="number" inputMode="numeric" min={0} defaultValue={value("stock") || "0"} invalid={Boolean(errors?.stock)} required />
        </FormField>
      </div>

      <FormField label="Kategori" htmlFor="categoryId">
        <Select id="categoryId" name="categoryId" defaultValue={value("categoryId")}>
          <option value="">Tanpa kategori</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="URL gambar" htmlFor="imageUrl" error={errors?.imageUrl?.[0]} hint="Link gambar dari penyimpanan online (https://…)">
        <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://" defaultValue={value("imageUrl")} invalid={Boolean(errors?.imageUrl)} />
      </FormField>

      {product?.imageUrl && (
        <div className="w-32">
          <ProductImage src={product.imageUrl} alt="Pratinjau gambar saat ini" className="rounded-xl border border-line" />
        </div>
      )}

      <label className="flex items-center gap-3 text-sm font-medium">
        <input type="checkbox" name="isActive" defaultChecked={isActiveDefault} className="size-4 accent-[var(--color-ink)]" />
        Tampilkan di toko
      </label>

      <div className="flex gap-3 border-t border-line pt-5">
        <SubmitButton pendingText="Menyimpan…">{product ? "Simpan perubahan" : "Tambah produk"}</SubmitButton>
        <ButtonLink href="/admin/produk" variant="ghost">
          Batal
        </ButtonLink>
      </div>
    </form>
  );
}
