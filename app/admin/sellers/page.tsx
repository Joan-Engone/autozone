
import { prisma } from "@/lib/db/prisma";
import { SellerStatusBadge } from "@/components/seller/ui";
import { SellerActions } from "@/components/admin/controls";

export const runtime = "nodejs";

const STATUS_RANK = {
  PENDING: 0,
  APPROVED: 1,
  SUSPENDED: 2,
} as const;

type SellerStatus = keyof typeof STATUS_RANK;

export default async function AdminSellersPage() {
  const sellers = await prisma.user.findMany({
    where: {
      role: "seller",
    },
    include: {
      sellerProfile: true,
      _count: {
        select: {
          vehicles: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const rows = sellers
    .map((seller) => ({
      ...seller,
      status: (seller.sellerProfile?.status ??
        "PENDING") as SellerStatus,
    }))
    .sort((a, b) => {
      const statusDifference =
        STATUS_RANK[a.status] - STATUS_RANK[b.status];

      // Keep newest sellers first when statuses are equal.
      if (statusDifference !== 0) {
        return statusDifference;
      }

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black">
            Vendeurs
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Seuls les vendeurs que vous approuvez peuvent publier
            des véhicules.
          </p>
        </div>

        <p className="text-sm font-medium text-gray-500">
          {rows.length} vendeur{rows.length !== 1 ? "s" : ""}
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="mt-8 border border-dashed border-gray-300 bg-white px-6 py-16 text-center text-sm text-gray-500">
          Aucun vendeur pour le moment. Une personne qui
          s&apos;inscrit comme vendeur apparaît ici, en attente
          de votre approbation.
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto border border-gray-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold text-gray-600">
              <tr>
                <th scope="col" className="px-5 py-3">
                  Vendeur
                </th>

                <th scope="col" className="px-3 py-3">
                  Véhicules
                </th>

                <th scope="col" className="px-3 py-3">
                  Statut
                </th>

                <th scope="col" className="px-5 py-3">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {rows.map((seller) => (
                <tr
                  key={seller.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <p className="font-black text-black">
                      {seller.name || "Nom non renseigné"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {seller.email}
                      {seller.phone
                        ? ` · ${seller.phone}`
                        : ""}
                    </p>
                  </td>

                  <td className="px-3 py-4 font-bold text-black">
                    {seller._count.vehicles}
                  </td>

                  <td className="px-3 py-4">
                    <SellerStatusBadge status={seller.status} />
                  </td>

                  <td className="px-5 py-4">
                    <SellerActions
                      userId={seller.id}
                      status={seller.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
