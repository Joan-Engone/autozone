import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <header className="border-b border-gray-100">
      <div className="mx-auto w-full max-w-[1280px] px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black">{title}</h1>
        {description && (
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600">{description}</p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </header>
  );
}