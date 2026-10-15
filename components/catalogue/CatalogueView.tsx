"use client";
import { useMemo, useState } from "react";
import CatalogueFilters, { DEFAULT_FILTERS, FilterPanel } from "@/components/catalogue/CatalogueFilters";
import EmptyState from "@/components/catalogue/EmptyState";
import VehicleCard from "@/components/catalogue/VehicleCard";
import type { Filters } from "@/components/catalogue/CatalogueFilters";
import type { Vehicle } from "@/lib/data/vehicles";

interface CatalogueViewProps {
  vehicles: Vehicle[];
  /** Only the filters coming from the URL; everything else keeps its default. */
  initialFilters?: Partial<Filters>;
}

export default function CatalogueView({ vehicles, initialFilters }: CatalogueViewProps) {
  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_FILTERS, ...initialFilters });

  const results = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    const list = vehicles.filter((v) => {
      const matchesQuery = !q || `${v.make} ${v.model} ${v.year}`.toLowerCase().includes(q);
      const matchesOrigin = filters.origins.length === 0 || filters.origins.includes(v.origin);
      const matchesFuel = filters.fuels.length === 0 || filters.fuels.includes(v.fuel);
      const matchesGearbox =
        filters.transmissions.length === 0 || filters.transmissions.includes(v.transmission);
      return matchesQuery && matchesOrigin && matchesFuel && matchesGearbox;
    });
    return [...list].sort((a, b) => {
      if (filters.sort === "price-asc") return a.price - b.price;
      if (filters.sort === "price-desc") return b.price - a.price;
      return b.year - a.year;
    });
  }, [vehicles, filters]);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-10">
      <CatalogueFilters filters={filters} onChange={setFilters} resultCount={results.length} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Desktop side panel */}
        <aside className="hidden lg:block">
          <div className="sticky top-36 border border-gray-200 bg-white p-6">
            <FilterPanel filters={filters} onChange={setFilters} />
          </div>
        </aside>

        <section aria-label="Résultats">
          <p className="text-sm text-gray-600" aria-live="polite">
            {results.length} véhicule{results.length > 1 ? "s" : ""}
          </p>

          {results.length > 0 ? (
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </ul>
          ) : (
            <EmptyState onReset={() => setFilters(DEFAULT_FILTERS)} />
          )}
        </section>
      </div>
    </div>
  );
}