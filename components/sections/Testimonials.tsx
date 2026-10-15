"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { Quote } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ───────── Edit this part ───────── */

interface Testimonial {
  name: string;
  /** City and country, e.g. "Libreville, Gabon" */
  location: string;
  quote: string;
  /** Photo in /public, e.g. "/clients/jean.jpg" (optional) */
  image?: string;
  /** Example entries are NEVER shown on the live site. Delete this line for a real testimonial. */
  placeholder?: boolean;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Prénom N.",
    location: "Ville, Pays",
    quote:
      "Remplacez ce texte par le témoignage réel d'un client : comment s'est passée la commande, la livraison, et ce qu'il pense du véhicule reçu.",
    placeholder: true,
  },
  {
    name: "Prénom N.",
    location: "Ville, Pays",
    quote:
      "Un deuxième exemple. Gardez des phrases courtes, concrètes et sincères : c'est ce qui rassure le mieux les futurs clients.",
    placeholder: true,
  },
  {
    name: "Prénom N.",
    location: "Ville, Pays",
    quote:
      "Un troisième exemple. Une vraie photo du client avec son véhicule est la meilleure preuve que vous puissiez montrer.",
    placeholder: true,
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Testimonials() {
  // Example testimonials are hidden in production, so no fake review can go live
  const list = TESTIMONIALS.filter((t) => !t.placeholder || process.env.NODE_ENV !== "production");
  const count = list.length;
  const rootRef = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || count === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const trigger = { trigger: ".tm-head", start: "top 85%", once: true };
      gsap.from(".tm-head-line", { yPercent: 110, duration: 1, stagger: 0.1, ease: "power4.out", scrollTrigger: trigger });
      gsap.from(".tm-head-bar", { scaleX: 0, duration: 0.9, delay: 0.3, ease: "power3.out", scrollTrigger: trigger });
      gsap.from(".tm-card", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: ".tm-grid", start: "top 88%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, [count]);

  if (count === 0) return null;

  const gridClass =
    count === 1 ? "mx-auto max-w-2xl" : count === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      ref={rootRef}
      id="temoignages"
      aria-labelledby="testimonials-heading"
      className="relative isolate overflow-hidden bg-black py-24 text-white lg:py-[100px]"
    >
      <div aria-hidden="true" className="absolute -right-40 -top-40 -z-10 h-[560px] w-[560px] rounded-full bg-[#D80005]/20 blur-[140px]" />

      <div className="mx-auto max-w-[1280px] px-6">
        {/* Title */}
        <div className="tm-head mb-14 text-center">
          <h2
            id="testimonials-heading"
            className="text-3xl font-black uppercase leading-[1.05] tracking-tight lg:text-5xl"
          >
            <span className="block overflow-hidden pb-1">
              <span className="tm-head-line block">Ils nous ont</span>
            </span>
            <span className="block overflow-hidden pb-1 text-[#D80005]">
              <span className="tm-head-line block">fait confiance</span>
            </span>
          </h2>
          <div aria-hidden="true" className="tm-head-bar mx-auto mt-5 h-[3px] w-12 bg-[#D80005]" />
        </div>

        {/* Testimonials */}
        <ul className={`tm-grid grid gap-6 ${gridClass}`}>
          {list.map((t, i) => (
            <li key={`${t.name}-${i}`} className="tm-card">
              <figure className="group flex h-full flex-col border border-white/10 bg-white/[0.04] p-8 transition-colors duration-300 hover:border-[#D80005]">
                <Quote size={36} className="text-[#D80005]" aria-hidden="true" />

                {t.placeholder && (
                  <p className="mt-4 w-fit bg-amber-400 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-black">
                    Exemple — visible seulement en développement
                  </p>
                )}

                <blockquote className="mt-5 flex-1 text-[17px] leading-relaxed text-white/90">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <figcaption className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
                  {t.image ? (
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden bg-white/10">
                      <Image src={t.image} alt="" fill sizes="48px" className="object-cover" />
                    </span>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#D80005] font-black"
                    >
                      {initials(t.name)}
                    </span>
                  )}
                  <div>
                    <p className="font-black uppercase tracking-wide">{t.name}</p>
                    <p className="text-sm text-white/60">{t.location}</p>
                  </div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}