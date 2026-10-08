import type { ReactNode } from "react";
import { Logo } from "@/components/atoms/Logo";

/**
 * TEMPLATE: AuthTemplate
 * Tata letak halaman masuk & daftar: logo + kotak form di tengah layar.
 */

type AuthTemplateProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthTemplate({ title, description, children, footer }: AuthTemplateProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-surface px-4 py-12">
      <Logo />
      <div className="w-full max-w-sm rounded-panel border border-line bg-canvas p-6 sm:p-8">
        <div className="mb-6 flex flex-col gap-1">
          <h1 className="text-xl font-extrabold tracking-tight">{title}</h1>
          <p className="text-sm text-ink-muted">{description}</p>
        </div>
        {children}
      </div>
      <p className="text-sm text-ink-muted">{footer}</p>
    </div>
  );
}
