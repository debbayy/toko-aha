"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/atoms/Icon";
import { Skeleton } from "@/components/atoms/Skeleton";
import { cn } from "@/lib/cn";

/**
 * MOLECULE: ProductImage
 * Gambar produk yang menampilkan SKELETON selama gambar belum selesai dimuat.
 *
 * Status gambar:
 *   "loading" -> tampil skeleton berkilau, gambar disembunyikan (opacity 0)
 *   "loaded"  -> skeleton hilang, gambar muncul perlahan (fade-in)
 *   "error"   -> tampil ikon gambar (URL rusak / gambar tidak ada)
 *
 * Gambar memakai `loading="lazy"`: baru diunduh saat hampir terlihat di layar,
 * jadi halaman awal tetap ringan. Untuk gambar paling atas, pakai `priority`.
 */

type ImageStatus = "loading" | "loaded" | "error";

type ProductImageProps = {
  src: string | null;
  alt: string;
  priority?: boolean;
  className?: string;
};

export function ProductImage({ src, alt, priority = false, className }: ProductImageProps) {
  const [status, setStatus] = useState<ImageStatus>(src ? "loading" : "error");
  const imgRef = useRef<HTMLImageElement>(null);

  // Gambar yang sudah ada di cache browser bisa selesai dimuat SEBELUM React
  // siap mendengarkan event onLoad. Cek manual supaya skeleton tidak "nyangkut".
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete) {
      setStatus(img.naturalWidth > 0 ? "loaded" : "error");
    }
  }, []);

  return (
    <div className={cn("relative aspect-square overflow-hidden bg-surface", className)}>
      {status === "loading" && <Skeleton className="absolute inset-0 rounded-none" />}

      {status === "error" && (
        <div className="absolute inset-0 grid place-items-center text-ink-muted" role="img" aria-label={alt}>
          <Icon name="image" className="size-10 opacity-50" />
        </div>
      )}

      {src && status !== "error" && (
        // eslint-disable-next-line @next/next/no-img-element -- URL gambar bebas diisi admin dari domain mana pun
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={cn(
            "size-full object-cover transition-opacity duration-300",
            status === "loaded" ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
}
