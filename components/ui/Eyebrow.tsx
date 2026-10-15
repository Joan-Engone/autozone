interface EyebrowProps {
  children: string;
  /** "dark" = used on a black background (brighter red, readable contrast) */
  tone?: "light" | "dark";
}

/** Small uppercase label above a heading. */
export default function Eyebrow({ children, tone = "light" }: EyebrowProps) {
  return (
    <p
      className={`flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] ${
        tone === "dark" ? "text-[#ff4d52]" : "text-[#D80005]"
      }`}
    >
      <span aria-hidden="true" className="h-0.5 w-8 bg-current" />
      {children}
    </p>
  );
}