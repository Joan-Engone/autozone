"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Car, Cog, Fuel, Gauge, MapPin } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { formatKm, formatPrice } from "@/lib/formatters";
import type { Vehicle } from "@/lib/data/vehicles";

export default function VehicleCard({ vehicle: v }: { vehicle: Vehicle }) {
  // Works as soon as your vehicles get a photo field (imageUrl)
  const imageUrl = (v as Vehicle & { imageUrl?: string }).imageUrl;
  const inStock = v.status === "En stock";

  const specs = [
    { icon: CalendarDays, label: "Année", value: String(v.year) },
    { icon: Gauge, label: "Kilométrage", value: formatKm(v.mileage) },
    { icon: Fuel, label: "Carburant", value: String(v.fuel) },
    { icon: Cog, label: "Boîte", value: String(v.transmission) },
  ];

  // The contact form opens with this vehicle already written in the message
  const rememberVehicle = () => {
    try {
      sessionStorage.setItem("az-quote-vehicle", `${v.make} ${v.model} (${v.year})`);
    } catch {
      /* ignore */
    }
  };

  return (
    <li className="vc-card group flex flex-col border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-[0_24px_40px_-24px_rgba(0,0,0,0.35)]">
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gray-100 text-gray-300">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${v.make} ${v.model} ${v.year}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <Car size={72} strokeWidth={1.25} aria-hidden="true" />
        )}
        <span
          className={`absolute left-0 top-4 flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold text-white ${
            inStock ? "bg-black" : "bg-[#D80005]"
          }`}
        >
          {inStock && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-green-400" />}
          {v.status}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
          <MapPin size={13} aria-hidden="true" />
          {v.origin}
        </p>
        <h2 className="mt-1 text-xl font-black tracking-tight text-black">
          {v.make} {v.model}
        </h2>

        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
          {specs.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2.5">
              <Icon size={16} className="shrink-0 text-[#D80005]" aria-hidden="true" />
              <div>
                <dt className="sr-only">{label}</dt>
                <dd className="font-bold text-black">{value}</dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="mt-auto border-t border-gray-100 pt-6">
          <p className="text-2xl font-black text-[#D80005]">{formatPrice(v.price)}</p>
          <p className="mt-0.5 text-xs text-gray-500">Prix livré sur demande</p>
          <Link
            href={ROUTES.contact}
            onClick={rememberVehicle}
            aria-label={`Demander un devis pour ${v.make} ${v.model} ${v.year}`}
            className="mt-4 flex items-center justify-center gap-3 bg-black px-6 py-4 text-[13px] font-bold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-[#D80005] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2"
          >
            Demander un devis
            <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </li>
  );
}