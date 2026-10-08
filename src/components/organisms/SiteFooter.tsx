import { Container } from "@/components/atoms/Container";
import { storeConfig } from "@/lib/config";
import { formatRupiah } from "@/lib/format";

/** ORGANISM: Footer toko. */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-line">
      <Container className="flex flex-col gap-2 py-8 text-sm text-ink-muted sm:flex-row sm:justify-between">
        <p>
          © {year} {storeConfig.name}
        </p>
        {storeConfig.freeShippingMin > 0 && (
          <p>Gratis ongkir untuk belanja mulai {formatRupiah(storeConfig.freeShippingMin)}</p>
        )}
      </Container>
    </footer>
  );
}
