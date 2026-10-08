"use client";

import { useActionState, useEffect, useRef } from "react";
import { createCategoryAction } from "@/actions/admin-actions";
import { Input } from "@/components/atoms/Input";
import { SubmitButton } from "@/components/molecules/SubmitButton";
import { initialFormState } from "@/lib/form-state";

/** ORGANISM: Form tambah kategori. Input dikosongkan otomatis setelah berhasil. */
export function CategoryForm() {
  const [state, formAction] = useActionState(createCategoryAction, initialFormState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  const error = state.fieldErrors?.name?.[0];

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2" noValidate>
      <label htmlFor="category-name" className="text-sm font-medium">
        Kategori baru
      </label>
      <div className="flex gap-2">
        <Input
          id="category-name"
          name="name"
          placeholder="Contoh: Aksesoris"
          defaultValue={state.success ? "" : state.values?.name}
          invalid={Boolean(error)}
          className="max-w-xs"
        />
        <SubmitButton pendingText="Menambah…">Tambah</SubmitButton>
      </div>
      {error && <p className="text-xs font-medium text-danger">{error}</p>}
      {state.success && <p className="text-xs font-medium text-success">{state.message}</p>}
    </form>
  );
}
