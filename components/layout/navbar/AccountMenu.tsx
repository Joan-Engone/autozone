"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, User } from "lucide-react";
import { DASHBOARD_LINKS } from "@/lib/routes";
import { ROLE_LABEL, focusRing } from "@/components/layout/navbar/config";
import type { SessionUser } from "@/components/layout/navbar/config";

interface AccountMenuProps {
  user: SessionUser;
  onLogout: () => void;
}

/** Avatar button + dropdown for a signed-in user (desktop). */
export default function AccountMenu({ user, onLogout }: AccountMenuProps) {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const ref = useRef<HTMLDivElement>(null);
  const dashboards = DASHBOARD_LINKS.filter((d) => d.roles.includes(user.role));
  const initial = user.name.trim().charAt(0).toUpperCase();
  const pending = user.role === "SELLER" && user.status === "PENDING";

  // Close the menu when the route changes (preferred over an effect)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-3 rounded-full border border-gray-200 bg-white py-1.5 pl-1.5 pr-3 transition-all duration-200 hover:border-black ${focusRing}`}
      >
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
          {initial || <User size={16} />}
          {pending && (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#D80005]"
            />
          )}
        </span>
        <span className="max-w-[110px] truncate text-sm font-semibold text-black">
          {user.name}
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)]"
        >
          <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
            <p className="truncate text-sm font-bold text-black">{user.name}</p>
            <p className="mt-0.5 text-xs text-gray-500">{ROLE_LABEL[user.role]}</p>
            {pending && (
              <p className="mt-2 inline-block rounded-full bg-[#D80005]/10 px-2.5 py-1 text-[11px] font-bold text-[#D80005]">
                En attente de validation
              </p>
            )}
          </div>
          {dashboards.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              role="menuitem"
              className="flex items-center gap-3 px-5 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-gray-50 hover:text-[#D80005]"
            >
              <Icon size={17} aria-hidden="true" />
              {label}
            </Link>
          ))}
          <button
            type="button"
            role="menuitem"
            onClick={onLogout}
            className="flex w-full items-center gap-3 border-t border-gray-100 px-5 py-3.5 text-left text-sm font-semibold text-black transition-colors hover:bg-gray-50 hover:text-[#D80005]"
          >
            <LogOut size={17} aria-hidden="true" />
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}