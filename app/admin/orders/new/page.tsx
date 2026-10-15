import { prisma } from "@/lib/db/prisma";
import { publicPrice } from "@/lib/order-constants";
import { formatPrice } from "@/lib/formatters";
import NewOrderForm from "@/components/admin/NewOrderForm";

export default async function NewOrderPage() {
  const [vehicles, customers] = await Promise.all([
    prisma.vehicle.findMany({
      where: { listing: "APPROVED", status: "AVAILABLE" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: {
        OR: [{ role: "client" }, { role: null }],
      },
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true },
    }),
  ]);

  return (
    <main className="w-full min-w-0 space-y-6">
      <header className="w-full">
        <h1 className="text-3xl font-black uppercase tracking-tight text-black">
          Nouvelle commande
        </h1>

        <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-600">
          Pour une commande reçue par téléphone ou WhatsApp. Celles de
          l&apos;application arrivent toutes seules.
        </p>
      </header>

      <section className="w-full min-w-0">
        <NewOrderForm
          vehicles={vehicles.map((v) => {
            const total = publicPrice(v.price, v.margin);

            return {
              id: v.id,
              label: `${v.title} ${v.year} · ${formatPrice(total)}`,
              total,
            };
          })}
          customers={customers.map((c) => ({
            id: c.id,
            label: `${c.name} (${c.email})`,
          }))}
        />
      </section>
    </main>
  );
}