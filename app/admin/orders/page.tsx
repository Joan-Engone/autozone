
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import NewOrderForm from "@/components/admin/NewOrderForm";

export const metadata = {
  title: "Créer une commande | AutoZone",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  // Only administrators can access this page.
  await requireRole(["ADMIN", "admin"]);

  // Fetch available vehicles and buyer accounts in parallel.
  const [vehicleRecords, customerRecords] = await Promise.all([
    prisma.vehicle.findMany({
      where: {
        status: "AVAILABLE",
      },
      select: {
        id: true,
        title: true,
        brand: true,
        model: true,
        year: true,
        price: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.user.findMany({
      where: {
        role: "BUYER",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  // Convert Prisma records into the props expected by NewOrderForm.
  const vehicles = vehicleRecords.map((vehicle) => ({
    id: vehicle.id,
    label: `${vehicle.title} — ${vehicle.brand} ${vehicle.model} (${vehicle.year})`,
    total: vehicle.price,
  }));

  const customers = customerRecords.map((customer) => ({
    id: customer.id,
    label: customer.name
      ? `${customer.name} (${customer.email})`
      : customer.email,
  }));

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="border-b border-gray-200 pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D80005]">
            AutoZone Administration
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-black sm:text-4xl">
            Créer une commande
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
            Créez une commande pour un client, sélectionnez un véhicule
            disponible et ajoutez les frais d&apos;expédition et de douane.
          </p>
        </div>

        <NewOrderForm
          vehicles={vehicles}
          customers={customers}
        />
      </div>
    </main>
  );
}
