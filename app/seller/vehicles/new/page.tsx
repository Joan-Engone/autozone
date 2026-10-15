import { requireRole } from "@/lib/auth/session";
import VehicleForm from "./VehicleForm";

export default async function NewVehiclePage() {
  await requireRole(["seller", "admin"]);

  return (
    <div className="w-full min-w-0">
      <h2 className="text-2xl font-black tracking-tight text-black">
        Ajouter un véhicule
      </h2>

      <p className="mt-2 text-sm text-gray-600">
        Renseignez les informations de l&apos;annonce. Les prix sont en FCFA.
      </p>

      <div className="mt-8 w-full border border-gray-200 bg-white p-6 sm:p-8">
        <VehicleForm />
      </div>
    </div>
  );
}