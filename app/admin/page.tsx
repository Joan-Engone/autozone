import Link from "next/link";
import { ArrowRight, Banknote, Car, ClipboardList, Hourglass, Inbox, Users, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getAdminStats, NEXT_STEP, shortRef } from "@/lib/orders";
import { formatPrice } from "@/lib/formatters";
import { OrderStatusBadge } from "@/components/seller/ui";

function Todo({ icon: Icon, label, count, href }: { icon: LucideIcon; label: string; count: number; href: string }) {
  const urgent = count > 0;
  return (
    <Link
      href={href}
      className={`group flex items-center gap-4 border p-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] ${
        urgent ? "border-[#D80005] bg-white" : "border-gray-200 bg-white hover:border-black"
      }`}
    >
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center ${urgent ? "bg-[#D80005] text-white" : "bg-gray-100 text-gray-500"}`}>
        <Icon size={20} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-2xl font-black text-black">{count}</span>
        <span className="block text-sm text-gray-600">{label}</span>
      </span>
      <ArrowRight size={16} aria-hidden="true" className="text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-black" />
    </Link>
  );
}

function Money({ icon: Icon, label, value, hint }: { icon: LucideIcon; label: string; value: number; hint: string }) {
  return (
    <div className="border border-gray-200 border-t-4 border-t-[#D80005] bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-600">{label}</p>
        <Icon size={18} className="text-gray-400" aria-hidden="true" />
      </div>
      <p className="mt-3 text-2xl font-black tracking-tight text-black">{formatPrice(value)}</p>
      <p className="mt-1 text-xs text-gray-400">{hint}</p>
    </div>
  );
}

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black">Administration</h1>
          <p className="mt-1 text-sm text-gray-600">Tout ce qui demande votre attention, et l&apos;état de votre argent.</p>
        </div>
        <Link
          href="/admin/orders/new"
          className="inline-flex items-center bg-[#D80005] px-6 py-3.5 text-[13px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2"
        >
          Nouvelle commande
        </Link>
      </div>

      <section aria-label="À faire">
        <h2 className="mb-4 text-lg font-black uppercase tracking-tight text-black">À faire</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Todo icon={ClipboardList} label="Nouvelles commandes à traiter" count={stats.counts.toProcess} href="/admin/orders?filter=new" />
          <Todo icon={Users} label="Vendeurs à approuver" count={stats.counts.pendingSellers} href="/admin/sellers" />
          <Todo icon={Car} label="Véhicules à valider" count={stats.counts.pendingVehicles} href="/admin/vehicles" />
          <Todo icon={Inbox} label="Messages (7 derniers jours)" count={stats.counts.messages} href="/admin/messages" />
        </div>
      </section>

      <section aria-label="Votre argent">
        <h2 className="mb-4 text-lg font-black uppercase tracking-tight text-black">Votre argent</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Money icon={Banknote} label="Marge gagnée" value={stats.marginEarned} hint="Commandes livrées" />
          <Money icon={Hourglass} label="Marge à venir" value={stats.marginInProgress} hint="Commandes en cours" />
          <Money icon={Wallet} label="À encaisser des clients" value={stats.toCollect} hint="Avant paiement" />
          <Money icon={Wallet} label="À payer aux vendeurs" value={stats.toPaySellers} hint="Commandes livrées" />
        </div>
      </section>

      <section aria-label="Commandes en cours" className="border border-gray-200 bg-white">
        <div className="flex items-center justify-between px-6 pt-6">
          <h2 className="text-lg font-black uppercase tracking-tight text-black">Commandes en cours</h2>
          <Link href="/admin/orders" className="text-xs font-bold text-[#D80005] underline underline-offset-4 hover:text-black">Tout voir</Link>
        </div>
        {stats.queue.length === 0 ? (
          <p className="px-6 pb-8 pt-4 text-sm text-gray-500">Aucune commande en cours. Les commandes de vos clients apparaîtront ici.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="border-y border-gray-200 bg-gray-50 text-xs font-bold text-gray-600">
                <tr>
                  <th className="px-6 py-3">Commande</th>
                  <th className="px-3 py-3">Client</th>
                  <th className="px-3 py-3">Total</th>
                  <th className="px-3 py-3">Statut</th>
                  <th className="px-6 py-3">À faire</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.queue.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="font-black text-black hover:text-[#D80005]">{shortRef(o.id)}</Link>
                      <p className="text-xs text-gray-500">{o.vehicle.title} {o.vehicle.year}</p>
                    </td>
                    <td className="px-3 py-3 text-gray-700">{o.buyer.name}</td>
                    <td className="px-3 py-3 font-black">{formatPrice(o.price)}</td>
                    <td className="px-3 py-3"><OrderStatusBadge status={o.status} /></td>
                    <td className="px-6 py-3 text-xs font-bold text-[#D80005]">{NEXT_STEP[o.status]?.label ?? "–"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}