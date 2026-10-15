import type { Service } from "@/lib/data/services";

interface ServiceStepProps {
  service: Service;
  index: number;
  isLast: boolean;
}

/** One stage of the import, drawn on a vertical timeline. */
export default function ServiceStep({ service, index, isLast }: ServiceStepProps) {
  const { icon: Icon, title, text } = service;

  return (
    <li className="group relative pb-12 pl-[72px] last:pb-0 sm:pl-24">
      {!isLast && (
        <span aria-hidden="true" className="absolute bottom-0 left-6 top-14 w-px bg-gray-200 sm:left-8 sm:top-[72px]" />
      )}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center bg-black text-white transition-colors duration-300 group-hover:bg-[#D80005] sm:h-16 sm:w-16 motion-reduce:transition-none"
      >
        <Icon size={24} />
      </span>

      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#D80005]">
        Étape {String(index + 1).padStart(2, "0")}
      </p>
      <h3 className="mt-2 text-xl font-black tracking-tight text-black md:text-2xl">{title}</h3>
      <p className="mt-3 max-w-prose text-base leading-relaxed text-gray-600">{text}</p>
    </li>
  );
}