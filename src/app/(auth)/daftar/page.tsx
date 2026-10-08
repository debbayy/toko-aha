import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/organisms/AuthForms";
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { getCurrentUser } from "@/server/dal";

export const metadata: Metadata = { title: "Daftar" };

export default async function RegisterPage({ searchParams }: PageProps<"/daftar">) {
  const { callbackUrl } = await searchParams;
  const safeCallbackUrl = safeRedirectPath(callbackUrl);

  if (await getCurrentUser()) redirect(safeCallbackUrl);

  return (
    <AuthTemplate
      title="Buat akun"
      description="Satu akun untuk belanja dan memantau semua pesananmu."
      footer={
        <>
          Sudah punya akun?{" "}
          <Link href={`/masuk?callbackUrl=${encodeURIComponent(safeCallbackUrl)}`} className="font-semibold text-brand hover:underline">
            Masuk
          </Link>
        </>
      }
    >
      <RegisterForm callbackUrl={safeCallbackUrl} />
    </AuthTemplate>
  );
}
