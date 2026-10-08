import type { DefaultSession } from "next-auth";

/**
 * Menambahkan field `id` dan `role` ke tipe bawaan Auth.js,
 * supaya TypeScript tahu `session.user.role` itu ada.
 */

type AppRole = "CUSTOMER" | "ADMIN";

declare module "next-auth" {
  interface User {
    role?: AppRole;
  }

  interface Session {
    user: {
      id: string;
      role: AppRole;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: AppRole;
  }
}
