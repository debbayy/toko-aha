import type { Metadata, Viewport } from "next";
import { storeConfig } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: storeConfig.name,
    template: `%s | ${storeConfig.name}`, // judul halaman lain: "Keranjang | Dropsip"
  },
  description: `Belanja online di ${storeConfig.name}.`,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1424" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
