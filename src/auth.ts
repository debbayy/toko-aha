import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/lib/validation";
import { db } from "@/server/db";

/**
 * Konfigurasi login (Auth.js).
 *
 * - Login memakai email + password yang disimpan di tabel User.
 * - Session disimpan sebagai JWT terenkripsi di cookie (tidak perlu tabel session).
 * - `id` dan `role` user ikut disimpan di token supaya bisa dibaca di server.
 *
 * Catatan keamanan: role di token bisa basi bila admin mengubah role user.
 * Karena itu pengecekan hak akses penting dilakukan ulang ke database
 * di `src/server/dal.ts`.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 }, // 7 hari
  pages: { signIn: "/masuk" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = loginSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await db.user.findUnique({ where: { email } });
        if (!user) return null;

        const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordCorrect) return null;

        // Hanya kirim data yang aman — JANGAN sertakan passwordHash.
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    // Dipanggil saat token dibuat/diperbarui. `user` hanya ada saat login pertama.
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role ?? "CUSTOMER";
      }
      return token;
    },
    // Menentukan isi `session` yang bisa dibaca lewat `auth()`.
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
});
