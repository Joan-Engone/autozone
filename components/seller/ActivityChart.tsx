"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { DayPoint } from "@/lib/seller-stats";

const W = 720;
const H = 260;
const PAD = { left: 40, right: 12, top: 14, bottom: 30 };

// Round the top of the chart up to a multiple of 4, so the 4 grid lines show whole numbers
const niceMax = (value: number) => (value <= 4 ? 4 : Math.ceil(value / 4) * 4);

export default function ActivityChart({ series }: { series: DayPoint[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const viewsRef = useRef<SVGPathElement>(null);
  const quotesRef = useRef<SVGPathElement>(null);
  const areaRef = useRef<SVGPathElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const n = series.length;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const max = niceMax(Math.max(0, ...series.flatMap((p) => [p.views, p.quotes])));
  const total = series.reduce((sum, p) => sum + p.views + p.quotes, 0);

  const x = (i: number) => PAD.left + (n === 1 ? innerW / 2 : (i * innerW) / (n - 1));
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;
  const line = (key: "views" | "quotes") =>
    series.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(p[key]).toFixed(1)}`).join(" ");
  const area = `${line("views")} L${x(n - 1).toFixed(1)} ${PAD.top + innerH} L${x(0).toFixed(1)} ${PAD.top + innerH} Z`;

  // The lines draw themselves
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tweens: gsap.core.Tween[] = [];
    [viewsRef.current, quotesRef.current].forEach((path) => {
      if (!path) return;
      const length = path.getTotalLength();
      tweens.push(
        gsap.fromTo(
          path,
          { strokeDasharray: length, strokeDashoffset: length },
          { strokeDashoffset: 0, duration: 1.4, ease: "power2.out", clearProps: "strokeDasharray,strokeDashoffset" }
        )
      );
    });
    if (areaRef.current) tweens.push(gsap.fromTo(areaRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2, delay: 0.3 }));
    return () => tweens.forEach((t) => t.kill());
  }, [series]);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = ((e.clientX - rect.left) * W) / rect.width;
    const index = Math.round(((px - PAD.left) / innerW) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, index)));
  };

  const ticks = [0, 1, 2, 3, 4].map((i) => Math.round((max / 4) * i));
  const labelEvery = Math.ceil(n / 6);
  const point = hover !== null ? series[hover] : null;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-5 text-xs font-bold">
        <span className="flex items-center gap-2"><span className="h-[3px] w-5 bg-black" />Vues</span>
        <span className="flex items-center gap-2"><span className="h-[3px] w-5 bg-[#D80005]" />Demandes de devis</span>
      </div>

      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`Évolution des vues et des demandes de devis sur ${n} jours`}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
          className="h-auto w-full touch-pan-y"
        >
          {/* Grid */}
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="#E5E7EB" strokeWidth="1" />
              <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#9CA3AF">{t}</text>
            </g>
          ))}
          {series.map((p, i) =>
            i % labelEvery === 0 ? (
              <text key={p.date} x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#9CA3AF">{p.label}</text>
            ) : null
          )}

          {/* Data */}
          <path ref={areaRef} d={area} fill="rgba(0,0,0,0.05)" />
          <path ref={viewsRef} d={line("views")} fill="none" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          <path ref={quotesRef} d={line("quotes")} fill="none" stroke="#D80005" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

          {/* Hover marker */}
          {point && hover !== null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + innerH} stroke="#9CA3AF" strokeDasharray="4 4" />
              <circle cx={x(hover)} cy={y(point.views)} r="5" fill="#000" stroke="#fff" strokeWidth="2" />
              <circle cx={x(hover)} cy={y(point.quotes)} r="5" fill="#D80005" stroke="#fff" strokeWidth="2" />
            </g>
          )}
        </svg>

        {point && hover !== null && (
          <div
            className="pointer-events-none absolute top-2 -translate-x-1/2 border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg"
            style={{ left: `${(x(hover) / W) * 100}%` }}
          >
            <p className="font-black text-black">{point.label}</p>
            <p className="mt-1 text-gray-600">{point.views} vue{point.views > 1 ? "s" : ""}</p>
            <p className="text-[#D80005]">{point.quotes} devis</p>
          </div>
        )}

        {total === 0 && (
          <p className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 px-8 text-center text-sm text-gray-400">
            Pas encore de données. Les statistiques apparaissent dès que vos véhicules sont consultés.
          </p>
        )}
      </div>
    </div>
  );
}