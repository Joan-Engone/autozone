import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ButtonLink from "@/components/ui/ButtonLink";

interface CtaAction {
  label: string;
  href: string;
}

interface CtaBannerProps {
  title: string;
  description?: string;
  /** The one button of the section */
  primary: CtaAction;
  /** Optional second choice, shown as a text link so it never competes with the button */
  secondary?: CtaAction;
}

export default function CtaBanner({ title, description, primary, secondary }: CtaBannerProps) {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden bg-[#D80005] text-white">
      <span aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rotate-45 bg-black/10" />
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-6 py-16 md:flex-row md:items-center md:justify-between md:py-20">
        <div className="max-w-xl">
          <h2 id="cta-title" className="text-3xl font-black leading-tight tracking-tight md:text-4xl">
            {title}
          </h2>
          {description && <p className="mt-4 text-[17px] leading-relaxed text-white">{description}</p>}
        </div>

        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <ButtonLink href={primary.href} variant="light">
            {primary.label}
          </ButtonLink>
          {secondary && (
            <Link
              href={secondary.href}
              className="group inline-flex min-h-11 items-center gap-2 text-sm font-bold underline decoration-white/50 underline-offset-4 transition-colors hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#D80005]"
            >
              {secondary.label}
              <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}