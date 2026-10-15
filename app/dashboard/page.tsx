import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PackageSearch } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ButtonLink from "@/components/ui/ButtonLink";
import OrderCard from "@/components/dashboard/OrderCard";
import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Mes commandes | Auto Zone Import & Export",
  robots: { index: false, follow: false },
};

// Buyers follow their orders here. Sellers and admins go to their own space.
export default async function DashboardPage() {
  const session = await requireSession();
  // Roles are stored in capitals (BUYER, SELLER, ADMIN): compare without caring about case
  const role = String(session.user.role ?? "BUYER").toUpperCase();
  if (role === "SELLER" || role === "ADMIN") redirect("/seller");

  const orders = await prisma.order.findMany({
    where: { buyerId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      price: true,
      status: true,
      createdAt: true,
      vehicle: { select: { title: true, year: true, imageUrl: true } },
      logs: { orderBy: { createdAt: "desc" }, take: 1, select: { message: true, createdAt: true } },
    },
  });

  const firstName = session.user.name.trim().split(" ")[0];

  return (
    <>
      <Navbar />
      <main className="bg-gray-50 px-6 py-14">
        <div className="mx-auto w-full max-w-4xl">
          <p className="text-sm font-bold text-[#D80005]">Bonjour {firstName}</p>
          <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-black">Mes commandes</h1>
          <p className="mt-2 text-sm text-gray-600">
            Suivez ici l&apos;avancement de vos achats, de la vérification du véhicule à sa livraison.
          </p>

          {orders.length > 0 ? (
            <ul className="mt-8 space-y-5">
              {orders.map((o) => (
                <OrderCard key={o.id} order={{ ...o, lastLog: o.logs[0] ?? null }} />
              ))}
            </ul>
          ) : (
            <div className="mt-8 flex flex-col items-center border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <PackageSearch size={40} className="text-gray-400" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-black text-black">Vous n&apos;avez pas encore de commande</h2>
              <p className="mt-2 max-w-sm text-sm text-gray-600">
                Parcourez le catalogue et demandez un devis. Votre commande apparaîtra ici dès qu&apos;elle sera enregistrée.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={ROUTES.catalogue}>Voir le catalogue</ButtonLink>
                <ButtonLink href={ROUTES.contact} variant="outline">
                  Demander un devis
                </ButtonLink>
              </div>
            </div>
          )}

          <p className="mt-10 text-sm text-gray-500">
            Une question sur une commande ?{" "}
            <Link href={ROUTES.contact} className="font-bold text-black underline underline-offset-4 hover:text-[#D80005]">
              Contactez-nous
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}