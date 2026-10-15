"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check, ChevronRight, Cog, Gauge, Heart } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "@/components/sections/ProductCard";
import type { Vehicle } from "@/data/inventory";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ───────── Edit these texts to match what Auto Zone really offers ───────── */
const REASSURANCE = [
  "Devis détaillé avant de vous engager",
  "Expédition et dédouanement pris en charge",
  "Suivi de votre commande en ligne",
];

const SLANT = "polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)";

interface VehicleDetailProps {
  vehicle: Vehicle;
  others: Vehicle[];
}

export default function VehicleDetail({ vehicle, others }: VehicleDetailProps) {
  const rootRef = useRef<HTMLElement>(null);
  const priceRef = useRef<HTMLSpanElement>(null);
  const heartRef = useRef<SVGSVGElement>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const id = String(vehicle.id);
  const isFavorite = favorites.includes(id);
  const formattedPrice = vehicle.price.toLocaleString("fr-FR");
  const currency = vehicle.currency.length > 1 ? `${vehicle.currency} ` : vehicle.currency;

  const specs: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: CalendarDays, label: "Année", value: String(vehicle.year) },
    { icon: Gauge, label: "Moteur", value: vehicle.engine },
    { icon: Cog, label: "Boîte de vitesses", value: vehicle.transmission },
  ];

  // Favorites are remembered in the browser (same list as the catalogue)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("az-favorites") ?? "[]");
      if (Array.isArray(saved)) setFavorites(saved.map(String));
    } catch {
      /* ignore */
    }
  }, []);

  const toggleFavorite = (targetId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(targetId) ? prev.filter((x) => x !== targetId) : [...prev, targetId];
      try {
        localStorage.setItem("az-favorites", JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const onFavoriteClick = () => {
    toggleFavorite(id);
    if (!isFavorite && heartRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(heartRef.current, { scale: 0.5 }, { scale: 1, duration: 0.8, ease: "elastic.out(1, 0.4)" });
    }
  };

  // The contact form pre-fills the message with this vehicle
  const rememberVehicle = () => {
    try {
      sessionStorage.setItem("az-quote-vehicle", `${vehicle.name} (${vehicle.year})`);
    } catch {
      /* ignore */
    }
  };

  // Animations
  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(".vd-crumb", { y: -10, opacity: 0, duration: 0.6, ease: "power3.out" });

      // Photo: wipes in, then settles from a slight zoom
      gsap.from(".vd-image", { clipPath: "inset(0 0 100% 0)", duration: 1.2, ease: "power4.inOut" });
      gsap.from(".vd-image-inner", { scale: 1.25, duration: 1.8, ease: "power3.out" });

      // Buy box
      gsap.from(".vd-fade", { y: 24, opacity: 0, duration: 0.9, stagger: 0.1, delay: 0.3, ease: "power3.out" });

      // Price counts up
      const price = priceRef.current;
      if (price) {
        const state = { value: 0 };
        price.textContent = "0";
        gsap.to(state, {
          value: vehicle.price,
          duration: 1.6,
          delay: 0.5,
          ease: "power3.out",
          onUpdate: () => {
            price.textContent = Math.round(state.value).toLocaleString("fr-FR");
          },
          onComplete: () => {
            price.textContent = vehicle.price.toLocaleString("fr-FR");
          },
        });
      }

      gsap.from(".vd-spec", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".vd-specs", start: "top 90%", once: true },
      });
      gsap.from(".vd-similar .inv-item", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".vd-similar", start: "top 85%", once: true },
      });
    }, root);

    return () => {
      ctx.revert();
      if (priceRef.current) priceRef.current.textContent = formattedPrice;
    };
  }, [vehicle.price, formattedPrice]);

  return (
    <main ref={rootRef} className="bg-white pb-24 pt-8 lg:pb-[100px]">
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="vd-crumb mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-[13px] text-gray-500">
            <li>
              <Link href="/" className="transition-colors hover:text-[#D80005]">Accueil</Link>
            </li>
            <ChevronRight size={14} aria-hidden="true" />
            <li>
              <Link href="/catalogue" className="transition-colors hover:text-[#D80005]">Catalogue</Link>
            </li>
            <ChevronRight size={14} aria-hidden="true" />
            <li aria-current="page" className="font-bold text-black">{vehicle.name}</li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left: photo and specifications */}
          <div className="lg:col-span-7">
            <div className="vd-image relative aspect-[4/3] overflow-hidden border border-gray-200 bg-gray-100">
              <div className="vd-image-inner absolute inset-0">
                <Image
                  src={vehicle.imageUrl}
                  alt={vehicle.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
              <span className="absolute left-0 top-5 bg-black px-4 py-2 text-xs font-bold tracking-wider text-white">
                {vehicle.year}
              </span>
            </div>

            <section aria-labelledby="specs-heading" className="mt-12">
              <h2 id="specs-heading" className="text-xl font-black uppercase tracking-tight text-black">
                Caractéristiques
              </h2>
              <div aria-hidden="true" className="mt-3 h-[3px] w-10 bg-[#D80005]" />
              <ul className="vd-specs mt-6 grid gap-4 sm:grid-cols-3">
                {specs.map(({ icon: Icon, label, value }) => (
                  <li key={label} className="vd-spec flex items-start gap-4 border border-gray-200 p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-black text-white">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
                      <p className="mt-1 font-black text-black">{value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right: price and actions */}
          <div className="lg:col-span-5 lg:self-start lg:sticky lg:top-32">
            <p className="vd-fade text-xs font-bold uppercase tracking-[0.2em] text-[#D80005]">Véhicule premium</p>
            <h1 className="vd-fade mt-3 text-3xl font-black uppercase leading-[1.05] tracking-tight text-black lg:text-4xl">
              {vehicle.name}
            </h1>

            <div className="vd-fade mt-8 border-y border-gray-200 py-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Prix</p>
              <p className="mt-1 text-4xl font-black text-black" aria-label={`Prix : ${currency}${formattedPrice}`}>
                <span aria-hidden="true">
                  {currency}
                  <span ref={priceRef}>{formattedPrice}</span>
                </span>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                Prix du véhicule. Les frais d&apos;expédition et de dédouanement sont détaillés dans votre devis.
              </p>
            </div>

            <div className="vd-fade mt-8 flex flex-col gap-3">
              <Link
                href="/#contact"
                onClick={rememberVehicle}
                style={{ clipPath: SLANT }}
                className="inline-flex items-center justify-center gap-3 bg-[#D80005] px-10 py-4 text-[14px] font-bold text-white transition-colors duration-300 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2"
              >
                Demander un devis
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={onFavoriteClick}
                aria-pressed={isFavorite}
                className="inline-flex items-center justify-center gap-3 border-2 border-black px-10 py-3.5 text-[14px] font-bold text-black transition-colors duration-300 hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2"
              >
                <Heart
                  ref={heartRef}
                  size={18}
                  fill={isFavorite ? "#D80005" : "none"}
                  className={isFavorite ? "text-[#D80005]" : ""}
                  aria-hidden="true"
                />
                {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              </button>
            </div>

            <ul className="vd-fade mt-8 space-y-3">
              {REASSURANCE.map((text) => (
                <li key={text} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-[#D80005] text-white">
                    <Check size={13} aria-hidden="true" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Other vehicles */}
        {others.length > 0 && (
          <section aria-labelledby="similar-heading" className="vd-similar mt-24">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 id="similar-heading" className="text-2xl font-black uppercase tracking-tight text-black lg:text-3xl">
                  Vous aimerez aussi
                </h2>
                <div aria-hidden="true" className="mt-3 h-[3px] w-10 bg-[#D80005]" />
              </div>
              <Link
                href="/catalogue"
                className="group inline-flex items-center gap-3 border-b-2 border-[#D80005] pb-1 text-[13px] font-bold uppercase tracking-wider text-black transition-colors hover:text-[#D80005] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]"
              >
                Voir tout le catalogue
                <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {others.map((v) => (
                <ProductCard
                  key={v.id}
                  vehicle={v}
                  favorite={favorites.includes(String(v.id))}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}