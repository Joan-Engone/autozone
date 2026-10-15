import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Eyebrow from "@/components/ui/Eyebrow";
import { ROUTES } from "@/lib/routes";
import { ORIGINS } from "@/lib/data/vehicles";

/** Where the vehicles come from. Each tile opens the catalogue already filtered. */
export default function SourcingGrid() {
  return (
    <section aria-labelledby="sourcing-title" className="mx-auto w-full max-w-[1280px] px-6 py-20 md:py-28">
      <Eyebrow>Provenance</Eyebrow>
      <h2 id="sourcing-title" className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-black md:text-4xl">
        Où nous achetons
      </h2>
      <p className="mt-4 max-w-prose text-lg leading-relaxed text-gray-600">
        Choisissez une provenance pour voir les véhicules disponibles.
      </p>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ORIGINS.map((origin) => (
          <li key={origin}>
            <Link
              href={`${ROUTES.catalogue}?origin=${encodeURIComponent(origin)}`}
              className="group flex min-h-40 flex-col justify-between border border-gray-200 bg-white p-6 transition-colors duration-300 hover:border-black hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2 motion-reduce:transition-none"
            >
              <ArrowUpRight
                size={22}
                aria-hidden="true"
                className="self-end text-gray-400 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#ff4d52] motion-reduce:transition-none"
              />
              <div>
                <p className="text-2xl font-black tracking-tight text-black transition-colors group-hover:text-white">{origin}</p>
                <p className="mt-1 text-sm text-gray-600 transition-colors group-hover:text-white/80">Voir les véhicules</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}