import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Satu instance PrismaClient untuk seluruh app.
 *
 * Saat development, Next.js me-reload modul berkali-kali. Tanpa trik
 * `globalThis` ini, setiap reload akan membuka koneksi database baru
 * sampai akhirnya database menolak koneksi ("too many connections").
 */

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
