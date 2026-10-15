import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireRole } from "@/lib/auth/session";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Administration | Auto Zone",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireRole(["admin"]);
  return (
    <DashboardShell area="admin" user={{ name: session.user.name, email: session.user.email }}>
      {children}
    </DashboardShell>
  );
}