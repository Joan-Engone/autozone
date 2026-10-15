import { ROUTES } from "@/lib/routes";

/* ───────── Edit these ───────── */
export const CONTACT = {
  tagline: "Import & export de véhicules",
  phoneLabel: "+241 00 00 00 00",
  phoneHref: "tel:+24100000000",
  whatsappHref: "https://wa.me/24100000000",
};

export interface NavItem {
  label: string;
  href: string;
  /** true = opens the Catalogue mega menu on desktop */
  menu?: boolean;
}

export const NAV_LINKS: NavItem[] = [
  { label: "Accueil", href: ROUTES.home },
  { label: "Catalogue", href: ROUTES.catalogue, menu: true },
  { label: "Services", href: ROUTES.services },
  { label: "À propos", href: ROUTES.about },
];

/* ───────── Shared helpers ───────── */
export type Role = "BUYER" | "SELLER" | "ADMIN";

export interface SessionUser {
  name: string;
  role: Role;
  /** ACTIVE | PENDING (seller waiting for approval) | SUSPENDED */
  status: string;
}

export const ROLE_LABEL: Record<Role, string> = {
  BUYER: "Acheteur",
  SELLER: "Vendeur",
  ADMIN: "Administrateur",
};

/** Slanted edges: a nod to speed and the road. */
export const SLANT = "polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)";

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2";

export function isActive(href: string, pathname: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Turns the Better Auth session user into the small shape the navbar needs. */
export function toSessionUser(
  user: { name: string; role?: unknown; status?: unknown } | null | undefined
): SessionUser | null {
  if (!user) return null;
  const role = String(user.role ?? "BUYER").toUpperCase();
  return {
    name: user.name,
    role: role === "ADMIN" ? "ADMIN" : role === "SELLER" ? "SELLER" : "BUYER",
    status: String(user.status ?? "ACTIVE").toUpperCase(),
  };
}