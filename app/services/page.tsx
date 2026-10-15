import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Eyebrow from "@/components/ui/Eyebrow";
import ServiceStep from "@/components/services/ServiceSteps";
import CtaBanner from "@/components/about/CtaBanner";
import { ROUTES } from "@/lib/routes";
import { SERVICES } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Services | Auto Zone Import & Export",
  description: "Recherche, achat, contrôle, expédition, dédouanement et livraison de véhicules importés.",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        <section className="border-b border-gray-100">
          <div className="mx-auto grid w-full max-w-[1280px] gap-14 px-6 py-16 md:py-24 lg:grid-cols-[5fr_7fr] lg:gap-24">
            {/* The title stays in view while the steps scroll on large screens */}
            <div className="lg:sticky lg:top-36 lg:self-start">
              <Eyebrow>Nos services</Eyebrow>
              <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight text-black md:text-5xl">
                Chaque étape de votre import, gérée pour vous.
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-600">
                De la recherche du véhicule à sa livraison, nous gérons chaque étape de l&apos;import. La même
                équipe s&apos;occupe de votre dossier du début à la fin.
              </p>
            </div>

            <ol aria-label="Les étapes de l'import">
              {SERVICES.map((service, i) => (
                <ServiceStep key={service.title} service={service} index={i} isLast={i === SERVICES.length - 1} />
              ))}
            </ol>
          </div>
        </section>

        <CtaBanner
          title="Prêt à lancer votre import ?"
          description="Dites-nous quel véhicule vous cherchez. Nous vous répondons avec le prix livré."
          primary={{ label: "Demander un devis", href: ROUTES.contact }}
          secondary={{ label: "Voir le catalogue", href: ROUTES.catalogue }}
        />
      </main>
      <Footer />
    </>
  );
}