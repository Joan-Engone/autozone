import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/ui/PageHeader";
import CatalogueView from "@/components/catalogue/CatalogueView";
import type { Filters } from "@/components/catalogue/CatalogueFilters";
import { ROUTES } from "@/lib/routes";
import { FUELS, ORIGINS, VEHICLES } from "@/lib/data/vehicles";

export const metadata: Metadata = { title: "Catalogue | Auto Zone Import & Export" };

interface CataloguePageProps {
  searchParams: Promise<{ origin?: string; fuel?: string; q?: string }>;
}

export default async function CataloguePage({ searchParams }: CataloguePageProps) {
  const params = await searchParams;

  // Filters can come from the URL: the navbar's "Catalogue" menu links to /catalogue?origin=Japon
  const origin = ORIGINS.find((o) => o === params.origin);
  const fuel = FUELS.find((f) => f === params.fuel);
  const initialFilters: Partial<Filters> = {
    ...(params.q ? { query: params.q } : {}),
    ...(origin ? { origins: [origin] } : {}),
    ...(fuel ? { fuels: [fuel] } : {}),
  };

  return (
    <>
      <Navbar />
      <main className="bg-white">
        <PageHeader
          title="Catalogue"
          description="Véhicules disponibles en stock et en cours d'acheminement. Un modèle vous intéresse ? Demandez un devis, nous vous répondons avec le prix livré."
        >
          <Link
            href={ROUTES.about}
            className="text-sm font-bold text-black underline underline-offset-4 hover:text-[#D80005] transition-colors"
          >
            Comment fonctionne l&apos;import ?
          </Link>
        </PageHeader>
        {/* key: when the URL filters change (navbar menu), the view restarts with the new filters */}
        <CatalogueView
          key={JSON.stringify(initialFilters)}
          vehicles={VEHICLES}
          initialFilters={initialFilters}
        />
      </main>
      <Footer />
    </>
  );
}