import type { SVGProps } from "react";

/**
 * ATOM: Icon
 * Kumpulan ikon SVG kecil yang ditulis langsung (tanpa library ikon),
 * supaya ukuran bundle tetap kecil.
 *
 * <Icon name="cart" className="size-5" />
 */

const paths = {
  cart: "M3 4h2l2.4 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.5L21 8H6.2M10 20.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm8 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z",
  search: "m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z",
  user: "M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z",
  package: "m21 8-9-5-9 5m18 0-9 5m9-5v8l-9 5m0-8L3 8m9 5v8M3 8v8l9 5M7.5 5.5l9 5",
  trash: "M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  image: "M4 5h16v14H4zM4 15l4-4 5 5m-2-2 3-3 6 6M15.5 9a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z",
  menu: "M4 6h16M4 12h16M4 18h16",
  check: "m5 12 5 5L20 7",
  truck: "M3 6h11v10H3zM14 10h4l3 3v3h-7M7.5 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm11 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z",
  shield: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z",
  logout: "M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10",
} as const;

export type IconName = keyof typeof paths;

type IconProps = SVGProps<SVGSVGElement> & { name: IconName };

export function Icon({ name, className = "size-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
