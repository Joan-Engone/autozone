"use client";
import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { FUELS, ORIGINS, TRANSMISSIONS } from "@/lib/data/vehicles";
import type { Fuel, Origin, Transmission } from "@/lib/data/vehicles";

export type SortKey = "recent" | "price-asc" | "price-desc";

export interface Filters {
  query: string;
  origins: Origin[];
  fuels: Fuel[];
  transmissions: Transmission[];
  sort: SortKey;
}

export const DEFAULT_FILTERS: Filters = {
  query: "",
  origins: [],
  fuels: [],
  transmissions: [],
  sort: "recent",
};

/** Number of filters chosen in the side panel (the search box is not counted). */
export function countFilters(f: Filters): number {
  return f.origins.length + f.fuels.length + f.transmissions.length;
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

/* ───────── Side panel: groups of checkboxes ───────── */

interface CheckGroupProps<T extends string> {
  title: string;
  options: readonly T[];
  selected: T[];
  onToggle: (value: T) => void;
}

function CheckGroup<T extends string>({ title, options, selected, onToggle }: CheckGroupProps<T>) {
  return (
    <fieldset className="border-t border-gray-100 py-5 first:border-t-0 first:pt-0">
      <legend className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">{title}</legend>
      {options.map((option) => (
        <label key={option} className="flex cursor-pointer items-center gap-3 py-2 text-sm font-medium text-black">
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => onToggle(option)}
            className="h-4 w-4 accent-[#D80005]"
          />
          {option}
        </label>
      ))}
    </fieldset>
  );
}

interface FilterPanelProps {
  filters: Filters;
  onChange: (next: Filters) => void;
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const count = countFilters(filters);
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-black tracking-tight text-black">Filtres</h2>
        {count > 0 && (
          <button
            type="button"
            onClick={() => onChange({ ...filters, origins: [], fuels: [], transmissions: [] })}
            className="text-xs font-bold text-gray-500 underline underline-offset-2 hover:text-[#D80005]"
          >
            Réinitialiser ({count})
          </button>
        )}
      </div>
      <CheckGroup
        title="Provenance"
        options={ORIGINS}
        selected={filters.origins}
        onToggle={(v) => onChange({ ...filters, origins: toggle(filters.origins, v) })}
      />
      <CheckGroup
        title="Carburant"
        options={FUELS}
        selected={filters.fuels}
        onToggle={(v) => onChange({ ...filters, fuels: toggle(filters.fuels, v) })}
      />
      <CheckGroup
        title="Boîte"
        options={TRANSMISSIONS}
        selected={filters.transmissions}
        onToggle={(v) => onChange({ ...filters, transmissions: toggle(filters.transmissions, v) })}
      />
    </div>
  );
}

/* ───────── Toolbar: search, sort, mobile filters button, chosen filters ───────── */

interface CatalogueFiltersProps {
  filters: Filters;
  onChange: (next: Filters) => void;
  resultCount: number;
}

export default function CatalogueFilters({ filters, onChange, resultCount }: CatalogueFiltersProps) {
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const count = countFilters(filters);

  // Mobile sheet: lock page scroll, close on Escape or when the screen becomes wide
  useEffect(() => {
    if (!sheetOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    const media = window.matchMedia("(min-width: 1024px)");
    const onMedia = () => media.matches && setSheetOpen(false);
    document.addEventListener("keydown", onKey);
    media.addEventListener("change", onMedia);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      media.removeEventListener("change", onMedia);
    };
  }, [sheetOpen]);

  const chips: { key: string; label: string; remove: () => void }[] = [
    ...filters.origins.map((v) => ({
      key: `o-${v}`,
      label: v,
      remove: () => onChange({ ...filters, origins: filters.origins.filter((x) => x !== v) }),
    })),
    ...filters.fuels.map((v) => ({
      key: `f-${v}`,
      label: v,
      remove: () => onChange({ ...filters, fuels: filters.fuels.filter((x) => x !== v) }),
    })),
    ...filters.transmissions.map((v) => ({
      key: `t-${v}`,
      label: v,
      remove: () => onChange({ ...filters, transmissions: filters.transmissions.filter((x) => x !== v) }),
    })),
  ];

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <label htmlFor="search" className="sr-only">
            Rechercher un véhicule
          </label>
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input
            id="search"
            type="search"
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="Marque, modèle ou année"
            className="w-full border border-gray-300 bg-white py-4 pl-12 pr-4 text-sm text-black placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]"
          />
        </div>

        <label htmlFor="sort" className="sr-only">
          Trier par
        </label>
        <select
          id="sort"
          value={filters.sort}
          onChange={(e) => onChange({ ...filters, sort: e.target.value as SortKey })}
          className="border border-gray-300 bg-white px-4 py-4 text-sm text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]"
        >
          <option value="recent">Plus récents</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>

        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="flex items-center justify-center gap-2 border border-black px-6 py-4 text-sm font-bold text-black transition-colors hover:bg-black hover:text-white lg:hidden"
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          Filtres{count > 0 && ` (${count})`}
        </button>
      </div>

      {chips.length > 0 && (
        <ul className="mt-4 flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <li key={chip.key}>
              <button
                type="button"
                onClick={chip.remove}
                aria-label={`Retirer le filtre ${chip.label}`}
                className="flex items-center gap-2 rounded-full bg-black py-1.5 pl-4 pr-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#D80005]"
              >
                {chip.label}
                <X size={13} aria-hidden="true" />
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => onChange({ ...filters, origins: [], fuels: [], transmissions: [] })}
              className="px-2 text-[13px] font-bold text-gray-500 underline underline-offset-2 hover:text-[#D80005]"
            >
              Tout effacer
            </button>
          </li>
        </ul>
      )}

      {/* Mobile sheet */}
      {sheetOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Filtres">
          <button
            type="button"
            aria-label="Fermer les filtres"
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-2xl bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <p className="text-base font-black text-black">Filtrer les véhicules</p>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                aria-label="Fermer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-black hover:bg-gray-200"
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-5">
              <FilterPanel filters={filters} onChange={onChange} />
            </div>
            <div className="border-t border-gray-100 p-4">
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="w-full bg-[#D80005] py-4 text-[13px] font-bold uppercase text-white transition-colors hover:bg-black"
              >
                Voir {resultCount} véhicule{resultCount > 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}