"use client";

import { useLayoutEffect, useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Play } from "lucide-react";
import gsap from "gsap";

// The full-screen showroom is loaded on demand (it contains the 3D code)
const ShowreelModal = dynamic(() => import("./ShowreelModal"), { ssr: false });

// three.js is only loaded in the browser, and in its own chunk
const Car3D = dynamic(() => import("./Car3D"), {
  ssr: false,
  loading: () => <div className="aspect-[16/10] w-full" />,
});

/* ───────── Edit these ───────── */
const MODEL_SRC = "/models/car.glb";

const HIGHLIGHTS = ["Sourcing mondial", "Expédition sécurisée", "Suivi en temps réel"];

const SLANT = "polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const showreelBtnRef = useRef<HTMLButtonElement>(null);
  const [showreelOpen, setShowreelOpen] = useState(false);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(".hero-glow", { opacity: 0, scale: 0.6, duration: 2 }, 0)
        .from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.8 }, 0.1)
        .from(".hero-line", { yPercent: 110, duration: 1.1, stagger: 0.12 }, 0.2)
        .from(".hero-car", { x: 140, opacity: 0, scale: 0.9, duration: 1.5 }, 0.3)
        .from(".hero-fade", { y: 24, opacity: 0, duration: 0.9, stagger: 0.12 }, 0.9);

      // Soft light that follows the mouse
      if (glowRef.current) {
        const moveX = gsap.quickTo(glowRef.current, "x", { duration: 1.4, ease: "power3.out" });
        const moveY = gsap.quickTo(glowRef.current, "y", { duration: 1.4, ease: "power3.out" });
        const onMove = (e: MouseEvent) => {
          moveX((e.clientX / window.innerWidth - 0.5) * 80);
          moveY((e.clientY / window.innerHeight - 0.5) * 60);
        };
        root.addEventListener("mousemove", onMove);
        return () => root.removeEventListener("mousemove", onMove);
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <header
        ref={rootRef}
        className="relative isolate overflow-hidden bg-[#050505] text-white"
      >
        {/* Background */}
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div
            ref={glowRef}
            className="hero-glow absolute -right-40 top-1/2 -mt-[360px] h-[720px] w-[720px] rounded-full bg-[#D80005]/25 blur-[140px]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgba(255,255,255,0.07),transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:64px_64px]" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent" />
        </div>

        <div className="mx-auto grid min-h-[640px] max-w-[1280px] items-center gap-8 px-6 pb-20 pt-16 lg:min-h-[min(100svh,860px)] lg:grid-cols-[1fr_1.25fr] lg:px-12">
          {/* Text column */}
          <div className="relative z-10">
            <div className="hero-eyebrow mb-6 flex items-center gap-3">
              <span className="block h-[2px] w-8 bg-[#D80005]" />
              <p className="text-[12px] font-bold tracking-[0.2em] text-[#ff4d52]">
                IMPORTATION &amp; EXPORTATION DE VÉHICULES PREMIUM
              </p>
            </div>

            <h1 className="mb-6 text-[44px] font-black leading-[1.02] tracking-tight sm:text-[60px] lg:text-[76px]">
              <span className="block overflow-hidden pb-1">
                <span className="hero-line block">Portés par</span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span className="hero-line block">la passion.</span>
              </span>
              <span className="block overflow-hidden pb-1 text-[#D80005]">
                <span className="hero-line block">Livrés dans</span>
              </span>
              <span className="block overflow-hidden pb-1 text-[#D80005]">
                <span className="hero-line block">le monde entier.</span>
              </span>
            </h1>

            <p className="hero-fade mb-10 max-w-[440px] text-[15px] font-light leading-relaxed text-white/60 lg:text-base">
              Nous nous spécialisons dans le sourcing et l&apos;expédition de véhicules haut
              de gamme à travers le monde, avec confiance et excellence.
            </p>

            <div className="hero-fade flex flex-wrap items-center gap-6">
              <Link
                href="/catalogue"
                style={{ clipPath: SLANT }}
                className="bg-[#D80005] px-10 py-4 text-[14px] font-bold text-white transition-colors duration-300 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Parcourir le catalogue
              </Link>

              <button
                ref={showreelBtnRef}
                type="button"
                onClick={() => setShowreelOpen(true)}
                aria-haspopup="dialog"
                className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]"
              >
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/40 transition-all duration-300 group-hover:border-[#D80005] group-hover:bg-[#D80005]">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 animate-ping rounded-full border border-white/30 [animation-duration:2.4s]"
                  />
                  <Play size={14} className="translate-x-[1px] fill-white text-white" aria-hidden="true" />
                </span>
                <span className="text-[14px] font-bold text-white/80 transition-colors group-hover:text-white">
                  Voir le showreel
                </span>
              </button>
            </div>

            <ul className="hero-fade mt-12 flex flex-wrap gap-x-8 gap-y-2 text-[13px] text-white/50">
              {HIGHLIGHTS.map((h) => (
                <li key={h} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-[#D80005]" aria-hidden="true" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* 360° car */}
          <div className="hero-car relative">
            <Car3D
              src={MODEL_SRC}
              fallbackSrc="/hero.jpg"
              alt="Véhicule premium en 3D"
              className="relative aspect-[16/10] w-full"
              paused={showreelOpen}
            />
            <span className="absolute left-0 top-2 border border-white/20 px-3 py-1 text-[11px] font-bold tracking-widest text-white/70">
              360°
            </span>
          </div>
        </div>
      </header>

      <ShowreelModal
        open={showreelOpen}
        onClose={() => {
          setShowreelOpen(false);
          showreelBtnRef.current?.focus();
        }}
        modelSrc={MODEL_SRC}
      />
    </>
  );
}