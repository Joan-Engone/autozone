"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { AlertCircle, ArrowRight, Check, Loader2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ───────── Edit this part. Empty lines are simply not shown. ───────── */
const CONTACT = {
  phone: "", // e.g. "+241 01 23 45 67"
  email: "", // e.g. "contact@autozone.com"
  whatsapp: "", // number with country code, no "+" or spaces, e.g. "24101234567"
  address: "", // e.g. "Libreville, Gabon"
};

const SUBJECTS = ["Acheter un véhicule", "Vendre un véhicule", "Exporter un véhicule", "Autre demande"];

const SLANT = "polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface InfoItem {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

const INFO: InfoItem[] = [
  CONTACT.phone && {
    icon: Phone,
    label: "Téléphone",
    value: CONTACT.phone,
    href: `tel:${CONTACT.phone.replace(/\s/g, "")}`,
  },
  CONTACT.whatsapp && {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Écrivez-nous sur WhatsApp",
    href: `https://wa.me/${CONTACT.whatsapp}`,
  },
  CONTACT.email && { icon: Mail, label: "E-mail", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  CONTACT.address && { icon: MapPin, label: "Adresse", value: CONTACT.address },
].filter(Boolean) as InfoItem[];

export default function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "", website: "" });
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [formError, setFormError] = useState("");

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  // Entrance animations
  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const trigger = { trigger: ".ct-head", start: "top 85%", once: true };
      gsap.from(".ct-head-line", { yPercent: 110, duration: 1, stagger: 0.1, ease: "power4.out", scrollTrigger: trigger });
      gsap.from(".ct-head-bar", { scaleX: 0, duration: 0.9, delay: 0.3, ease: "power3.out", scrollTrigger: trigger });
      gsap.from(".ct-fade", { y: 20, opacity: 0, duration: 0.9, delay: 0.2, stagger: 0.1, ease: "power3.out", scrollTrigger: trigger });
      gsap.from(".ct-card", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ct-card", start: "top 88%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // Little pop when the message has been sent
  useEffect(() => {
    if (status !== "sent") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = gsap.fromTo(
      ".ct-check",
      { scale: 0 },
      { scale: 1, duration: 0.7, ease: "back.out(2)", clearProps: "transform" }
    );
    return () => {
      tween.kill();
    };
  }, [status]);

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (values.name.trim().length < 2) next.name = "Saisissez votre nom.";
    if (!values.email.trim()) next.email = "Saisissez votre adresse e-mail.";
    else if (!EMAIL_RE.test(values.email.trim())) next.email = "Cette adresse e-mail n'est pas valide.";
    if (values.message.trim().length < 10) next.message = "Écrivez au moins quelques mots (10 caractères).";
    return next;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, subject }),
      });
      if (!response.ok) {
        setFormError(
          response.status === 429
            ? "Vous avez envoyé plusieurs messages. Réessayez un peu plus tard."
            : "Votre message n'a pas pu être envoyé. Réessayez dans un instant."
        );
        setStatus("idle");
        return;
      }
      setStatus("sent");
    } catch {
      setFormError("Connexion impossible. Vérifiez votre réseau et réessayez.");
      setStatus("idle");
    }
  };

  const reset = () => {
    setValues({ name: "", email: "", phone: "", message: "", website: "" });
    setSubject(SUBJECTS[0]);
    setErrors({});
    setStatus("idle");
  };

  const input =
    "w-full border bg-white px-4 py-4 text-sm text-black placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]";
  const label = "mb-2 block text-[13px] font-bold text-black";

  return (
    <section
      ref={rootRef}
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-24 bg-gray-50 py-24 lg:py-[100px]"
    >
      <div className="mx-auto grid max-w-[1280px] gap-14 px-6 lg:grid-cols-12 lg:gap-16">
        {/* Left: text and contact details */}
        <div className="ct-head lg:col-span-5">
          <h2
            id="contact-heading"
            className="text-3xl font-black uppercase leading-[1.05] tracking-tight text-black lg:text-5xl"
          >
            <span className="block overflow-hidden pb-1">
              <span className="ct-head-line block">Contactez-nous</span>
            </span>
            <span className="block overflow-hidden pb-1 text-[#D80005]">
              <span className="ct-head-line block">on vous répond</span>
            </span>
          </h2>
          <div aria-hidden="true" className="ct-head-bar mt-5 h-[3px] w-12 origin-left bg-[#D80005]" />
          <p className="ct-fade mt-4 max-w-md text-[15px] leading-relaxed text-gray-600">
            Une question, un devis ou un véhicule à trouver ? Écrivez-nous et un conseiller reviendra vers vous.
          </p>

          {INFO.length > 0 && (
            <ul className="ct-fade mt-10 space-y-5">
              {INFO.map((item) => {
                const Icon = item.icon;
                const content = (
                  <>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-black text-white transition-colors duration-300 group-hover:bg-[#D80005]">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        {item.label}
                      </span>
                      <span className="block font-bold text-black">{item.value}</span>
                    </span>
                  </>
                );
                return (
                  <li key={item.label}>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="group flex items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]"
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="group flex items-center gap-4">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          <p className="ct-fade mt-10 max-w-md border-l-4 border-[#D80005] bg-white px-5 py-4 text-sm leading-relaxed text-gray-600">
            <span className="font-bold text-black">Pour un devis,</span> précisez le véhicule souhaité et votre pays de
            destination : nous pourrons vous répondre plus vite.
          </p>
        </div>

        {/* Right: form */}
        <div className="ct-card lg:col-span-7">
          <div className="border border-gray-200 bg-white p-6 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)] sm:p-10">
            {status === "sent" ? (
              <div role="status" className="flex flex-col items-center py-10 text-center">
                <span className="ct-check flex h-16 w-16 items-center justify-center bg-[#D80005] text-white">
                  <Check size={32} aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-2xl font-black uppercase tracking-tight text-black">Message envoyé</h3>
                <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-gray-600">
                  Merci {values.name.trim().split(" ")[0]}. Nous avons bien reçu votre demande et nous revenons vers vous
                  rapidement.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-8 border-2 border-black px-8 py-3.5 text-[13px] font-bold uppercase tracking-wider text-black transition-colors duration-300 hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                {/* Subject */}
                <fieldset>
                  <legend className={label}>Votre demande</legend>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECTS.map((s) => {
                      const selected = subject === s;
                      return (
                        <label
                          key={s}
                          className={`cursor-pointer border px-4 py-2.5 text-[13px] font-bold transition-colors duration-200 focus-within:ring-2 focus-within:ring-[#D80005] ${
                            selected
                              ? "border-black bg-black text-white"
                              : "border-gray-300 bg-white text-black hover:border-black"
                          }`}
                        >
                          <input
                            type="radio"
                            name="subject"
                            value={s}
                            checked={selected}
                            onChange={() => setSubject(s)}
                            className="sr-only"
                          />
                          {s}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="ct-name" className={label}>Nom complet</label>
                    <input
                      id="ct-name"
                      autoComplete="name"
                      value={values.name}
                      onChange={set("name")}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "ct-name-error" : undefined}
                      className={`${input} ${errors.name ? "border-[#D80005]" : "border-gray-300"}`}
                    />
                    {errors.name && <p id="ct-name-error" className="mt-2 text-xs text-[#D80005]">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="ct-phone" className={label}>
                      Téléphone <span className="font-normal text-gray-400">(facultatif)</span>
                    </label>
                    <input
                      id="ct-phone"
                      type="tel"
                      autoComplete="tel"
                      value={values.phone}
                      onChange={set("phone")}
                      className={`${input} border-gray-300`}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="ct-email" className={label}>Adresse e-mail</label>
                  <input
                    id="ct-email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={set("email")}
                    placeholder="vous@exemple.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "ct-email-error" : undefined}
                    className={`${input} ${errors.email ? "border-[#D80005]" : "border-gray-300"}`}
                  />
                  {errors.email && <p id="ct-email-error" className="mt-2 text-xs text-[#D80005]">{errors.email}</p>}
                </div>

                <div className="mt-6">
                  <label htmlFor="ct-message" className={label}>Votre message</label>
                  <textarea
                    id="ct-message"
                    rows={5}
                    maxLength={2000}
                    value={values.message}
                    onChange={set("message")}
                    placeholder="Quel véhicule recherchez-vous ? Vers quel pays ?"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "ct-message-error" : undefined}
                    className={`${input} resize-y ${errors.message ? "border-[#D80005]" : "border-gray-300"}`}
                  />
                  {errors.message && <p id="ct-message-error" className="mt-2 text-xs text-[#D80005]">{errors.message}</p>}
                </div>

                {/* Hidden field for robots */}
                <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                  <label htmlFor="ct-website">Ne pas remplir</label>
                  <input
                    id="ct-website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.website}
                    onChange={set("website")}
                  />
                </div>

                {formError && (
                  <div role="alert" className="mt-6 flex gap-3 border border-[#D80005] bg-red-50 p-4 text-sm text-[#D80005]">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    style={{ clipPath: SLANT }}
                    className="inline-flex items-center justify-center gap-3 bg-[#D80005] px-12 py-4 text-[14px] font-bold text-white transition-colors duration-300 hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                        Envoi en cours
                      </>
                    ) : (
                      <>
                        Envoyer le message
                        <ArrowRight size={16} aria-hidden="true" />
                      </>
                    )}
                  </button>
                  <p className="text-xs leading-snug text-gray-500 sm:max-w-[220px]">
                    Vos informations servent uniquement à répondre à votre demande.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}