"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { label: "Aperçu", href: "/seller" },
  { label: "Mes véhicules", href: "/seller/vehicles" },
  { label: "Ajouter un véhicule", href: "/seller/vehicles/new" },
];

export default function SellerNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav aria-label="Espace vendeur" className="mt-8 flex gap-8 overflow-x-auto">
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`whitespace-nowrap border-b-4 pb-3 text-sm font-bold transition-colors ${
              active
                ? "border-[#D80005] text-white"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}