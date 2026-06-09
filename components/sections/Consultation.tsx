"use client";

import Image from "next/image";
import { Truck, Shield, Headphones, Send } from "lucide-react";
import { type FormEvent, useState } from "react";

interface ConsultationForm {
  name: string;
  email: string;
  vehicle: string;
  message: string;
}

const GLOBAL_FEATURES = [
  { icon: <Truck size={20} className="text-[#D80005]" aria-hidden />, label: "Livraison Internationale" },
  { icon: <Shield size={20} className="text-[#D80005]" aria-hidden />, label: "Transactions Sécurisées" },
  { icon: <Headphones size={20} className="text-[#D80005]" aria-hidden />, label: "Support Client 24/7" },
];

export default function Consultation() {
  const [form, setForm] = useState<ConsultationForm>({
    name: "",
    email: "",
    vehicle: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: wire to backend / email service
    console.log("Form submitted:", form);
  };

  return (
    <section
      id="contact"
      aria-labelledby="consultation-heading"
      className="py-24 lg:py-[100px] bg-white"
    >
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-14 items-start">
        {/* Left: Global Reach */}
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-[#D80005] font-bold text-[12px] tracking-widest uppercase">
              PRÉSENCE MONDIALE
            </p>
            <h2 className="text-[30px] lg:text-[32px] font-black uppercase text-black leading-tight">
              L&apos;EXCELLENCE SANS FRONTIÈRES
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
            Que vous achetiez ou expédiez, notre réseau mondial garantit que
            votre véhicule arrive en toute sécurité et dans les délais.
          </p>
          <ul className="space-y-5">
            {GLOBAL_FEATURES.map((feature) => (
              <li key={feature.label} className="flex items-center gap-4">
                {feature.icon}
                <span className="font-bold text-sm uppercase tracking-tight text-black">
                  {feature.label}
                </span>
              </li>
            ))}
          </ul>
          <button className="bg-[#D80005] text-white font-bold text-[13px] uppercase px-10 py-4 hover:bg-black transition-colors duration-300 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2">
            EN SAVOIR PLUS
          </button>
        </div>

        {/* Center: Image */}
        <div className="relative w-full aspect-[4/5] overflow-hidden">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUOT1AnBad7ukKdYJnIQiuRloLU_EMR3ybEPlNGNHpSuaX7bReHdPG8wGPSruU5ONRaYbIQ4k5QTV-AsgNxCavKBqSAJ2xeSHYvX8BeLC2YFaAtgsXVwIDlGn--QMhH7tptWrCPRsGF1Qz4dA4ZYcztepv-4h-7BqodJuD94HUG9NATlzb66TMJXXw4lm8pBzHi85X229uQBKEhQlAP1RssqJIgUVaIKhH-3m89MU6FiDLJakE-4T2R51DFjd9QXzkpT31cFNtPGyd"
            alt="Véhicule premium en transit international"
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover"
            loading="lazy"
          />
        </div>

        {/* Right: Form */}
        <div>
          <h3
            id="consultation-heading"
            className="font-black text-xl uppercase text-black mb-8"
          >
            DEMANDER UNE CONSULTATION PRIVÉE
          </h3>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4"
            aria-label="Formulaire de consultation"
          >
            <div>
              <label htmlFor="name" className="sr-only">
                Nom complet
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Nom complet"
                required
                autoComplete="name"
                className="w-full bg-[#F8F9FA] border-none px-5 py-4 focus:ring-2 focus:ring-[#D80005] outline-none text-sm transition-shadow duration-200"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Adresse e-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Adresse e-mail"
                required
                autoComplete="email"
                className="w-full bg-[#F8F9FA] border-none px-5 py-4 focus:ring-2 focus:ring-[#D80005] outline-none text-sm transition-shadow duration-200"
              />
            </div>
            <div>
              <label htmlFor="vehicle" className="sr-only">
                Véhicule souhaité
              </label>
              <input
                id="vehicle"
                name="vehicle"
                type="text"
                value={form.vehicle}
                onChange={handleChange}
                placeholder="Véhicule / Marque souhaité"
                className="w-full bg-[#F8F9FA] border-none px-5 py-4 focus:ring-2 focus:ring-[#D80005] outline-none text-sm transition-shadow duration-200"
              />
            </div>
            <div>
              <label htmlFor="message" className="sr-only">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Message"
                rows={4}
                className="w-full bg-[#F8F9FA] border-none px-5 py-4 focus:ring-2 focus:ring-[#D80005] outline-none text-sm resize-none transition-shadow duration-200"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#D80005] text-white font-bold text-[13px] uppercase py-5 flex items-center justify-center gap-3 hover:bg-black transition-colors duration-300 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2"
            >
              DEMANDER UNE CONSULTATION{" "}
              <Send size={16} aria-hidden />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}