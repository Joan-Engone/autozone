import Logo from "@/components/layout/Logo";

export default function AuthBrandPanel() {
  return (
    <section className="hidden md:flex flex-col justify-between bg-black text-white p-14">
      <Logo tone="onDark" />
      <div className="max-w-md">
        <h1 className="text-4xl font-black leading-tight tracking-tight">
          Suivez vos véhicules, de l&apos;achat à la livraison.
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-gray-300">
          Connectez-vous pour consulter vos commandes, vos devis et l&apos;état de vos expéditions.
        </p>
      </div>
      <p className="text-xs text-gray-500">Import &amp; Export de véhicules</p>
    </section>
  );
}