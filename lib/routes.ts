import {
  LayoutDashboard,
  ShieldCheck,
  Store,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Single source of truth for every URL on the site. */
export const ROUTES = {
  home: "/",
  catalogue: "/catalogue",
  about: "/about",
  services: "/services",
  contact: "/#contact",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  dashboard: "/dashboard",
  seller: "/seller",
  admin: "/admin",
  adminRegister: "/admin/register",
  legal: "/mentions-legales",
  privacy: "/confidentialite",
} as const;

export interface NavLink {
  label: string;
  href: string;
}

/** Roles supported by the application. */
export type UserRole = "BUYER" | "CLIENT" | "SELLER" | "ADMIN";

export interface DashboardLink extends NavLink {
  roles: UserRole[];
  icon: LucideIcon;
}

export const MAIN_NAV: NavLink[] = [
  { label: "Accueil", href: ROUTES.home },
  { label: "Catalogue", href: ROUTES.catalogue },
  { label: "À propos", href: ROUTES.about },
  { label: "Services", href: ROUTES.services },
];

export const DASHBOARD_LINKS: DashboardLink[] = [
  {
    label: "Mes commandes",
    href: ROUTES.dashboard,
    roles: ["BUYER", "CLIENT"],
    icon: LayoutDashboard,
  },
  {
    label: "Espace vendeur",
    href: ROUTES.seller,
    roles: ["SELLER"],
    icon: Store,
  },
  {
    label: "Administration",
    href: ROUTES.admin,
    roles: ["ADMIN"],
    icon: ShieldCheck,
  },
];

export interface FooterGroup {
  title: string;
  links: NavLink[];
}

export const FOOTER_GROUPS: FooterGroup[] = [
  {
    title: "Navigation",
    links: [
      { label: "Accueil", href: ROUTES.home },
      { label: "Catalogue", href: ROUTES.catalogue },
      { label: "À propos", href: ROUTES.about },
      { label: "Services", href: ROUTES.services },
    ],
  },
  {
    title: "Votre compte",
    links: [
      { label: "Connexion", href: ROUTES.login },
      { label: "Créer un compte", href: ROUTES.register },
      { label: "Mon espace", href: ROUTES.dashboard },
    ],
  },
  {
    title: "Nous joindre",
    links: [
      { label: "Contactez-nous", href: ROUTES.contact },
      { label: "Demander un devis", href: ROUTES.contact },
    ],
  },
];

export const LEGAL_LINKS: NavLink[] = [
  { label: "Mentions légales", href: ROUTES.legal },
  { label: "Confidentialité", href: ROUTES.privacy },
];

/**
 * True when href matches the current page.
 * Hash links are never considered active.
 */
export function isActiveRoute(
  href: string,
  pathname: string,
): boolean {
  if (href.includes("#")) return false;

  return href === "/"
    ? pathname === "/"
    : pathname.startsWith(href);
}

/**
 * Determines the landing page after login.
 *
 * ADMIN  -> /admin
 * SELLER -> /seller
 * BUYER  -> /dashboard
 * CLIENT -> /dashboard
 *
 * Role comparisons are case-insensitive.
 */
export function homeForRole(
  role?: string | null,
): string {
  switch (role?.trim().toUpperCase()) {
    case "ADMIN":
      return ROUTES.admin;

    case "SELLER":
      return ROUTES.seller;

    case "BUYER":
    case "CLIENT":
    default:
      return ROUTES.dashboard;
  }
}