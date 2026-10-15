import { SearchX } from "lucide-react";
import ButtonLink from "@/components/ui/ButtonLink";
import { ROUTES } from "@/lib/routes";

export default function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-6 flex flex-col items-center border border-dashed border-gray-300 px-6 py-20 text-center">
      <SearchX size={40} className="text-gray-400" />
      <h2 className="mt-4 text-lg font-black text-black">Aucun véhicule ne correspond</h2>
      <p className="mt-2 max-w-sm text-sm text-gray-600">
        Modifiez vos filtres, ou dites-nous ce que vous cherchez et nous le trouverons pour vous.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onReset}
          className="border border-black px-8 py-4 text-[13px] font-bold uppercase text-black transition-colors hover:bg-black hover:text-white"
        >
          Réinitialiser les filtres
        </button>
        <ButtonLink href={ROUTES.contact}>Contactez-nous</ButtonLink>
      </div>
    </div>
  );
}