import type { Vehicle } from "@prisma/client";
import { VehicleStatusBadge, formatFcfa } from "./ui";

export default function VehicleTable({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <div className="overflow-x-auto border border-gray-200 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold text-gray-600">
          <tr>
            <th className="px-5 py-3">Véhicule</th>
            <th className="px-5 py-3">Prix</th>
            <th className="px-5 py-3">Statut</th>
            <th className="px-5 py-3">Ajouté le</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {vehicles.map((v) => (
            <tr key={v.id} className="hover:bg-gray-50">
              <td className="px-5 py-4">
                <p className="font-bold text-black">{v.title}</p>
                <p className="text-xs text-gray-500">
                  {v.brand} {v.model} · {v.year}
                  {v.mileage != null && ` · ${new Intl.NumberFormat("fr-FR").format(v.mileage)} km`}
                </p>
              </td>
              <td className="px-5 py-4 font-semibold text-black">{formatFcfa(v.price)}</td>
              <td className="px-5 py-4">
                <VehicleStatusBadge status={v.status} />
              </td>
              <td className="px-5 py-4 text-gray-600">
                {new Date(v.createdAt).toLocaleDateString("fr-FR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}