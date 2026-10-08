/**
 * Menggabungkan className secara kondisional.
 * cn("a", isActive && "b", undefined) -> "a b" (bila isActive true)
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
