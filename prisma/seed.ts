/**
 * Mengisi database dengan data awal: 1 akun admin, beberapa kategori & produk contoh.
 * Jalankan dengan:  npm run db:seed
 * Aman dijalankan berulang kali (memakai upsert, tidak membuat data dobel).
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const categories = [
  { name: "Pakaian", slug: "pakaian" },
  { name: "Aksesoris", slug: "aksesoris" },
  { name: "Rumah & Dapur", slug: "rumah-dapur" },
];

// Gambar contoh dari picsum.photos — ganti dengan foto produk asli.
const image = (seed: string) => `https://picsum.photos/seed/${seed}/800/800`;

const products = [
  { name: "Kaos Katun Combed 30s Hitam", slug: "kaos-katun-combed-30s-hitam", price: 79_000, stock: 40, category: "pakaian", description: "Kaos katun combed 30s yang adem dan tidak mudah melar.\nTersedia ukuran S sampai XXL." },
  { name: "Kemeja Linen Lengan Pendek", slug: "kemeja-linen-lengan-pendek", price: 189_000, stock: 15, category: "pakaian", description: "Kemeja linen ringan untuk cuaca panas. Cocok untuk kerja maupun santai." },
  { name: "Hoodie Fleece Abu Muda", slug: "hoodie-fleece-abu-muda", price: 239_000, stock: 4, category: "pakaian", description: "Hoodie fleece tebal dengan kantong depan dan tali serut." },
  { name: "Topi Baseball Polos", slug: "topi-baseball-polos", price: 59_000, stock: 30, category: "aksesoris", description: "Topi baseball bahan twill dengan pengait besi di belakang." },
  { name: "Tote Bag Kanvas Natural", slug: "tote-bag-kanvas-natural", price: 69_000, stock: 25, category: "aksesoris", description: "Tote bag kanvas tebal, muat laptop 14 inci." },
  { name: "Dompet Kulit Lipat", slug: "dompet-kulit-lipat", price: 149_000, stock: 0, category: "aksesoris", description: "Dompet kulit sapi asli dengan 6 slot kartu." },
  { name: "Botol Minum Stainless 750 ml", slug: "botol-minum-stainless-750ml", price: 119_000, stock: 50, category: "rumah-dapur", description: "Menjaga minuman dingin hingga 24 jam dan panas hingga 12 jam." },
  { name: "Set Pisau Dapur 3 in 1", slug: "set-pisau-dapur-3-in-1", price: 175_000, stock: 12, category: "rumah-dapur", description: "Isi pisau koki, pisau roti, dan pisau buah. Bahan stainless anti karat." },
  { name: "Lampu Meja LED Lipat", slug: "lampu-meja-led-lipat", price: 145_000, stock: 18, category: "rumah-dapur", description: "Tiga level kecerahan, bisa diisi ulang lewat USB-C." },
];

async function main() {
  const adminEmail = (process.env.SEED_ADMIN_EMAIL ?? "admin@toko.test").toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminPassword || adminPassword.length < 8) {
    throw new Error("Isi SEED_ADMIN_PASSWORD di file .env (minimal 8 karakter).");
  }

  await db.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN" },
    create: {
      name: "Admin Toko",
      email: adminEmail,
      role: "ADMIN",
      passwordHash: await bcrypt.hash(adminPassword, 12),
    },
  });

  for (const category of categories) {
    await db.category.upsert({ where: { slug: category.slug }, update: {}, create: category });
  }

  for (const { category, ...product } of products) {
    await db.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        imageUrl: image(product.slug),
        category: { connect: { slug: category } },
      },
    });
  }

  console.log(`Seed selesai. Login admin: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
