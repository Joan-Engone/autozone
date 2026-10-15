"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// three.js is only loaded in the browser, and only when this block is about to be seen
const Car3D = dynamic(() => import("@/components/sections/Car3D"), { ssr: false });

const SLANT = "polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)";

interface Showcase3DProps {
  modelSrc?: string;
}

/** Black feature block inside the white grid: a 3D car you can spin + a link to the full catalogue. */
export default function Showase3D({ modelSrc = "/models/car.glb" }: Showcase3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  // Start the 3D scene only when the block is close to the screen
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative isolate h-full min-h-[380px] overflow-hidden bg-black text-white"
    >
      {/* Background shapes */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute -right-16 -top-24 h-[150%] w-[38%] rotate-[18deg] bg-[#D80005]" />
        <div className="absolute -right-2 -top-24 h-[150%] w-3 rotate-[18deg] bg-white/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_70%,rgba(255,255,255,0.12),transparent_60%)]" />
      </div>

      {/* 3D car */}
      <div className="absolute inset-y-0 right-0 w-full sm:w-[68%]">
        {near && (
          <Car3D
            src={modelSrc}
            fallbackSrc="/hero.jpg"
            alt="Véhicule en 3D"
            className="h-full w-full"
          />
        )}
      </div>

      {/* Text */}
      <div className="relative z-10 flex h-full max-w-[300px] flex-col justify-between p-7">
        <div>
          <p className="mb-3 text-[11px] font-bold tracking-[0.2em] text-[#ff4d52]">VISITE EN 3D</p>
          <h3 className="text-2xl font-black uppercase leading-[1.05] tracking-tight lg:text-3xl">
            Faites tourner le véhicule
          </h3>
        </div>
        <Link
          href="/catalogue"
          style={{ clipPath: SLANT }}
          className="mt-8 inline-flex w-fit items-center gap-3 bg-white px-8 py-3.5 text-[13px] font-bold uppercase text-black transition-colors duration-300 hover:bg-[#D80005] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Tout le catalogue
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}