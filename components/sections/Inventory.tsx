"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import ProductCard from "./ProductCard";
import { INVENTORY_DATA } from "@/data/inventory";
import type { Vehicle } from "@/data/inventory";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, Flip);

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type SortKey = "featured" | "price-asc" | "price-desc" | "year-desc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Recommandés" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "year-desc", label: "Plus récents" },
];

function sortVehicles(list: Vehicle[], sort: SortKey): Vehicle[] {
  const copy = [...list];
  if (sort === "price-asc") copy.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") copy.sort((a, b) => b.price - a.price);
  if (sort === "year-desc") copy.sort((a, b) => b.year - a.year);
  return copy;
}

interface InventoryProps {
  /** How many vehicles to show. Use null to show all of them. Default: 4. */
  limit?: number | null;
  /** Show the links to the full catalogue page. Turn off on the /catalogue page itself. */
  showAllLink?: boolean;
  /** Filters and sorting. On by default when every vehicle is shown (limit = null). */
  showToolbar?: boolean;
}

export default function Inventory({
  limit = 4,
  showAllLink = true,
  showToolbar = limit == null,
}: InventoryProps) {
  const rootRef = useRef<HTMLElement>(null);
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);

  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [favorites, setFavorites] = useState<string[]>([]);

  const total = INVENTORY_DATA.length;
  const base = limit == null ? INVENTORY_DATA : INVENTORY_DATA.slice(0, limit);
  const ordered = showToolbar ? sortVehicles(base, sort) : base;
  const transmissions = Array.from(new Set(INVENTORY_DATA.map((v) => v.transmission)));
  const matches = (v: Vehicle) => filter === "all" || v.transmission === filter;
  const visibleCount = ordered.filter(matches).length;

  // Favorites are remembered in the browser
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("az-favorites") ?? "[]");
      if (Array.isArray(saved)) setFavorites(saved.map(String));
    } catch {
      /* ignore */
    }
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem("az-favorites", JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  // Remember where every card is, so GSAP Flip can glide them to their new place
  const captureLayout = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    flipState.current = Flip.getState(".inv-item");
  };
  const applyFilter = (next: string) => {
    if (next === filter) return;
    captureLayout();
    setFilter(next);
  };
  const applySort = (next: SortKey) => {
    if (next === sort) return;
    captureLayout();
    setSort(next);
  };

  // Entrance animations (title, cards, photo parallax)
  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const headTrigger = { trigger: ".inv-head", start: "top 85%", once: true };

      gsap.from(".inv-head-line", {
        yPercent: 110,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: headTrigger,
      });
      gsap.from(".inv-head-bar", {
        scaleX: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.3,
        scrollTrigger: headTrigger,
      });
      gsap.from(".inv-head-fade", {
        y: 20,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: headTrigger,
      });

      // Cards rise one after the other, and their photos settle from a slight zoom
      gsap.set(".inv-item", { opacity: 0, y: 60 });
      ScrollTrigger.batch(".inv-item", {
        start: "top 92%",
        once: true,
        onEnter: (items) => {
          gsap.to(items, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out", overwrite: true });
          const photos = items.flatMap((item) => Array.from(item.querySelectorAll(".inv-reveal")));
          gsap.fromTo(photos, { scale: 1.25 }, { scale: 1, duration: 1.4, stagger: 0.1, ease: "power3.out" });
        },
      });

      // Photos drift slowly while you scroll
      gsap.utils.toArray<HTMLElement>(".inv-img").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  // Smooth re-arrangement when a filter or the sort order changes
  useIsoLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;

    Flip.from(state, {
      duration: 0.8,
      ease: "power3.inOut",
      stagger: 0.03,
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.5, delay: 0.25 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.92, duration: 0.3 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [filter, sort]);

  const chipClass = (active: boolean) =>
    `border px-5 py-2.5 text-[13px] font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] ${
      active
        ? "border-black bg-black text-white"
        : "border-gray-300 bg-white text-black hover:border-black"
    }`;

  return (
    <section
      ref={rootRef}
      id="catalogue"
      aria-labelledby="inventory-heading"
      className="bg-white py-24 lg:py-[100px]"
    >
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Header */}
        <div className="inv-head mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2
              id="inventory-heading"
              className="text-3xl font-black uppercase leading-[1.05] tracking-tight text-black lg:text-5xl"
            >
              <span className="block overflow-hidden pb-1">
                <span className="inv-head-line block">Notre catalogue</span>
              </span>
              <span className="block overflow-hidden pb-1 text-[#D80005]">
                <span className="inv-head-line block">premium</span>
              </span>
            </h2>
            <div aria-hidden="true" className="inv-head-bar mt-5 h-[3px] w-12 origin-left bg-[#D80005]" />
            <p className="inv-head-fade mt-4 text-sm text-gray-500">
              Sélectionné avec soin. Qualité assurée.
            </p>
          </div>

          {showAllLink && (
            <Link
              href="/catalogue"
              className="inv-head-fade group inline-flex items-center gap-3 self-start border-2 border-black px-8 py-4 text-[13px] font-bold uppercase tracking-wider text-black transition-colors duration-300 hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2 lg:self-auto"
            >
              Voir tous les véhicules
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          )}
        </div>

        {/* Filters and sorting */}
        {showToolbar && (
          <div className="mb-10 flex flex-col gap-4 border-y border-gray-200 py-4 md:flex-row md:items-center md:justify-between">
            <div role="group" aria-label="Filtrer par boîte de vitesses" className="flex flex-wrap gap-2">
              <button
                type="button"
                aria-pressed={filter === "all"}
                onClick={() => applyFilter("all")}
                className={chipClass(filter === "all")}
              >
                Tous
              </button>
              {transmissions.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={filter === t}
                  onClick={() => applyFilter(t)}
                  className={chipClass(filter === t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-5">
              <p aria-live="polite" className="text-sm text-gray-500">
                <span className="font-black text-black">{visibleCount}</span>{" "}
                véhicule{visibleCount > 1 ? "s" : ""}
              </p>
              <label htmlFor="inventory-sort" className="sr-only">
                Trier les véhicules
              </label>
              <select
                id="inventory-sort"
                value={sort}
                onChange={(e) => applySort(e.target.value as SortKey)}
                className="border border-gray-300 bg-white px-4 py-2.5 text-[13px] font-bold text-black focus:border-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {ordered.map((vehicle) => (
            <div key={vehicle.id} className={matches(vehicle) ? "contents" : "hidden"}>
              <ProductCard
                vehicle={vehicle}
                favorite={favorites.includes(String(vehicle.id))}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          ))}
        </div>

        {/* Link to the full catalogue */}
        {showAllLink && total > ordered.length && (
          <Link
            href="/catalogue"
            className="group relative mt-16 flex items-center justify-between overflow-hidden border-y-2 border-black px-6 py-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-left scale-x-0 bg-black transition-transform duration-500 ease-out group-hover:scale-x-100"
            />
            <span className="relative text-xl font-black uppercase tracking-tight text-black transition-colors duration-500 group-hover:text-white lg:text-3xl">
              Voir les {total} véhicules du catalogue
            </span>
            <span className="relative flex h-12 w-12 items-center justify-center bg-[#D80005] text-white">
              <ArrowRight
                size={20}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}