import Link from "next/link";

export function formatFcfa(amount: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(amount)} FCFA`;
}

const VEHICLE_STATUS: Record<string, { label: string; cls: string }> = {
  AVAILABLE: { label: "En ligne", cls: "bg-black text-white" },
  RESERVED: { label: "Réservé", cls: "bg-amber-100 text-amber-900" },
  SOLD: { label: "Vendu", cls: "bg-[#D80005] text-white" },
};

const ORDER_STATUS: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "Reçue", cls: "bg-amber-100 text-amber-900" },
  VERIFIED: { label: "Vérifiée", cls: "bg-sky-100 text-sky-900" },
  CONFIRMED: { label: "Confirmée", cls: "bg-blue-100 text-blue-900" },
  PAID: { label: "Payée", cls: "bg-emerald-100 text-emerald-900" },
  SHIPPED: { label: "Expédiée", cls: "bg-indigo-100 text-indigo-900" },
  DELIVERED: { label: "Livrée", cls: "bg-green-100 text-green-900" },
  CANCELLED: { label: "Annulée", cls: "bg-gray-200 text-gray-700" },
};

function Badge({ label, cls }: { label: string; cls: string }) {
  return (
    <span className={`inline-block px-2.5 py-1 text-xs font-bold ${cls}`}>{label}</span>
  );
}

export function VehicleStatusBadge({ status }: { status: string }) {
  const s = VEHICLE_STATUS[status] ?? { label: status, cls: "bg-gray-200 text-gray-700" };
  return <Badge {...s} />;
}

export function OrderStatusBadge({ status }: { status: string }) {
  const s = ORDER_STATUS[status] ?? { label: status, cls: "bg-gray-200 text-gray-700" };
  return <Badge {...s} />;
}

const LISTING: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "En attente de validation", cls: "bg-amber-100 text-amber-900" },
  APPROVED: { label: "Publiée", cls: "bg-green-100 text-green-900" },
  REJECTED: { label: "Refusée", cls: "bg-gray-200 text-gray-700" },
};

const SELLER: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "À approuver", cls: "bg-amber-100 text-amber-900" },
  APPROVED: { label: "Approuvé", cls: "bg-green-100 text-green-900" },
  SUSPENDED: { label: "Suspendu", cls: "bg-gray-200 text-gray-700" },
};

export function ListingBadge({ status }: { status: string }) {
  const s = LISTING[status] ?? { label: status, cls: "bg-gray-200 text-gray-700" };
  return <Badge {...s} />;
}

export function SellerStatusBadge({ status }: { status: string }) {
  const s = SELLER[status] ?? { label: status, cls: "bg-gray-200 text-gray-700" };
  return <Badge {...s} />;
}

export function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="border border-gray-200 border-t-4 border-t-[#D80005] bg-white p-6">
      <p className="text-sm font-semibold text-gray-600">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight text-black">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

export function EmptyState({
  title,
  text,
  href,
  cta,
}: {
  title: string;
  text: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
      <p className="text-lg font-bold text-black">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">{text}</p>
      {href && cta && (
        <Link
          href={href}
          className="mt-6 inline-block bg-[#D80005] px-8 py-3.5 text-[13px] font-bold uppercase text-white transition-colors hover:bg-black"
        >
          {cta}
        </Link>
      )}
    </div>
  );
}