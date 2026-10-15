import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/session";

export const metadata = {
  title: "Véhicules | Administration AutoZone",
  robots: { index: false, follow: false },
};

export default async function AdminVehiclesPage() {
  await requireRole(["admin"]);

  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      seller: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des véhicules
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Consultez les véhicules et leurs statuts.
        </p>
      </header>

      {vehicles.length === 0 ? (
        <div className="border border-gray-200 bg-white p-8 text-center">
          Aucun véhicule enregistré.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4">Véhicule</th>
                <th className="px-5 py-4">Vendeur</th>
                <th className="px-5 py-4">Annonce</th>
                <th className="px-5 py-4">Disponibilité</th>
                <th className="px-5 py-4">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td className="px-5 py-4 font-medium">
                    {vehicle.title}
                  </td>

                  <td className="px-5 py-4">
                    <div>{vehicle.seller.name}</div>
                    <div className="text-xs text-gray-500">
                      {vehicle.seller.email}
                    </div>
                  </td>

                  <td className="px-5 py-4">{vehicle.listing}</td>
                  <td className="px-5 py-4">{vehicle.status}</td>

                  <td className="px-5 py-4 text-gray-500">
                    {vehicle.createdAt.toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}