"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Car,
  ClipboardList,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  PlusCircle,
  Users,
  Wallet,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { signOut } from "@/lib/auth/client";

type Area = "seller" | "admin";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  match: (pathname: string) => boolean;
}

const exact = (href: string) => (p: string) => p === href;
const section = (href: string) => (p: string) => p === href || p.startsWith(`${href}/`);

const NAV: Record<Area, NavItem[]> = {
  seller: [
    { label: "Tableau de bord", href: "/seller", icon: LayoutDashboard, match: exact("/seller") },
    { label: "Mes véhicules", href: "/seller/vehicles", icon: Car, match: exact("/seller/vehicles") },
    { label: "Ajouter un véhicule", href: "/seller/vehicles/new", icon: PlusCircle, match: exact("/seller/vehicles/new") },
  ],
  admin: [
    { label: "Tableau de bord", href: "/admin", icon: LayoutDashboard, match: exact("/admin") },
    { label: "Commandes", href: "/admin/orders", icon: ClipboardList, match: section("/admin/orders") },
    { label: "Paiements", href: "/admin/payments", icon: Wallet, match: section("/admin/payments") },
    { label: "Vendeurs", href: "/admin/sellers", icon: Users, match: section("/admin/sellers") },
    { label: "Véhicules", href: "/admin/vehicles", icon: Car, match: section("/admin/vehicles") },
    { label: "Messages", href: "/admin/messages", icon: Mail, match: section("/admin/messages") },
  ],
};

const SUBTITLE: Record<Area, string> = { seller: "Espace vendeur", admin: "Administration" };

interface DashboardShellProps {
  area: Area;
  user: { name: string; email: string };
  children: ReactNode;
}

export default function DashboardShell({ area, user, children }: DashboardShellProps) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const home = NAV[area][0].href;

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const logout = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-black text-white">
      <div className="relative flex justify-center px-6 pb-6 pt-8">
  <span
    aria-hidden="true"
    className="absolute inset-x-0 top-0 h-[3px] bg-[#D80005]"
  />

  <Link
    href={home}
    aria-label="Auto Zone home"
    className="inline-flex shrink-0 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]"
  >
    <Image
      src="/logos.jpeg"
      alt="Auto Zone"
      width={200}
      height={80}
      priority
      className="h-12 w-auto object-contain"
    />
  </Link>
</div>

      <nav aria-label={SUBTITLE[area]} className="flex-1 overflow-y-auto px-3">
        <ul className="space-y-1">
          {NAV[area].map(({ label, href, icon: Icon, match }) => {
            const active = match(pathname);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex items-center gap-3 px-4 py-3.5 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {active && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] bg-[#D80005]" />}
                  <Icon size={18} aria-hidden="true" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link href="/" className="mb-4 flex items-center gap-3 px-2 py-2 text-sm text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
          <ExternalLink size={16} aria-hidden="true" />
          Voir le site
        </Link>
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#D80005] font-black">
            {user.name.trim().charAt(0).toUpperCase() || "A"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{user.name}</p>
            <p className="truncate text-xs text-white/50">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            aria-label="Se déconnecter"
            className="flex h-9 w-9 shrink-0 items-center justify-center text-white/60 transition-colors hover:bg-[#D80005] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] lg:block">{sidebar}</aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-black px-4 text-white lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center border border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <Menu size={20} />
        </button>
        <span className="text-xl font-black uppercase italic tracking-tighter text-[#D80005]">AUTO ZONE</span>
        <span className="w-11" aria-hidden="true" />
      </header>

      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "visible" : "invisible"}`} aria-hidden={!open}>
        <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute inset-y-0 left-0 w-[280px] transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}>
          {sidebar}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
            className="absolute right-3 top-5 flex h-9 w-9 items-center justify-center text-white/70 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <main className="lg:pl-[260px]">
        <div className="mx-auto max-w-[1200px] px-5 py-8 lg:px-10 lg:py-10">{children}</div>
      </main>
    </div>
  );
}