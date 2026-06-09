import { ShieldCheck, FileText, Globe, Lock } from "lucide-react";

interface TrustItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const TRUST_ITEMS: TrustItem[] = [
  {
    id: "verified",
    icon: <ShieldCheck size={44} className="text-[#D80005]" aria-hidden />,
    title: "Vérifié & Certifié",
    description:
      "Tous les véhicules sont soigneusement inspectés et certifiés avant expédition.",
  },
  {
    id: "reports",
    icon: <FileText size={44} className="text-[#D80005]" aria-hidden />,
    title: "Rapports d'Inspection",
    description:
      "Rapports d'inspection détaillés fournis pour une totale transparence.",
  },
  {
    id: "worldwide",
    icon: <Globe size={44} className="text-[#D80005]" aria-hidden />,
    title: "Livraison Mondiale",
    description:
      "Nous expédions votre véhicule en toute sécurité partout dans le monde.",
  },
  {
    id: "secure",
    icon: <Lock size={44} className="text-[#D80005]" aria-hidden />,
    title: "Transactions Sécurisées",
    description:
      "Processus de paiement sécurisé, simple et sans tracas.",
  },
];

export default function TrustRibbon() {
  return (
    <section
      aria-label="Nos engagements qualité"
      className="bg-[#F8F9FA] py-16 border-y border-gray-100"
    >
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {TRUST_ITEMS.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center text-center space-y-4"
          >
            {item.icon}
            <div className="space-y-1">
              <h4 className="font-bold text-sm uppercase tracking-tight text-black">
                {item.title}
              </h4>
              <p className="text-gray-500 text-[13px] leading-snug">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}