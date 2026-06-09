import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Vehicle } from "@/data/inventory";

interface ProductCardProps {
  vehicle: Vehicle;
}

export default function ProductCard({ vehicle }: ProductCardProps) {
  const formattedPrice = vehicle.price.toLocaleString("fr-FR");

  return (
    <article className="bg-white group flex flex-col">
      {/* Image container */}
      <div className="aspect-[4/3] mb-5 overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
        <div className="relative w-[90%] h-full transition-transform duration-700 group-hover:scale-105">
          <Image
            src={vehicle.imageUrl}
            alt={vehicle.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain"
            loading="lazy"
          />
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1 flex flex-col flex-grow">
        <h3 className="font-black text-lg uppercase text-black leading-tight">
          {vehicle.name}
        </h3>
        <p className="text-gray-500 text-xs font-medium">
          {vehicle.year} | {vehicle.engine} | {vehicle.transmission}
        </p>
        <p className="text-[#D80005] font-black text-2xl pt-2">
          {vehicle.currency}
          {formattedPrice}
        </p>

        <div className="pt-3 mt-auto">
          <a
            href={`#${vehicle.id}`}
            aria-label={`Voir les détails pour ${vehicle.name}`}
            className="inline-flex items-center gap-2 text-[#D80005] font-bold text-[12px] uppercase tracking-wider hover:gap-4 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:outline-none"
          >
            VOIR LES DÉTAILS{" "}
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}