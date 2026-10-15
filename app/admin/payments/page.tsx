import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { shortRef } from "@/lib/order-constants";
import { formatPrice } from "@/lib/formatters";
import { PaySellerButton } from "@/components/admin/controls";

export default async function AdminPaymentsPage() {
  const delivered = await prisma.order.findMany({
    where: { status: "DELIVERED" },
    include: { vehicle: { select: { title: true, year: true, seller: { select: { id: true, name: true, email: true } } } } },
    orderBy: { updatedAt: "desc" },
  });

  const owed = delivered.filter((o) => !o.sellerPaidAt);
  const paid = delivered.filter((o) => o.sellerPaidAt).slice(0, 15);

  // Group what you owe by seller
  const bySeller = new Map<string, { name: string; email: string; orders: typeof owed }>();
  for (const order of owed) {
    const seller = order.vehicle.seller;
    const entry = bySeller.get(seller.id) ?? { name: seller.name, email: seller.email, orders: [] };
    entry.orders.push(order);
    bySeller.set(seller.id, entry);
  }

  const totalOwed = owed.reduce((sum, o) => sum + o.sellerPrice, 0);
  const marginEarned = delivered.reduce((sum, o) => sum + o.margin, 0);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-black">Paiements</h1>
        <p className="mt-1 text-sm text-gray-600">Ce que vous devez aux vendeurs, et ce que vous avez gagné.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border border-gray-200 border-t-4 border-t-[#D80005] bg-white p-5">
          <p className="text-sm font-semibold text-gray-600">À payer aux vendeurs</p>
          <p className="mt-3 text-3xl font-black text-black">{formatPrice(totalOwed)}</p>
        </div>
        <div className="border border-gray-200 border-t-4 border-t-black bg-white p-5">
          <p className="text-sm font-semibold text-gray-600">Votre marge sur les commandes livrées</p>
          <p className="mt-3 text-3xl font-black text-black">{formatPrice(marginEarned)}</p>
        </div>
      </div>

      <section aria-label="À payer">
        <h2 className="mb-4 text-lg font-black uppercase tracking-tight text-black">À payer</h2>
        {bySeller.size === 0 ? (
          <p className="border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-sm text-gray-500">
            Rien à payer. Les vendeurs apparaissent ici dès qu&apos;une commande est livrée.
          </p>
        ) : (
          <div className="space-y-6">
            {Array.from(bySeller.entries()).map(([sellerId, seller]) => (
              <div key={sellerId} className="border border-gray-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-gray-50 px-5 py-4">
                  <div>
                    <p className="font-black text-black">{seller.name}</p>
                    <p className="text-xs text-gray-500">{seller.email}</p>
                  </div>
                  <p className="text-xl font-black text-[#D80005]">{formatPrice(seller.orders.reduce((s, o) => s + o.sellerPrice, 0))}</p>
                </div>
                <ul className="divide-y divide-gray-100">
                  {seller.orders.map((o) => (
                    <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                      <div>
                        <Link href={`/admin/orders/${o.id}`} className="font-black text-black hover:text-[#D80005]">{shortRef(o.id)}</Link>
                        <p className="text-xs text-gray-500">{o.vehicle.title} {o.vehicle.year}</p>
                      </div>
                      <p className="font-black">{formatPrice(o.sellerPrice)}</p>
                      <PaySellerButton orderId={o.id} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      {paid.length > 0 && (
        <section aria-label="Déjà payé">
          <h2 className="mb-4 text-lg font-black uppercase tracking-tight text-black">Déjà payé</h2>
          <ul className="divide-y divide-gray-100 border border-gray-200 bg-white">
            {paid.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm">
                <span>
                  <Link href={`/admin/orders/${o.id}`} className="font-black hover:text-[#D80005]">{shortRef(o.id)}</Link>
                  <span className="ml-3 text-gray-500">{o.vehicle.seller.name} · {o.vehicle.title}</span>
                </span>
                <span className="font-bold">{formatPrice(o.sellerPrice)} <span className="font-normal text-gray-400">· {new Date(o.sellerPaidAt!).toLocaleDateString("fr-FR")}</span></span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}