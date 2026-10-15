"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUp, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SiFacebook, SiInstagram } from "@icons-pack/react-simple-icons";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE } from "@/data/site";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface FooterLink {
  label: string;
  href: string;
}

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Acheter et vendre",
    links: [
      { label: "Catalogue", href: "/catalogue" },
      { label: "Comment ça marche", href: "/#comment-ca-marche" },
      { label: "Demander un devis", href: "/#contact" },
      { label: "Vendre un véhicule", href: "/register" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Import", href: "/services#import" },
      { label: "Export", href: "/services#export" },
      { label: "Expédition et dédouanement", href: "/services#dedouanement" },
      { label: "Inspection", href: "/services#inspection" },
      { label: "Financement", href: "/services#financement" },
    ],
  },
  {
    title: "Mon compte",
    links: [
      { label: "Connexion", href: "/login" },
      { label: "Créer un compte", href: "/register" },
      { label: "Mon espace", href: "/dashboard" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { label: "À propos", href: "/about" },
      { label: "Témoignages", href: "/#temoignages" },
      { label: "Contact", href: "/#contact" },
    ],
  },
];

interface ContactRow {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

const CONTACT_ROWS: ContactRow[] = [
  SITE.phone && { icon: Phone, label: "Téléphone", value: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, "")}` },
  SITE.whatsapp && {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Écrivez-nous sur WhatsApp",
    href: `https://wa.me/${SITE.whatsapp}`,
  },
  SITE.email && { icon: Mail, label: "E-mail", value: SITE.email, href: `mailto:${SITE.email}` },
  SITE.address && { icon: MapPin, label: "Adresse", value: SITE.address },
  SITE.hours && { icon: Clock, label: "Horaires", value: SITE.hours },
].filter(Boolean) as ContactRow[];

const SOCIALS = [
  { label: "Instagram", href: SITE.socials.instagram, icon: <SiInstagram size={18} color="currentColor" /> },
  { label: "Facebook", href: SITE.socials.facebook, icon: <SiFacebook size={18} color="currentColor" /> },
].filter((s) => s.href);

const LEGAL_LINKS = [
  { label: "Mentions légales", href: SITE.legal.mentions },
  { label: "Conditions générales de vente", href: SITE.legal.terms },
  { label: "Confidentialité", href: SITE.legal.privacy },
].filter((l) => l.href);

const linkClass =
  "text-sm text-white/60 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2 focus-visible:ring-offset-black";

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(".ft-col", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 92%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const backToTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <footer ref={rootRef} className="relative bg-black text-white">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-[#D80005]" />

      <div className="mx-auto max-w-[1280px] px-6 pb-8 pt-16 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand and contact */}
          <div className="ft-col lg:col-span-4">
            <Link
                href="/"
                aria-label={`${SITE.name}, accueil`}
                className="inline-flex shrink-0 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <Image
                  src="/logos.jpeg"
                  alt={SITE.name}
                  width={180}
                  height={60}
                  priority
                  className="h-12 w-auto object-contain"
                />
              </Link>

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">{SITE.description}</p>

            {CONTACT_ROWS.length > 0 && (
              <ul className="mt-8 space-y-4">
                {CONTACT_ROWS.map((row) => {
                  const Icon = row.icon;
                  const content = (
                    <>
                      <Icon size={18} className="mt-0.5 shrink-0 text-[#D80005]" aria-hidden="true" />
                      <span>
                        <span className="sr-only">{row.label} : </span>
                        {row.value}
                      </span>
                    </>
                  );
                  return (
                    <li key={row.label}>
                      {row.href ? (
                        <a
                          href={row.href}
                          target={row.href.startsWith("http") ? "_blank" : undefined}
                          rel={row.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className={`flex items-start gap-3 ${linkClass}`}
                        >
                          {content}
                        </a>
                      ) : (
                        <div className="flex items-start gap-3 text-sm text-white/60">{content}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            {SOCIALS.length > 0 && (
              <ul className="mt-8 flex gap-3">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex h-10 w-10 items-center justify-center border border-white/20 text-white transition-colors duration-200 hover:border-[#D80005] hover:bg-[#D80005] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      {s.icon}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Links */}
          <nav aria-label="Pied de page" className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
            {COLUMNS.map((column) => (
              <div key={column.title} className="ft-col">
                <h2 className="text-[12px] font-black uppercase tracking-[0.15em] text-white">{column.title}</h2>
                <span aria-hidden="true" className="mt-3 block h-[2px] w-6 bg-[#D80005]" />
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Payment methods (only shown if you list some in data/site.ts) */}
        {SITE.payments.length > 0 && (
          <div className="ft-col mt-12 flex flex-wrap items-center gap-3 border-t border-white/10 pt-8">
            <p className="text-[12px] font-black uppercase tracking-[0.15em]">Moyens de paiement</p>
            {SITE.payments.map((p) => (
              <span key={p} className="border border-white/20 px-3 py-1.5 text-xs font-bold text-white/80">
                {p}
              </span>
            ))}
          </div>
        )}

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1 text-xs text-white/50">
            <p>
              © {new Date().getFullYear()} {SITE.legalName}. Tous droits réservés.
            </p>
            {SITE.registration && <p>{SITE.registration}</p>}
          </div>

          {LEGAL_LINKS.length > 0 && (
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {LEGAL_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-xs text-white/50 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={backToTop}
            className="group inline-flex w-fit items-center gap-3 text-[12px] font-bold uppercase tracking-wider text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]"
          >
            Retour en haut
            <span className="flex h-10 w-10 items-center justify-center border border-white/20 transition-colors group-hover:border-[#D80005] group-hover:bg-[#D80005]">
              <ArrowUp size={16} aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}