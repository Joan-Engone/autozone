"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, X } from "lucide-react";
import gsap from "gsap";
import Car3D from "./Car3D";

interface ShowreelModalProps {
  open: boolean;
  onClose: () => void;
  /** Path of the .glb model, e.g. /models/car.glb */
  modelSrc: string;
}

/** Full-screen 360° showroom: opens with a circular reveal from the hero. */
export default function ShowreelModal({ open, onClose, modelSrc }: ShowreelModalProps) {
  const [mounted, setMounted] = useState(false);
  const [spinning, setSpinning] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Mount when opening (unmounting happens after the closing animation)
  useEffect(() => {
    if (open) {
      setSpinning(true);
      setMounted(true);
    }
  }, [open]);

  // Open / close animation
  useLayoutEffect(() => {
    if (!mounted) return;
    const overlay = overlayRef.current;
    if (!overlay) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ui = overlay.querySelectorAll(".showroom-ui");

    gsap.killTweensOf(overlay);

    if (open) {
      gsap.fromTo(
        overlay,
        { clipPath: "circle(0% at 50% 65%)" },
        {
          clipPath: "circle(150% at 50% 65%)",
          duration: reduce ? 0 : 1,
          ease: "power3.inOut",
        }
      );
      gsap.fromTo(
        ui,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: reduce ? 0 : 0.7, stagger: 0.1, delay: reduce ? 0 : 0.6, ease: "power3.out" }
      );
      closeRef.current?.focus();
    } else {
      gsap.to(overlay, {
        clipPath: "circle(0% at 50% 65%)",
        duration: reduce ? 0 : 0.6,
        ease: "power3.in",
        onComplete: () => setMounted(false),
      });
    }
  }, [open, mounted]);

  // Escape to close, keep focus inside, lock page scroll
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !overlayRef.current) return;
      const focusable = overlayRef.current.querySelectorAll<HTMLElement>("button");
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const controlClass =
    "showroom-ui flex items-center gap-2 border border-white/25 px-5 py-3 text-[13px] font-bold text-white transition-colors hover:border-[#D80005] hover:bg-[#D80005] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Showroom 360 degrés"
      className="fixed inset-0 z-[100] flex flex-col bg-[#050505] text-white"
    >
      {/* Background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -ml-[360px] -mt-[300px] h-[720px] w-[720px] rounded-full bg-[#D80005]/20 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:64px_64px]" />
        <span className="absolute inset-x-0 top-0 h-[3px] bg-[#D80005]" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="showroom-ui">
          <p className="text-[12px] font-bold tracking-[0.2em] text-[#ff4d52]">AUTO ZONE</p>
          <p className="text-xl font-black tracking-tight">Showroom 360°</p>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Fermer le showroom"
          className="showroom-ui flex h-11 w-11 items-center justify-center border border-white/25 transition-colors hover:border-[#D80005] hover:bg-[#D80005] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* The car, as large as possible */}
      <div className="relative z-10 min-h-0 flex-1">
        <div className="absolute inset-0">
          <Car3D
            src={modelSrc}
            fallbackSrc="/hero.jpg"
            alt="Véhicule en 3D"
            className="h-full w-full"
            interactive
            autoRotate={spinning}
            autoRotateSpeed={2}
            resetKey={resetKey}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 px-6 pb-8 pt-4">
        <button type="button" onClick={() => setSpinning((s) => !s)} className={controlClass}>
          {spinning ? <Pause size={16} /> : <Play size={16} />}
          {spinning ? "Pause" : "Rotation automatique"}
        </button>
        <button type="button" onClick={() => setResetKey((k) => k + 1)} className={controlClass}>
          <RotateCcw size={16} />
          Réinitialiser la vue
        </button>
      </div>
    </div>
  );
}