/**
 * Memastikan URL tujuan setelah login adalah halaman di website kita sendiri.
 *
 * Tanpa ini, penyerang bisa membuat link seperti
 * /masuk?callbackUrl=https://situs-palsu.com dan mengarahkan korban keluar.
 */
export function safeRedirectPath(target: unknown, fallback = "/"): string {
  if (typeof target !== "string") return fallback;

  const isRelativePath = target.startsWith("/");
  const isProtocolRelative = target.startsWith("//") || target.startsWith("/\\");

  return isRelativePath && !isProtocolRelative ? target : fallback;
}
