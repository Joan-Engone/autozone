import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export const inputClass =
  "w-full border border-gray-300 bg-white px-4 py-3.5 text-[15px] text-black placeholder:text-gray-400 transition-colors focus:border-[#D80005] focus:outline-none focus:ring-2 focus:ring-[#D80005]/20";

export const primaryButtonClass =
  "w-full bg-[#D80005] py-4 text-[15px] font-bold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60";

export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z" />
      <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 010-9.4l-7.9-6.1a24 24 0 000 21.6l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="grid min-h-[calc(100vh-6rem)] lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-black lg:flex lg:flex-col lg:justify-end lg:p-16">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-[520px] w-[320px] rotate-[20deg] bg-[#D80005]"
        />
        <div
          aria-hidden="true"
          className="absolute -right-4 -top-24 h-[520px] w-4 rotate-[20deg] bg-white/90"
        />
        <div className="relative max-w-md">
          <p className="text-sm font-semibold text-[#ff4d52]">AUTO ZONE Import &amp; Export</p>
          <h2 className="mt-4 text-5xl font-bold leading-[1.05] tracking-tight text-white">
            Votre prochain véhicule, livré en toute confiance.
          </h2>
          <p className="mt-6 text-white/60">
            Suivez vos commandes, gérez vos annonces et échangez avec notre équipe depuis un seul espace.
          </p>
        </div>
      </aside>

      {/* Form panel */}
      <section className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 inline-block lg:hidden" aria-label="Accueil">
            <Image
              src="/logo.png"
              alt="AUTO ZONE"
              width={180}
              height={48}
              style={{ width: "auto" }}
              className="h-10 object-contain"
            />
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-black">{title}</h1>
          <p className="mt-2 text-gray-600">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </main>
  );
}