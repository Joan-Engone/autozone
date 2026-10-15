import { FileCheck2, Handshake, PackageCheck, Search, Ship } from "lucide-react";
import ButtonLink from "@/components/ui/ButtonLink";
import { ROUTES } from "@/lib/routes";

const STEPS = [
  { icon: Search, title: "Choix du véhicule", text: "Vous choisissez dans notre catalogue, ou nous recherchons le modèle que vous voulez." },
  { icon: Handshake, title: "Achat", text: "Nous contrôlons le véhicule et négocions l'achat auprès du vendeur." },
  { icon: Ship, title: "Expédition", text: "Le véhicule est embarqué et vous suivez son acheminement." },
  { icon: FileCheck2, title: "Dédouanement", text: "Nous préparons les documents et réglons les formalités douanières." },
  { icon: PackageCheck, title: "Livraison", text: "Vous recevez votre véhicule avec tous ses papiers." },
];

export default function ProcessSteps() {
  return (
    <section id="services" className="mx-auto w-full max-w-[1280px] px-6 py-20 scroll-mt-28">
      <h2 className="text-2xl font-black tracking-tight text-black">Comment ça se passe</h2>
      <ol className="mt-10 grid gap-8 md:grid-cols-5">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="border-t-2 border-[#D80005] pt-5">
            <p className="text-xs font-bold text-gray-500">Étape {i + 1}</p>
            <Icon size={24} className="mt-4 text-black" />
            <h3 className="mt-3 text-base font-black text-black">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{text}</p>
          </li>
        ))}
      </ol>
      <div className="mt-12">
        <ButtonLink href={ROUTES.catalogue} variant="outline">
          Voir les véhicules disponibles
        </ButtonLink>
      </div>
    </section>
  );
}