"use client";

import { useActionState } from "react";
import { placeOrderAction } from "@/actions/order-actions";
import { Alert } from "@/components/atoms/Alert";
import { Input, Textarea } from "@/components/atoms/Input";
import { FormField } from "@/components/molecules/FormField";
import { SubmitButton } from "@/components/molecules/SubmitButton";
import { initialFormState } from "@/lib/form-state";

/**
 * ORGANISM: CheckoutForm
 * Form alamat pengiriman. Bila berhasil, Server Action langsung redirect
 * ke halaman detail pesanan. Bila gagal, pesan error tampil per field.
 */

export function CheckoutForm({ defaultName }: { defaultName: string }) {
  const [state, formAction] = useActionState(placeOrderAction, initialFormState);
  const errors = state.fieldErrors;
  const values = state.values;

  // Helper kecil agar penulisan tiap field tidak berulang-ulang.
  const fieldProps = (name: string) => ({
    id: name,
    name,
    invalid: Boolean(errors?.[name]),
    "aria-describedby": errors?.[name] ? `${name}-error` : undefined,
  });

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state.message && <Alert tone="danger">{state.message}</Alert>}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Nama penerima" htmlFor="recipientName" error={errors?.recipientName?.[0]}>
          <Input {...fieldProps("recipientName")} autoComplete="name" defaultValue={values?.recipientName ?? defaultName} required />
        </FormField>

        <FormField label="Nomor HP" htmlFor="phone" error={errors?.phone?.[0]} hint="Untuk dihubungi kurir">
          <Input {...fieldProps("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="081234567890" defaultValue={values?.phone} required />
        </FormField>
      </div>

      <FormField label="Alamat lengkap" htmlFor="address" error={errors?.address?.[0]} hint="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan">
        <Textarea {...fieldProps("address")} autoComplete="street-address" rows={3} defaultValue={values?.address} required />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Kota / kabupaten" htmlFor="city" error={errors?.city?.[0]}>
          <Input {...fieldProps("city")} autoComplete="address-level2" defaultValue={values?.city} required />
        </FormField>

        <FormField label="Kode pos" htmlFor="postalCode" error={errors?.postalCode?.[0]}>
          <Input {...fieldProps("postalCode")} inputMode="numeric" autoComplete="postal-code" maxLength={5} defaultValue={values?.postalCode} required />
        </FormField>
      </div>

      <FormField label="Catatan untuk penjual (opsional)" htmlFor="notes" error={errors?.notes?.[0]}>
        <Input {...fieldProps("notes")} placeholder="Contoh: warna cadangan biru" defaultValue={values?.notes} />
      </FormField>

      <SubmitButton size="lg" fullWidth pendingText="Membuat pesanan…">
        Buat pesanan
      </SubmitButton>
    </form>
  );
}
