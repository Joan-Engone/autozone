import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Eyebrow from "@/components/ui/Eyebrow";
import ValuesSection from "@/components/about/ValuesSection";
import SourcingGrid from "@/components/about/SourcingGrid";
import CtaBanner from "@/components/about/CtaBanner";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "À propos | Auto Zone Import & Export",
  description:
    "Auto Zone Import & Export vous accompagne dans l'achat, l'expédition et le dédouanement de véhicules importés.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        {/* Hero */}
        <section className="relative overflow-hidden bg-black text-white">
          <span aria-hidden="true" className="absolute -right-20 top-0 hidden h-full w-64 -skew-x-12 bg-[#D80005] md:block" />
          <div className="relative mx-auto w-full max-w-[1280px] px-6 py-20 md:py-32">
            <Eyebrow tone="dark">À propos</Eyebrow>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
              Nous faisons venir le véhicule que vous voulez, sans que vous ayez à gérer l&apos;import.
            </h1>
          </div>
        </section>

        {/* Story */}
        <section aria-labelledby="story-title" className="mx-auto grid w-full max-w-[1280px] gap-10 px-6 py-20 md:grid-cols-[1fr_2fr] md:gap-16 md:py-28">
          <div>
            <Eyebrow>Notre histoire</Eyebrow>
            <h2 id="story-title" className="mt-4 text-3xl font-black tracking-tight text-black md:text-4xl">
              Qui sommes-nous
            </h2>
          </div>
          <div className="max-w-prose space-y-5 text-lg leading-relaxed text-gray-700">
            <p>
              Auto Zone Import &amp; Export accompagne particuliers et professionnels dans l&apos;achat de
              véhicules à l&apos;étranger et leur acheminement jusqu&apos;à destination.
            </p>
            <p>
              Acheter un véhicule à l&apos;international, c&apos;est trouver un vendeur fiable, organiser le
              transport et passer la douane. Nous nous chargeons de ces trois étapes pour que vous receviez un
              véhicule contrôlé, au prix annoncé.
            </p>
            <Link
              href={ROUTES.services}
              className="group inline-flex min-h-11 items-center gap-2 font-bold text-black underline decoration-[#D80005] decoration-2 underline-offset-4 transition-colors hover:text-[#D80005] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2"
            >
              Découvrir nos services
              <ArrowRight size={18} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
            </Link>
          </div>
        </section>

        <ValuesSection />
        <SourcingGrid />

        <CtaBanner
          title="Dites-nous quel véhicule vous cherchez."
          description="Nous le trouvons, nous le contrôlons et nous l'acheminons jusqu'à vous."
          primary={{ label: "Contactez-nous", href: ROUTES.contact }}
        />
      </main>
      <Footer />
    </>
  );
}