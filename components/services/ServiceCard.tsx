import type { Service } from "@/lib/data/services";

export default function ServiceCard({ service }: { service: Service }) {
  const { icon: Icon, title, text } = service;
  return (
    <li className="border border-gray-200 bg-white p-8">
      <Icon size={28} className="text-[#D80005]" />
      <h2 className="mt-5 text-lg font-black tracking-tight text-black">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">{text}</p>
    </li>
  );
}