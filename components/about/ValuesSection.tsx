import { FileCheck2, Globe2, Handshake } from "lucide-react";
import Eyebrow from "@/components/ui/Eyebrow";

const VALUES = [
  { icon: Globe2, title: "Un réseau à l'étranger", text: "Nous achetons au Japon, en Corée du Sud, en Europe et aux États-Unis." },
  { icon: FileCheck2, title: "Des prix clairs", text: "Le devis indique le prix livré: achat, transport et formalités." },
  { icon: Handshake, title: "Un seul interlocuteur", text: "La même équipe s'occupe de votre dossier du début à la fin." },
];

export default function ValuesSection() {
  return (
    <section aria-labelledby="values-title" className="bg-gray-50">
      <div className="mx-auto w-full max-w-[1280px] px-6 py-20 md:py-28">
        <Eyebrow>Nos engagements</Eyebrow>
        <h2 id="values-title" className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-black md:text-4xl">
          Ce que vous pouvez attendre de nous
        </h2>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="border border-gray-200 border-t-4 border-t-[#D80005] bg-white p-8">
              <div className="flex items-center justify-between">
                <Icon size={28} className="text-black" aria-hidden="true" />
                <span aria-hidden="true" className="text-sm font-black text-gray-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-black tracking-tight text-black">{title}</h3>
              <p className="mt-3 text-base leading-relaxed text-gray-600">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}