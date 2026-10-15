import { prisma } from "@/lib/db/prisma";
import { SellerStatusBadge } from "@/components/seller/ui";
import { SellerActions } from "@/components/admin/controls";

export default async function AdminSellersPage() {
  const sellers = await prisma.user.findMany({
    where: { role: "seller" },
    include: { sellerProfile: true, _count: { select: { vehicles: true } } },
    orderBy: { createdAt: "desc" },
  });

  // Pending ones first
  const rank = { PENDING: 0, APPROVED: 1, SUSPENDED: 2 } as const;
  const rows = sellers
    .map((s) => ({ ...s, status: s.sellerProfile?.status ?? ("PENDING" as const) }))
    .sort((a, b) => rank[a.status] - rank[b.status]);

  return (
    <div>
      <h1 className="text-3xl font-black uppercase tracking-tight text-black">Vendeurs</h1>
      <p className="mt-1 text-sm text-gray-600">Seuls les vendeurs que vous approuvez peuvent publier des véhicules.</p>

      {rows.length === 0 ? (
        <div className="mt-8 border border-dashed border-gray-300 bg-white px-6 py-16 text-center text-sm text-gray-500">
          Aucun vendeur pour le moment. Une personne qui s&apos;inscrit comme vendeur apparaît ici, en attente de votre approbation.
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto border border-gray-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold text-gray-600">
              <tr>
                <th className="px-5 py-3">Vendeur</th>
                <th className="px-3 py-3">Véhicules</th>
                <th className="px-3 py-3">Statut</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((s) => (
                <tr key={s.id}>
                  <td className="px-5 py-4">
                    <p className="font-black text-black">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.email}{s.phone ? ` · ${s.phone}` : ""}</p>
                  </td>
                  <td className="px-3 py-4 font-bold">{s._count.vehicles}</td>
                  <td className="px-3 py-4"><SellerStatusBadge status={s.status} /></td>
                  <td className="px-5 py-4"><SellerActions userId={s.id} status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}