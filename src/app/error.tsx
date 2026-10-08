"use client";

import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { EmptyState } from "@/components/molecules/EmptyState";

/**
 * Tampil bila terjadi error tak terduga di server (misalnya database mati).
 * Detail error TIDAK ditampilkan ke user demi keamanan — cek log server.
 */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container className="py-20">
      <EmptyState
        icon="package"
        title="Halaman gagal dimuat"
        description="Ada gangguan di server kami. Coba muat ulang dalam beberapa saat."
        action={<Button onClick={reset}>Coba lagi</Button>}
      />
    </Container>
  );
}
