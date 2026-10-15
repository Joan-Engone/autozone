"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Check, ClipboardCheck, FileCheck, Globe, Ship, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ───────── Edit the texts here (keep only what Auto Zone really offers) ───────── */
interface Service {
  id: string;
  icon: LucideIcon;
  title: string;
  text: string;
  points: string[];
  featured?: boolean;
}

const SERVICES: Service[] = [
  {
    id: "import",
    icon: Globe,
    title: "Import de véhicules",
    text: "Dites-nous ce que vous cherchez. Nous trouvons le véhicule, négocions et organisons son arrivée jusqu'à vous.",
    points: ["Recherche selon vos critères", "Négociation et achat", "Rapatriement jusqu'à vous"],
    featured: true,
  },
  {
    id: "export",
    icon: Ship,
    title: "Export de véhicules",
    text: "Nous préparons votre véhicule et ses documents pour l'envoyer vers le pays de votre choix.",
    points: ["Préparation du véhicule", "Documents d'exportation", "Envoi vers votre pays"],
  },
  {
    id: "dedouanement",
    icon: FileCheck,
    title: "Expédition et dédouanement",
    text: "Transport international et formalités douanières gérés pour vous, avec un suivi en ligne.",
    points: ["Transport international", "Formalités douanières", "Suivi de la commande"],
  },
  {
    id: "inspection",
    icon: ClipboardCheck,
    title: "Inspection du véhicule",
    text: "Achetez en confiance : nous contrôlons le véhicule avant de finaliser la commande.",
    points: ["Contrôle avant achat", "Photos du véhicule", "Rapport clair"],
  },
  {
    id: "financement",
    icon: Wallet,
    title: "Financement",
    text: "Des solutions adaptées à votre budget pour acheter votre véhicule sereinement.",
    points: ["Simulation de paiement", "Offres adaptées", "Aide pour le dossier"],
  },
];

const SLANT = "polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)";

export default function Services() {
  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);

  // Spotlight that follows the mouse inside each card
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const onMove = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>(".svc-card");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    grid.addEventListener("mousemove", onMove);
    return () => grid.removeEventListener("mousemove", onMove);
  }, []);

  // Entrance animations
  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const headTrigger = { trigger: ".svc-head", start: "top 85%", once: true };

      gsap.from(".svc-head-line", {
        yPercent: 110,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: headTrigger,
      });
      gsap.from(".svc-head-bar", {
        scaleX: 0,
        duration: 0.9,
        delay: 0.3,
        ease: "power3.out",
        scrollTrigger: headTrigger,
      });
      gsap.from(".svc-head-fade", {
        y: 20,
        opacity: 0,
        duration: 0.9,
        delay: 0.2,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: headTrigger,
      });

      // Cards rise in a wave, their icons pop in
      gsap.set(".svc-item", { opacity: 0, y: 50 });
      ScrollTrigger.batch(".svc-item", {
        start: "top 90%",
        once: true,
        onEnter: (items) => {
          gsap.to(items, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out", overwrite: true });
          const icons = items.flatMap((item) => Array.from(item.querySelectorAll(".svc-icon")));
          gsap.fromTo(
            icons,
            { scale: 0.5, rotate: -12 },
            { scale: 1, rotate: 0, duration: 0.8, stagger: 0.1, delay: 0.2, ease: "back.out(2)" }
          );
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const spotlight =
    "bg-[radial-gradient(circle_at_var(--mx,50%)_var(--my,50%),rgba(216,0,5,0.2),transparent_45%)]";

  return (
    <section
      ref={rootRef}
      id="services"
      aria-labelledby="services-heading"
      className="bg-white py-24 lg:py-[100px]"
    >
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Header */}
        <div className="svc-head mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2
              id="services-heading"
              className="text-3xl font-black uppercase leading-[1.05] tracking-tight text-black lg:text-5xl"
            >
              <span className="block overflow-hidden pb-1">
                <span className="svc-head-line block">Nos services</span>
              </span>
              <span className="block overflow-hidden pb-1 text-[#D80005]">
                <span className="svc-head-line block">de A à Z</span>
              </span>
            </h2>
            <div aria-hidden="true" className="svc-head-bar mt-5 h-[3px] w-12 origin-left bg-[#D80005]" />
            <p className="svc-head-fade mt-4 text-[15px] leading-relaxed text-gray-600">
              Tout ce qu&apos;il faut pour importer, exporter et livrer votre véhicule, avec un seul interlocuteur.
            </p>
          </div>

          <Link
            href="/services"
            className="svc-head-fade group inline-flex items-center gap-3 self-start border-2 border-black px-8 py-4 text-[13px] font-bold uppercase tracking-wider text-black transition-colors duration-300 hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2 lg:self-auto"
          >
            Tous nos services
            <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Services */}
        <ul ref={gridRef} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            const number = String(i + 1).padStart(2, "0");

            if (s.featured) {
              return (
                <li key={s.id} className="svc-item md:col-span-2">
                  <Link
                    href={`/services#${s.id}`}
                    className="svc-card group relative flex h-full min-h-[360px] flex-col justify-between overflow-hidden border border-black bg-black p-8 text-white transition-colors duration-300 hover:border-[#D80005] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2 lg:p-10"
                  >
                    {/* Decoration */}
                    <span aria-hidden="true" className="absolute -right-16 -top-20 h-[140%] w-[34%] rotate-[18deg] bg-[#D80005]" />
                    <span aria-hidden="true" className="absolute -right-2 -top-20 h-[140%] w-3 rotate-[18deg] bg-white/90" />
                    <span aria-hidden="true" className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${spotlight}`} />
                    <span aria-hidden="true" className="absolute bottom-2 right-8 text-[160px] font-black leading-none text-white/10">
                      {number}
                    </span>

                    <div className="relative z-10 max-w-[480px]">
                      <span className="svc-icon flex h-14 w-14 items-center justify-center bg-[#D80005] text-white">
                        <Icon size={26} aria-hidden="true" />
                      </span>
                      <h3 className="mt-8 text-3xl font-black uppercase leading-[1.05] tracking-tight lg:text-4xl">
                        {s.title}
                      </h3>
                      <p className="mt-4 text-[15px] leading-relaxed text-white/70">{s.text}</p>
                      <ul className="mt-6 space-y-2">
                        {s.points.map((p) => (
                          <li key={p} className="flex items-center gap-3 text-sm text-white/90">
                            <Check size={16} className="shrink-0 text-[#ff4d52]" aria-hidden="true" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <span className="relative z-10 mt-8 inline-flex items-center gap-3 text-[13px] font-bold uppercase tracking-wider">
                      En savoir plus
                      <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5" />
                    </span>
                  </Link>
                </li>
              );
            }

            return (
              <li key={s.id} className="svc-item">
                <Link
                  href={`/services#${s.id}`}
                  className="svc-card group relative flex h-full flex-col overflow-hidden border border-gray-200 bg-white p-8 transition-colors duration-300 hover:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2"
                >
                  {/* Fill-up effect and spotlight */}
                  <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-black transition-transform duration-500 ease-out group-hover:scale-y-100" />
                  <span aria-hidden="true" className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${spotlight}`} />

                  <div className="relative z-10 flex flex-1 flex-col">
                    <div className="flex items-start justify-between">
                      <span className="svc-icon flex h-14 w-14 items-center justify-center bg-black text-white transition-colors duration-300 group-hover:bg-[#D80005]">
                        <Icon size={26} aria-hidden="true" />
                      </span>
                      <span aria-hidden="true" className="text-5xl font-black leading-none text-gray-100 transition-colors duration-300 group-hover:text-white/10">
                        {number}
                      </span>
                    </div>

                    <h3 className="mt-8 text-xl font-black uppercase leading-tight text-black transition-colors duration-300 group-hover:text-white">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-white/70">
                      {s.text}
                    </p>
                    <ul className="mt-5 space-y-2">
                      {s.points.map((p) => (
                        <li key={p} className="flex items-center gap-3 text-sm text-gray-700 transition-colors duration-300 group-hover:text-white/90">
                          <Check size={16} className="shrink-0 text-[#D80005]" aria-hidden="true" />
                          {p}
                        </li>
                      ))}
                    </ul>

                    <span className="mt-auto inline-flex items-center gap-3 pt-8 text-[13px] font-bold uppercase tracking-wider text-black transition-colors duration-300 group-hover:text-white">
                      En savoir plus
                      <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}

          {/* Seller banner */}
          <li className="svc-item md:col-span-2 lg:col-span-3">
            <div className="relative flex flex-col gap-8 overflow-hidden bg-[#D80005] px-8 py-10 text-white lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-12">
              <span aria-hidden="true" className="absolute -right-10 top-0 h-full w-48 -skew-x-12 bg-black/20" />
              <span aria-hidden="true" className="absolute right-40 top-0 h-full w-3 -skew-x-12 bg-white/30" />
              <div className="relative z-10 max-w-2xl">
                <h3 className="text-2xl font-black uppercase leading-tight tracking-tight lg:text-3xl">
                  Vous avez un véhicule à vendre ?
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/85">
                  Créez un compte vendeur, publiez vos annonces et suivez vos ventes depuis votre espace.
                </p>
              </div>
              <Link
                href="/register"
                style={{ clipPath: SLANT }}
                className="relative z-10 inline-flex w-fit shrink-0 items-center gap-3 bg-white px-10 py-4 text-[14px] font-bold text-black transition-colors duration-300 hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:mr-24"
              >
                Devenir vendeur
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}