"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/atoms/Button";

/**
 * MOLECULE: SubmitButton
 * Tombol submit yang otomatis nonaktif & berganti teks saat form sedang dikirim,
 * supaya user tidak klik dua kali (misalnya pesanan jadi dobel).
 * Harus diletakkan DI DALAM <form>.
 */

type SubmitButtonProps = {
  children: string;
  pendingText?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export function SubmitButton({ children, pendingText = "Memproses…", ...styleProps }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} aria-busy={pending} {...styleProps}>
      {pending ? pendingText : children}
    </Button>
  );
}
