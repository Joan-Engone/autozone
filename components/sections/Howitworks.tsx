"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  FileCheck,
  FileText,
  Headphones,
  MapPin,
  PackageCheck,
  Search,
  Ship,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ───────── Edit the texts here (adapt them to your real process) ───────── */
interface Step {
  icon: LucideIcon;
  title: string;
  text: string;
}

const STEPS: Step[] = [
  {
    icon: Search,
    title: "Choisissez votre véhicule",
    text: "Parcourez notre catalogue ou décrivez-nous le véhicule recherché. Nous le trouvons pour vous.",
  },
  {
    icon: FileCheck,
    title: "Validez votre commande",
    text: "Vous recevez un devis détaillé. Une fois validé, vous confirmez votre commande et réglez selon les modalités convenues.",
  },
  {
    icon: Ship,
    title: "Expédition et dédouanement",
    text: "Nous organisons le transport et les formalités douanières. Vous suivez l'avancement de votre commande en ligne.",
  },
  {
    icon: PackageCheck,
    title: "Livraison",
    text: "Votre véhicule vous est livré avec ses documents. Il ne vous reste plus qu'à prendre la route.",
  },
];

const ASSURANCES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: FileText, title: "Devis clair", text: "Vous savez ce que vous payez avant de vous engager." },
  { icon: MapPin, title: "Suivi en ligne", text: "Chaque étape de votre commande est visible dans votre espace." },
  { icon: Headphones, title: "Accompagnement", text: "Un conseiller à votre écoute, de la demande à la livraison." },
];

const SLANT = "polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)";

export default function HowItWorks() {
  const rootRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLOListElement>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    const stepsEl = stepsRef.current;
    if (!root || !stepsEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Title and call to action
    const ctx = gsap.context(() => {
      gsap.from(".how-head-line", {
        yPercent: 110,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: { trigger: ".how-head", start: "top 85%", once: true },
      });
      gsap.from(".how-head-bar", {
        scaleX: 0,
        duration: 0.9,
        delay: 0.3,
        ease: "power3.out",
        scrollTrigger: { trigger: ".how-head", start: "top 85%", once: true },
      });
      gsap.from(".how-head-fade", {
        y: 20,
        opacity: 0,
        duration: 0.9,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: { trigger: ".how-head", start: "top 85%", once: true },
      });
      gsap.from(".how-extra", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: ".how-extra-wrap", start: "top 88%", once: true },
      });
    }, root);

    // The steps light up one after the other while you scroll
    const q = (selector: string) => Array.from(root.querySelectorAll<HTMLElement>(selector));
    const mm = gsap.matchMedia();

    mm.add({ desktop: "(min-width: 1024px)" }, (context) => {
      const { desktop } = context.conditions as { desktop: boolean };
      const icons = q(".how-icon");
      const numbers = q(".how-num");
      const bodies = q(".how-body");
      const segX = q(".how-seg-x");
      const segY = q(".how-seg-y");

      // Start state: only the first step is lit
      gsap.set(icons.slice(1), { backgroundColor: "#0a0a0a" });
      gsap.set(numbers.slice(1), { color: "#E5E7EB" });
      gsap.set(bodies.slice(1), { opacity: 0.4, y: 12 });
      gsap.set(segX, { scaleX: 0 });
      gsap.set(segY, { scaleY: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stepsEl,
          start: "top 70%",
          end: desktop ? "+=650" : "bottom 60%",
          scrub: 0.6,
        },
      });

      STEPS.forEach((_, i) => {
        if (i < STEPS.length - 1) {
          tl.to(segX[i], { scaleX: 1, duration: 0.9 }, i);
          tl.to(segY[i], { scaleY: 1, duration: 0.9 }, i);
        }
        if (i > 0) {
          const at = i - 0.3;
          tl.to(icons[i], { backgroundColor: "#D80005", duration: 0.3 }, at);
          tl.to(numbers[i], { color: "#D80005", duration: 0.3 }, at);
          tl.to(bodies[i], { opacity: 1, y: 0, duration: 0.3 }, at);
        }
      });
    });

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="comment-ca-marche"
      aria-labelledby="how-heading"
      className="border-t border-gray-100 bg-gray-50 py-24 lg:py-[100px]"
    >
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Header */}
        <div className="how-head mb-16 max-w-2xl lg:mb-20">
          <h2
            id="how-heading"
            className="text-3xl font-black uppercase leading-[1.05] tracking-tight text-black lg:text-5xl"
          >
            <span className="block overflow-hidden pb-1">
              <span className="how-head-line block">Comment ça marche</span>
            </span>
            <span className="block overflow-hidden pb-1 text-[#D80005]">
              <span className="how-head-line block">en 4 étapes</span>
            </span>
          </h2>
          <div aria-hidden="true" className="how-head-bar mt-5 h-[3px] w-12 origin-left bg-[#D80005]" />
          <p className="how-head-fade mt-4 text-[15px] leading-relaxed text-gray-600">
            De la sélection à la livraison, un parcours simple et transparent. Vous savez toujours où en est votre commande.
          </p>
        </div>

        {/* Steps */}
        <ol ref={stepsRef} className="grid gap-12 lg:grid-cols-4 lg:gap-8">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isLast = i === STEPS.length - 1;
            return (
              <li key={step.title} className="relative flex gap-6 lg:flex-col lg:items-center lg:gap-0 lg:text-center">
                {/* Connector to the next step */}
                {!isLast && (
                  <>
                    {/* Mobile: vertical */}
                    <span
                      aria-hidden="true"
                      className="absolute left-[33px] top-[68px] h-[calc(100%-20px)] w-[2px] bg-gray-200 lg:hidden"
                    >
                      <span className="how-seg-y block h-full w-full origin-top bg-[#D80005]" />
                    </span>
                    {/* Desktop: horizontal */}
                    <span
                      aria-hidden="true"
                      className="absolute left-[calc(50%+34px)] top-[33px] hidden h-[2px] w-[calc(100%-36px)] bg-gray-200 lg:block"
                    >
                      <span className="how-seg-x block h-full w-full origin-left bg-[#D80005]" />
                    </span>
                  </>
                )}

                <div className="how-icon relative z-10 flex h-[68px] w-[68px] shrink-0 items-center justify-center bg-[#D80005] text-white">
                  <Icon size={28} aria-hidden="true" />
                </div>

                <div className="how-body lg:mt-8">
                  <p className="how-num text-[56px] font-black leading-none text-[#D80005]" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-lg font-black uppercase leading-tight text-black">
                    <span className="sr-only">Étape {i + 1} : </span>
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{step.text}</p>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Reassurance and call to action */}
        <div className="how-extra-wrap mt-20 lg:mt-24">
          <ul className="how-extra grid border border-gray-200 bg-white md:grid-cols-3 md:divide-x md:divide-gray-200">
            {ASSURANCES.map((a) => {
              const Icon = a.icon;
              return (
                <li key={a.title} className="flex gap-4 border-b border-gray-200 p-6 last:border-b-0 md:border-b-0">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-black text-white">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-black uppercase text-black">{a.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">{a.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          
        </div>
      </div>
    </section>
  );
}