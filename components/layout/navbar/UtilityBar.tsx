import { MessageCircle, Phone } from "lucide-react";
import { CONTACT } from "@/components/layout/navbar/config";

/** Thin black strip above the main bar (desktop only). Collapses when the page is scrolled. */
export default function UtilityBar({ hidden }: { hidden: boolean }) {
  return (
    <div
      className={`hidden lg:block overflow-hidden bg-black text-white transition-all duration-300 motion-reduce:transition-none ${
        hidden ? "max-h-0" : "max-h-10"
      }`}
    >
      <div className="mx-auto flex h-10 max-w-[1280px] items-center justify-between px-6 text-[12.5px]">
        <p className="flex items-center gap-2.5 text-white/70">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#D80005]" />
          {CONTACT.tagline}
        </p>
        <div className="flex items-center gap-6">
          <a
            href={CONTACT.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/80 transition-colors hover:text-white"
          >
            <MessageCircle size={14} className="text-[#D80005]" aria-hidden="true" />
            WhatsApp
          </a>
          <a
            href={CONTACT.phoneHref}
            className="flex items-center gap-2 font-medium text-white transition-colors hover:text-[#ff4d52]"
          >
            <Phone size={14} className="text-[#D80005]" aria-hidden="true" />
            {CONTACT.phoneLabel}
          </a>
        </div>
      </div>
    </div>
  );
}