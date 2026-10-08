# Dropsip Store

Website toko online (satu penjual) dengan Next.js 16, Prisma 7, PostgreSQL, dan Auth.js.

Fitur:

- **Pembeli**: daftar & masuk, cari/filter/urutkan produk, keranjang, checkout dengan alamat, riwayat & detail pesanan, batalkan pesanan yang belum diproses.
- **Admin** (`/admin`): ringkasan penjualan, kelola produk & stok, kategori, dan ubah status pesanan.
- **Aturan bisnis**: harga & ongkir dihitung di server, stok tidak bisa minus walau dua orang checkout bersamaan, stok kembali saat pesanan dibatalkan.

Belum termasuk: pembayaran online dan upload gambar (gambar produk berupa URL).

---

## 1. Menjalankan di laptop

Butuh **Node.js 20.9+** dan **PostgreSQL**.

```bash
npm install                       # otomatis menjalankan prisma generate
cp .env.example .env              # lalu isi DATABASE_URL & AUTH_SECRET
npx auth secret                   # membuat AUTH_SECRET otomatis
npm run db:migrate -- --name init # membuat tabel di database
npm run db:seed                   # akun admin + produk contoh
npm run dev                       # buka http://localhost:3000
```

Login admin memakai `SEED_ADMIN_EMAIL` dan `SEED_ADMIN_PASSWORD` di file `.env`.

## 2. Perintah yang sering dipakai

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Server development |
| `npm test` | Jalankan semua unit test sekali |
| `npm run test:watch` | Unit test otomatis jalan ulang saat file disimpan |
| `npm run typecheck` | Cek error TypeScript |
| `npm run lint` | Cek gaya & kesalahan umum kode |
| `npm run db:migrate -- --name <nama>` | Buat migrasi baru setelah mengubah `prisma/schema.prisma` |
| `npm run build` | Build production |

## 3. Struktur folder

```
prisma/
  schema.prisma        bentuk tabel database
  seed.ts              data awal
src/
  app/                 HALAMAN (routing Next.js). Tipis: ambil data lalu tampilkan komponen.
    (store)/           halaman toko: beranda, produk, keranjang, checkout, pesanan
    (auth)/            halaman masuk & daftar
    admin/             panel admin
  actions/             SERVER ACTION: dipanggil oleh form (login, keranjang, checkout, admin)
  server/              kode yang HANYA boleh jalan di server
    db.ts              koneksi database (Prisma)
    dal.ts             cek login & hak akses (requireUser, requireAdmin)
    queries/           ambil data dari database
    services/          aturan bisnis yang rumit (checkout, ubah status)
  lib/                 fungsi kecil murni: format Rupiah, hitung ongkir, validasi, dll
  components/          komponen UI, disusun dengan ATOMIC DESIGN (lihat bawah)
tests/                 pengaturan Vitest
```

Tanda `(store)` dan `(auth)` adalah *route group*: tidak muncul di URL, hanya untuk membagi layout.

## 4. Atomic design

Komponen dibagi dari yang paling kecil ke paling besar. Komponen hanya boleh memakai komponen di level yang **sama atau lebih kecil**.

| Level | Isinya | Contoh |
| --- | --- | --- |
| `atoms/` | Elemen terkecil, tidak tahu soal bisnis | `Button`, `Input`, `Price`, `Badge`, `Skeleton`, `Icon` |
| `molecules/` | Gabungan beberapa atom dengan satu tugas | `FormField`, `ProductImage`, `SearchBar`, `Pagination` |
| `organisms/` | Bagian halaman yang utuh, boleh tahu data bisnis | `SiteHeader`, `ProductCard`, `CheckoutForm`, `OrderSummary` |
| `templates/` | Kerangka tata letak halaman, tanpa ambil data | `StoreTemplate`, `AuthTemplate`, `AdminTemplate` |
| `app/**/page.tsx` | Halaman: ambil data, lalu isi template | `app/(store)/keranjang/page.tsx` |

## 5. Alur data (contoh: tombol "Masukkan keranjang")

```
AddToCartForm (organism, client)
   └─ submit form ─▶ addToCartAction (actions/cart-actions.ts)
                        ├─ getCurrentUser()        cek sudah login
                        ├─ validasi dengan zod     lib/validation.ts
                        ├─ cek stok di database    server/db.ts
                        └─ revalidatePath()        header ikut update jumlah keranjang
```

Aturan penting:

1. **Jangan percaya data dari browser.** Harga, stok, dan hak akses selalu dicek ulang di server.
2. **Setiap Server Action admin wajib diawali `await requireAdmin()`.** Menyembunyikan tombol saja tidak cukup.
3. **Query yang menyangkut data user selalu difilter `userId`**, supaya user tidak bisa membuka data orang lain.
4. **Logika yang bisa dites, taruh di `lib/` atau `server/services/`**, bukan di komponen.

## 6. Kenapa halamannya ringan

- Hampir semua komponen adalah **Server Component**: HTML dibuat di server, tidak menambah JavaScript di browser. Hanya komponen interaktif yang memakai `"use client"`.
- Tanpa library UI dan tanpa library ikon; ikon ditulis langsung sebagai SVG.
- Tanpa web font: memakai font bawaan perangkat.
- Gambar memakai `loading="lazy"` dan menampilkan **skeleton** sampai selesai diunduh (`components/molecules/ProductImage.tsx`).
- Filter, urutan, pagination, menu akun, dan tombol +/− keranjang tetap jalan **tanpa JavaScript** (memakai link, form, dan `<details>`).
- Setiap halaman yang ambil data punya `loading.tsx` berbentuk skeleton.

## 7. Unit test

Test diletakkan di samping file yang dites, berakhiran `.test.ts` atau `.test.tsx`.

- `src/lib/*.test.ts`: fungsi murni (format, ongkir, validasi, status pesanan, nomor invoice).
- `src/server/services/order-service.test.ts`: checkout & ubah status, memakai database palsu (mock), jadi tidak perlu PostgreSQL.
- `src/components/**/*.test.tsx`: komponen, termasuk perilaku skeleton gambar.

## 8. Deploy

1. Siapkan PostgreSQL (misalnya Neon, Supabase, atau Railway).
2. Isi environment variable seperti di `.env.example` pada hosting (Vercel, dll). `AUTH_SECRET` wajib diisi.
3. Jalankan `npm run db:deploy` untuk menerapkan migrasi ke database production.
4. Build dengan `npm run build`.

Ide pengembangan berikutnya: payment gateway (Midtrans/Xendit), upload gambar ke object storage, rate limit untuk login, dan pilihan kurir dengan ongkir dinamis.
