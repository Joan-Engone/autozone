import Image from "next/image";
import { PlayCircle } from "lucide-react";

export default function Hero() {
  return (
    <header className="relative bg-white overflow-hidden py-16 lg:py-0 lg:h-[700px] flex items-center">
      <div className="max-w-[1280px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
        {/* Text column */}
        <div className="space-y-6">
          <p className="text-[#D80005] font-bold text-[12px] tracking-[0.2em] uppercase">
            IMPORTATION &amp; EXPORTATION DE VÉHICULES PREMIUM
          </p>
          <h1 className="text-[40px] sm:text-[56px] lg:text-[72px] font-black leading-[1.05] text-black uppercase">
            PORTÉS PAR LA PASSION.{" "}
            <span className="text-[#D80005]">LIVRÉS DANS LE MONDE ENTIER.</span>
          </h1>
          <p className="text-gray-600 text-base lg:text-lg max-w-lg leading-relaxed">
            Nous nous spécialisons dans le sourcing et l&apos;expédition de
            véhicules haut de gamme à travers le monde avec confiance et
            excellence.
          </p>
          <div className="flex flex-wrap gap-5 pt-2">
            <button className="bg-[#D80005] text-white font-bold text-[13px] uppercase px-10 py-5 transition-all duration-300 hover:bg-black active:scale-95 focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2">
              PARCOURIR LE CATALOGUE
            </button>
            <button
              aria-label="Voir le showreel vidéo"
              className="flex items-center gap-3 font-bold text-[13px] uppercase text-black group transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:outline-none"
            >
              <PlayCircle
                size={32}
                className="text-[#D80005] group-hover:scale-110 transition-transform duration-300"
                aria-hidden
              />
              VOIR LE SHOWREEL
            </button>
          </div>
        </div>

        {/* Image column */}
        <div className="relative flex items-center justify-center lg:justify-end w-full">
          <div className="relative w-full max-w-[560px] lg:max-w-none lg:w-[115%] lg:-mr-[10%]">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCppvJBxdtflG0z2v4tZgLci6-k9_JwHNW9FMjQcyydQdzhgJDrj8GE6Xiz-zEgrzKEAMKUPc-MarZiWndWrJ_3nYhs5_ceDKYQoFzdC9j5KtEDsoho2U_tP3lfK7irWJRAAv2esuaEqDB3HoQFP9VFjJu5FOGtqDDMno0Ua6ydlQp4MNIOhc4mWjvZmnBRKota6QxBbLk3YpuJXw2oxbHemmxrogJ6gj1dU4zE1OC8qBC56YXZiA_fRcKKgBfpffzOfA4CIcJGQNd7"
              alt="Véhicule premium de luxe"
              width={900}
              height={560}
              priority
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </header>
  );
}