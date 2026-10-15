"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cog, Gauge, Heart } from "lucide-react";
import gsap from "gsap";
import type { Vehicle } from "@/data/inventory";

interface ProductCardProps {
  vehicle: Vehicle;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function ProductCard({ vehicle, favorite, onToggleFavorite }: ProductCardProps) {
  const heartRef = useRef<SVGSVGElement>(null);

  const id = String(vehicle.id);
  const formattedPrice = vehicle.price.toLocaleString("fr-FR");
  const currency = vehicle.currency.length > 1 ? `${vehicle.currency} ` : vehicle.currency;
  const href = `/catalogue/${id}`; // detail page of the vehicle

  const handleFavorite = () => {
    onToggleFavorite(id);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!favorite && heartRef.current && !reduce) {
      gsap.fromTo(heartRef.current, { scale: 0.5 }, { scale: 1, duration: 0.8, ease: "elastic.out(1, 0.4)" });
    }
  };

  return (
    // The outer element is moved by GSAP (reveal, filters). Hover effects live on the inner one.
    <article className="inv-item">
      <div className="group relative h-full border border-gray-200 bg-white transition-all duration-500 hover:-translate-y-1.5 hover:border-black hover:shadow-[0_28px_50px_-24px_rgba(0,0,0,0.35)]">
        <Link
          href={href}
          aria-label={`Voir les détails pour ${vehicle.name}`}
          className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D80005]"
        >
          {/* Photo */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
            <div className="inv-img absolute inset-[-8%]">
              <div className="inv-reveal absolute inset-0">
                <Image
                  src={vehicle.imageUrl}
                  alt={vehicle.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  loading="lazy"
                />
              </div>
            </div>
            <span className="absolute left-0 top-4 bg-black px-3 py-1.5 text-[11px] font-bold tracking-wider text-white">
              {vehicle.year}
            </span>
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col p-5">
            <h3 className="text-lg font-black uppercase leading-tight text-black">{vehicle.name}</h3>

            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-gray-600">
              <li className="flex items-center gap-2">
                <Gauge size={15} className="text-[#D80005]" aria-hidden="true" />
                {vehicle.engine}
              </li>
              <li className="flex items-center gap-2">
                <Cog size={15} className="text-[#D80005]" aria-hidden="true" />
                {vehicle.transmission}
              </li>
            </ul>

            <div className="mt-auto flex items-end justify-between pt-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Prix</p>
                <p className="text-2xl font-black text-black">
                  {currency}
                  {formattedPrice}
                </p>
              </div>
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center bg-black text-white transition-colors duration-300 group-hover:bg-[#D80005]"
              >
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </span>
            </div>
          </div>
        </Link>

        {/* Favorite */}
        <button
          type="button"
          onClick={handleFavorite}
          aria-pressed={favorite}
          aria-label={favorite ? `Retirer ${vehicle.name} des favoris` : `Ajouter ${vehicle.name} aux favoris`}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center bg-white/95 shadow-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]"
        >
          <Heart
            ref={heartRef}
            size={18}
            fill={favorite ? "#D80005" : "none"}
            className={favorite ? "text-[#D80005]" : "text-black"}
            aria-hidden="true"
          />
        </button>

        {/* Red line that grows on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-[#D80005] transition-transform duration-500 group-hover:scale-x-100"
        />
      </div>
    </article>
  );
}