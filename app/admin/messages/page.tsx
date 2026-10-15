import { Mail, Phone } from "lucide-react";
import { prisma } from "@/lib/db/prisma";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <div>
      <h1 className="text-3xl font-black uppercase tracking-tight text-black">Messages</h1>
      <p className="mt-1 text-sm text-gray-600">Les demandes envoyées depuis le formulaire de contact du site.</p>

      {messages.length === 0 ? (
        <div className="mt-8 border border-dashed border-gray-300 bg-white px-6 py-16 text-center text-sm text-gray-500">
          Aucun message pour le moment.
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {messages.map((m) => (
            <li key={m.id} className="border border-gray-200 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-black text-black">{m.name}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#D80005]">{m.subject}</p>
                </div>
                <p className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-700">{m.message}</p>
              <div className="mt-4 flex flex-wrap gap-5 text-sm">
                <a href={`mailto:${m.email}`} className="flex items-center gap-2 font-bold text-black hover:text-[#D80005]"><Mail size={15} aria-hidden="true" />{m.email}</a>
                {m.phone && <a href={`tel:${m.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 font-bold text-black hover:text-[#D80005]"><Phone size={15} aria-hidden="true" />{m.phone}</a>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}