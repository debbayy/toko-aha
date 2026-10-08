import { ButtonLink } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { EmptyState } from "@/components/molecules/EmptyState";

/** Halaman 404 — tampil saat URL tidak ada atau `notFound()` dipanggil. */
export default function NotFound() {
  return (
    <Container className="py-20">
      <EmptyState
        icon="search"
        title="Halaman tidak ditemukan"
        description="Link-nya mungkin salah ketik, atau produknya sudah tidak dijual."
        action={<ButtonLink href="/">Kembali ke beranda</ButtonLink>}
      />
    </Container>
  );
}
