"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, MessageCircle, Phone, User } from "lucide-react";
import { DASHBOARD_LINKS, ROUTES } from "@/lib/routes";
import { ORIGINS } from "@/lib/data/vehicles";
import {
  CONTACT,
  NAV_LINKS,
  ROLE_LABEL,
  SLANT,
  isActive,
} from "@/components/layout/navbar/config";
import type { SessionUser } from "@/components/layout/navbar/config";

interface MobileDrawerProps {
  open: boolean;
  user: SessionUser | null;
  loading: boolean;
  onClose: () => void;
  onLogout: () => void;
}

/** Full-screen black menu for phones and tablets. */
export default function MobileDrawer({ open, user, loading, onClose, onLogout }: MobileDrawerProps) {
  const pathname = usePathname() ?? "";
  const dashboards = user ? DASHBOARD_LINKS.filter((d) => d.roles.includes(user.role)) : [];
  const initial = user?.name.trim().charAt(0).toUpperCase() ?? "";
  const pending = user?.role === "SELLER" && user.status === "PENDING";

  // Lock page scroll while open, close on Escape
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Each block fades up one after the other
  const reveal = (i: number) => ({
    className: `transition-all duration-500 ease-out motion-reduce:transition-none ${
      open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
    }`,
    style: { transitionDelay: open ? `${80 + i * 55}ms` : "0ms" },
  });

  const actionLink =
    "flex items-center gap-3 px-1 py-2 font-semibold text-white transition-colors hover:text-[#ff2d33]";

  return (
    <div
      id="mobile-menu"
      aria-hidden={!open}
      className={`lg:hidden fixed inset-0 -z-10 overflow-y-auto bg-black pt-24 transition-all duration-300 ease-out motion-reduce:transition-none ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div className="flex min-h-full flex-col px-6 pb-10 pt-4">
        <ul className="flex flex-col">
          {NAV_LINKS.map((link, i) => {
            const active = isActive(link.href, pathname);
            const r = reveal(i);
            return (
              <li key={link.href} className={`border-b border-white/10 ${r.className}`} style={r.style}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-4 py-5 text-[28px] font-bold tracking-tight transition-colors ${
                    active ? "text-[#ff2d33]" : "text-white hover:text-[#ff2d33]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-7 w-1 rounded-full transition-colors ${
                      active ? "bg-[#D80005]" : "bg-transparent"
                    }`}
                  />
                  {link.label}
                </Link>
                {link.menu && (
                  <div className="-mt-2 mb-5 flex flex-wrap gap-2 pl-5">
                    {ORIGINS.map((origin) => (
                      <Link
                        key={origin}
                        href={`${ROUTES.catalogue}?origin=${encodeURIComponent(origin)}`}
                        onClick={onClose}
                        className="rounded-full border border-white/20 px-3.5 py-1.5 text-[13px] font-semibold text-white/80 transition-colors hover:border-[#D80005] hover:text-white"
                      >
                        {origin}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div
          className={`mt-8 flex flex-col gap-4 ${reveal(NAV_LINKS.length).className}`}
          style={reveal(NAV_LINKS.length).style}
        >
          {loading ? (
            <div aria-hidden="true" className="h-[72px] animate-pulse rounded-xl bg-white/5" />
          ) : user ? (
            <>
              <div className="flex items-center gap-3 rounded-xl bg-white/5 p-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D80005] font-bold text-white">
                  {initial || <User size={18} />}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-bold text-white">{user.name}</p>
                  <p className="text-xs text-white/60">
                    {ROLE_LABEL[user.role]}
                    {pending && " · en attente de validation"}
                  </p>
                </div>
              </div>
              {dashboards.map(({ label, href, icon: Icon }) => (
                <Link key={href} href={href} onClick={onClose} className={actionLink}>
                  <Icon size={18} aria-hidden="true" />
                  {label}
                </Link>
              ))}
              <button type="button" onClick={onLogout} className={`${actionLink} text-left`}>
                <LogOut size={18} aria-hidden="true" />
                Se déconnecter
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link
                href={ROUTES.login}
                onClick={onClose}
                className="rounded-full border border-white/30 py-3.5 text-center text-[15px] font-semibold text-white transition-colors hover:border-white"
              >
                Connexion
              </Link>
              <Link
                href={ROUTES.register}
                onClick={onClose}
                className="rounded-full border border-white/30 py-3.5 text-center text-[15px] font-semibold text-white transition-colors hover:border-white"
              >
                Inscription
              </Link>
            </div>
          )}
        </div>

        <div className="mt-auto pt-10">
          <Link
            href={ROUTES.contact}
            onClick={onClose}
            style={{ clipPath: SLANT }}
            className="block w-full bg-[#D80005] py-4 text-center text-[15px] font-bold text-white transition-colors hover:bg-white hover:text-black active:scale-[0.98]"
          >
            Contactez-nous
          </Link>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-white/70">
            <a
              href={CONTACT.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-white"
            >
              <MessageCircle size={15} className="text-[#D80005]" aria-hidden="true" />
              WhatsApp
            </a>
            <a href={CONTACT.phoneHref} className="flex items-center gap-2 transition-colors hover:text-white">
              <Phone size={15} className="text-[#D80005]" aria-hidden="true" />
              {CONTACT.phoneLabel}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}