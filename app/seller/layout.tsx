import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Clock, ShieldAlert } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/session";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Espace vendeur | Auto Zone",
  robots: { index: false, follow: false },
};

// The seller area has its own look: no public navbar, footer or chat.
// A seller must be approved by the owner before using it.
export default async function SellerLayout({ children }: { children: ReactNode }) {
  const session = await requireRole(["seller", "admin"]);

  let status: "PENDING" | "APPROVED" | "SUSPENDED" = "APPROVED";
  if (session.user.role === "seller") {
    const profile = await prisma.sellerProfile.upsert({
      where: { userId: session.user.id },
      update: {},
      create: { userId: session.user.id },
    });
    status = profile.status;
  }

  return (
    <DashboardShell area="seller" user={{ name: session.user.name, email: session.user.email }}>
      {status === "APPROVED" ? (
        children
      ) : (
        <div className="mx-auto mt-10 max-w-xl border border-gray-200 bg-white p-10 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center bg-black text-white">
            {status === "PENDING" ? <Clock size={28} aria-hidden="true" /> : <ShieldAlert size={28} aria-hidden="true" />}
          </span>
          <h1 className="mt-6 text-2xl font-black uppercase tracking-tight text-black">
            {status === "PENDING" ? "Votre compte est en attente de validation" : "Votre compte est suspendu"}
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
            {status === "PENDING"
              ? "Auto Zone travaille avec des vendeurs de confiance. Votre demande a bien été reçue : vous pourrez publier vos véhicules dès qu'elle sera validée."
              : "Contactez Auto Zone pour en savoir plus."}
          </p>
        </div>
      )}
    </DashboardShell>
  );
}