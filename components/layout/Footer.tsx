"use client";
import { SiFacebook, SiInstagram } from "@icons-pack/react-simple-icons";

interface SocialLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    href: "#",
    label: "Instagram",
    icon: <SiInstagram size={18} color="currentColor" />,
  },
  {
    href: "#",
    label: "Facebook",
    icon: <SiFacebook size={18} color="currentColor" />,
  },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-16">
      <div className="max-w-[1280px] mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo */}
          <a
            href="#"
            className="flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]"
          >
            <span className="font-black text-2xl tracking-tighter text-[#D80005] italic leading-none uppercase">
              AUTO ZONE
            </span>
            <span className="text-[9px] font-bold tracking-widest text-black mt-1 uppercase">
              IMPORT &amp; EXPORT
            </span>
          </a>

          {/* Copyright */}
          <p className="text-center text-gray-400 text-xs font-medium uppercase tracking-widest">
            © {new Date().getFullYear()} AUTOZONE IMPORT &amp; EXPORT. Tous droits réservés.
          </p>

          {/* Social Links */}
          <div className="flex space-x-5">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="text-[#D80005] hover:text-black transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:outline-none rounded-sm p-1"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}