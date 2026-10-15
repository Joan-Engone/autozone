import Image from "next/image";
import Link from "next/link";
import { Car, CheckCircle2, PlusCircle } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/session";
import { getVehicleTotals } from "@/lib/seller-stats";
import { formatKm, formatPrice } from "@/lib/formatters";
import VehicleRowActions from "@/components/seller/VehicleRowActions";

type Props = {
  searchParams: Promise<{ added?: string }>;
};

export default async function SellerVehiclesPage({ searchParams }: Props) {
  const session = await requireRole(["seller", "admin"]);
  const { added } = await searchParams;

  const [vehicles, totals] = await Promise.all([
    prisma.vehicle.findMany({
      where: { sellerId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    getVehicleTotals(session.user.id),
  ]);

  return (
    <div className="w-full min-w-0">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black">
            Mes véhicules
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {vehicles.length} véhicule{vehicles.length > 1 ? "s" : ""}. Changez
            le statut d&apos;un véhicule en un clic.
          </p>
        </div>

        <Link
          href="/seller/vehicles/new"
          className="inline-flex items-center gap-2 bg-[#D80005] px-6 py-3.5 text-[13px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2"
        >
          <PlusCircle size={16} aria-hidden="true" />
          Ajouter un véhicule
        </Link>
      </div>

      {added && (
        <div
          role="status"
          className="mb-6 flex items-center gap-3 border border-green-600 bg-green-50 px-5 py-4 text-sm font-bold text-green-800"
        >
          <CheckCircle2 size={18} aria-hidden="true" />
          Votre véhicule a été ajouté.
        </div>
      )}

      {vehicles.length === 0 ? (
        <div className="border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center bg-gray-100 text-gray-400">
            <Car size={26} aria-hidden="true" />
          </span>

          <p className="mt-5 text-lg font-black uppercase text-black">
            Aucun véhicule
          </p>

          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-600">
            Ajoutez votre premier véhicule pour commencer à recevoir des
            demandes.
          </p>

          <Link
            href="/seller/vehicles/new"
            className="mt-6 inline-block bg-[#D80005] px-8 py-3.5 text-[13px] font-bold uppercase tracking-wider text-white hover:bg-black"
          >
            Ajouter un véhicule
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 bg-white">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold text-gray-600">
              <tr>
                <th className="px-5 py-3">Véhicule</th>
                <th className="px-3 py-3">Prix</th>
                <th className="px-3 py-3">Vues</th>
                <th className="px-3 py-3">Devis</th>
                <th className="px-5 py-3">Statut</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {vehicles.map((vehicle) => {
                // The Prisma schema stores the main photo in imageUrl.
                const cover = vehicle.imageUrl;
                const stats = totals.get(vehicle.id) ?? {
                  views: 0,
                  quotes: 0,
                };

                return (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <span className="relative flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden bg-gray-100 text-gray-300">
                          {cover ? (
                            <Image
                              src={cover}
                              alt={`Photo de ${vehicle.title}`}
                              fill
                              unoptimized
                              sizes="80px"
                              className="object-cover"
                            />
                          ) : (
                            <Car
                              size={22}
                              aria-label="Aucune photo disponible"
                            />
                          )}
                        </span>

                        <div>
                          <p className="font-black text-black">
                            {vehicle.title}{" "}
                            <span className="font-normal text-gray-500">
                              {vehicle.year}
                            </span>
                          </p>

                          <p className="text-xs text-gray-500">
                            {vehicle.mileage != null
                              ? formatKm(vehicle.mileage)
                              : "–"}{" "}
                            · {vehicle.fuel ?? "–"} ·{" "}
                            {vehicle.transmission ?? "–"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-4 font-black text-black">
                      {formatPrice(vehicle.price)}
                    </td>

                    <td className="px-3 py-4 font-bold">
                      {stats.views}
                    </td>

                    <td className="px-3 py-4 font-bold text-[#D80005]">
                      {stats.quotes}
                    </td>

                    <td className="px-5 py-4">
                      <VehicleRowActions
                        id={vehicle.id}
                        status={vehicle.status}
                        title={vehicle.title}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}