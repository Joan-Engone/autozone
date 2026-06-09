"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Accueil", href: "#" },
  { label: "Catalogue", href: "#catalogue" },
  { label: "À propos", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  return (
    <nav
      aria-label="Navigation principale"
      className="bg-white border-b border-gray-100 sticky top-0 z-50"
    >
      <div className="flex justify-between items-center w-full px-6 max-w-[1280px] mx-auto h-24">
        {/* Logo */}
        <a
          href="#"
          className="flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]"
        >
          <span className="font-black text-2xl tracking-tighter text-[#D80005] italic leading-none">
            AUTO ZONE
          </span>
          <span className="text-[9px] font-bold tracking-widest text-black mt-1 uppercase">
            IMPORT &amp; EXPORT
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-10">
          {NAV_LINKS.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-[13px] font-bold uppercase tracking-wider text-black hover:text-[#D80005] transition-colors duration-200 ${
                index === 0 ? "active-underline text-[#D80005]" : ""
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center">
          <button className="bg-[#D80005] text-white font-bold text-[13px] uppercase px-8 py-4 transition-all duration-300 hover:bg-black active:scale-95 focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2">
            CONTACTEZ-NOUS
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileOpen}
          className="md:hidden p-2 text-black hover:text-[#D80005] transition-colors focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:outline-none"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="bg-white border-t border-gray-100 px-6 py-6 flex flex-col gap-5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] font-bold uppercase tracking-wider text-black hover:text-[#D80005] transition-colors duration-200 py-1"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <button className="mt-2 bg-[#D80005] text-white font-bold text-[13px] uppercase px-8 py-4 transition-all duration-300 hover:bg-black active:scale-95 w-full">
            CONTACTEZ-NOUS
          </button>
        </div>
      </div>
    </nav>
  );
}