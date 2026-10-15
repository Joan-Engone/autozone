import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "dark" | "outline" | "light" | "outlineLight";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-[#D80005] text-white hover:bg-black",
  dark: "bg-black text-white hover:bg-[#D80005]",
  outline: "border border-black text-black hover:bg-black hover:text-white",
  light: "bg-white text-black hover:bg-black hover:text-white",
  outlineLight: "border border-white text-white hover:bg-black hover:border-black",
};

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: Variant;
};

export default function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={`inline-block text-center font-bold text-[13px] uppercase px-8 py-4 transition-all duration-300 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2 ${VARIANTS[variant]} ${className}`}
    />
  );
}