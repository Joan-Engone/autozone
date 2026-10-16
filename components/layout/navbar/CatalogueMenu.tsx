"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { FUELS, ORIGINS } from "@/lib/data/vehicles";
import { focusRing } from "@/components/layout/navbar/config";

const itemClass =
  "group/item flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gray-50 hover:text-[#D80005]";

/** "Catalogue" link that opens a mega menu with shortcuts to filtered catalogue pages. */
export default function CatalogueMenu({ active }: { active: boolean }) {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close the menu when the route changes (preferred over an effect)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current);
  };

  const openNow = () => {
    clearTimer();
    setOpen(true);
  };

  const closeSoon = () => {
    clearTimer();
    timer.current = setTimeout(() => setOpen(false), 140);
  };

  // Cleanup the pending close timer on unmount
  useEffect(() => clearTimer, []);

  // Close on outside click / Escape while the menu is open
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

  const close = () => setOpen(false);

  return (
    <div
      ref={ref}
      className="relative"
      // Hover only for a real mouse, so a tap on a touch screen does not open then instantly close it.
      onPointerEnter={(e) => e.pointerType === "mouse" && openNow()}
      onPointerLeave={(e) => e.pointerType === "mouse" && closeSoon()}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="catalogue-menu"
        onClick={() => setOpen((p) => !p)}
        className={`group relative flex items-center gap-1.5 py-2 text-[15px] font-semibold tracking-tight transition-colors duration-200 ${focusRing} ${
          active || open ? "text-[#D80005]" : "text-black hover:text-[#D80005]"
        }`}
      >
        Catalogue
        <ChevronDown
          size={15}
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
        <span
          aria-hidden="true"
          className={`absolute -bottom-0.5 left-0 h-[3px] w-full origin-left bg-[#D80005] transition-transform duration-300 ease-out ${
            active || open ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          }`}
        />
      </button>

      {/* pt-5 is an invisible bridge so the pointer can travel from the button to the panel */}
      <div
        id="catalogue-menu"
        className={`absolute left-1/2 top-full z-10 w-[min(720px,90vw)] -translate-x-1/2 pt-5 transition-all duration-200 motion-reduce:transition-none ${
          open ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_30px_70px_-20px_rgba(0,0,0,0.35)]">
          <div className="grid grid-cols-[1fr_1fr_1.15fr]">
            <div className="p-6">
              <p className="px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">
                Par provenance
              </p>
              <ul className="mt-3">
                {ORIGINS.map((origin) => (
                  <li key={origin}>
                    <Link
                      href={`${ROUTES.catalogue}?origin=${encodeURIComponent(origin)}`}
                      onClick={close}
                      className={itemClass}
                    >
                      {origin}
                      <ArrowRight
                        size={14}
                        aria-hidden="true"
                        className="-translate-x-1 opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-l border-gray-100 p-6">
              <p className="px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">
                Par carburant
              </p>
              <ul className="mt-3">
                {FUELS.map((fuel) => (
                  <li key={fuel}>
                    <Link
                      href={`${ROUTES.catalogue}?fuel=${encodeURIComponent(fuel)}`}
                      onClick={close}
                      className={itemClass}
                    >
                      {fuel}
                      <ArrowRight
                        size={14}
                        aria-hidden="true"
                        className="-translate-x-1 opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative overflow-hidden bg-black p-6 text-white">
              <span
                aria-hidden="true"
                className="absolute -right-8 -top-8 h-24 w-24 rotate-45 bg-[#D80005]"
              />
              <Sparkles size={20} className="relative text-white" aria-hidden="true" />
              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.14em] text-white/50">
                Sur mesure
              </p>
              <p className="mt-2 text-lg font-bold leading-snug">Un modèle précis en tête ?</p>
              <p className="mt-2 text-[13px] leading-relaxed text-white/65">
                Nous le cherchons pour vous chez nos vendeurs à l&apos;étranger.
              </p>
              <Link
                href={ROUTES.services}
                onClick={close}
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white transition-colors hover:text-[#ff4d52]"
              >
                Voir nos services
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <Link
            href={ROUTES.catalogue}
            onClick={close}
            className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-9 py-4 text-sm font-bold text-black transition-colors hover:text-[#D80005]"
          >
            Voir tout le catalogue
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}