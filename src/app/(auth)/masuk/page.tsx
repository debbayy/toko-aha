import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/organisms/AuthForms";
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { getCurrentUser } from "@/server/dal";

export const metadata: Metadata = { title: "Masuk" };

export default async function LoginPage({ searchParams }: PageProps<"/masuk">) {
  const { callbackUrl } = await searchParams;
  const safeCallbackUrl = safeRedirectPath(callbackUrl);

  // Sudah login? Tidak perlu lihat halaman ini.
  if (await getCurrentUser()) redirect(safeCallbackUrl);

  return (
    <AuthTemplate
      title="Masuk"
      description="Masuk untuk belanja dan melihat pesananmu."
      footer={
        <>
          Belum punya akun?{" "}
          <Link href={`/daftar?callbackUrl=${encodeURIComponent(safeCallbackUrl)}`} className="font-semibold text-brand hover:underline">
            Daftar
          </Link>
        </>
      }
    >
      <LoginForm callbackUrl={safeCallbackUrl} />
    </AuthTemplate>
  );
}
