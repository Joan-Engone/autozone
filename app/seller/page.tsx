import Image from "next/image";
import Link from "next/link";
import {
  Car,
  Eye,
  MessageSquareText,
  Percent,
  PlusCircle,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { getSellerStats } from "@/lib/seller-stats";
import { formatPrice } from "@/lib/formatters";
import ActivityChart from "@/components/seller/ActivityChart";
import {
  OrderStatusBadge,
  VehicleStatusBadge,
} from "@/components/seller/ui";

function Trend({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <span className="text-xs text-gray-400">
        Pas de période précédente
      </span>
    );
  }

  const up = value >= 0;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-bold ${
        up ? "text-green-600" : "text-[#D80005]"
      }`}
    >
      {up ? (
        <TrendingUp size={14} aria-hidden="true" />
      ) : (
        <TrendingDown size={14} aria-hidden="true" />
      )}
      {up ? "+" : ""}
      {value}%
      <span className="font-normal text-gray-400">
        {" "}vs période précédente
      </span>
    </span>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  footer,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  footer: React.ReactNode;
}) {
  return (
    <div className="border border-gray-200 border-t-4 border-t-[#D80005] bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-600">{label}</p>
        <Icon
          size={18}
          className="text-gray-400"
          aria-hidden="true"
        />
      </div>

      <p className="mt-3 text-3xl font-black tracking-tight text-black">
        {value}
      </p>

      <div className="mt-2 min-h-[18px]">{footer}</div>
    </div>
  );
}

export default async function SellerOverviewPage() {
  const session = await requireRole(["seller", "admin"]);
  const stats = await getSellerStats(session.user.id, 30);
  const { counts } = stats;

  const firstName = session.user.name.trim().split(" ")[0];

  const stock = [
    { label: "En ligne", value: counts.available, color: "bg-black" },
    { label: "Réservés", value: counts.reserved, color: "bg-amber-400" },
    { label: "Vendus", value: counts.sold, color: "bg-[#D80005]" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black">
            Bonjour, {firstName}
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Voici l&apos;activité de vos véhicules sur les 30 derniers jours.
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

      {/* First step for a new seller */}
      {counts.total === 0 && (
        <div className="flex flex-col gap-4 border border-[#D80005] bg-red-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-black uppercase text-black">
              Ajoutez votre premier véhicule
            </p>

            <p className="mt-1 text-sm text-gray-700">
              Avec des photos de qualité, votre annonce apparaît dans le
              catalogue et vos statistiques se remplissent.
            </p>
          </div>

          <Link
            href="/seller/vehicles/new"
            className="inline-flex shrink-0 items-center justify-center bg-black px-6 py-3.5 text-[13px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#D80005]"
          >
            Commencer
          </Link>
        </div>
      )}

      {/* Key numbers */}
      <section
        aria-label="Chiffres clés"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <Kpi
          icon={Eye}
          label="Vues des annonces"
          value={stats.views}
          footer={<Trend value={stats.viewsTrend} />}
        />

        <Kpi
          icon={MessageSquareText}
          label="Demandes de devis"
          value={stats.quotes}
          footer={<Trend value={stats.quotesTrend} />}
        />

        <Kpi
          icon={Percent}
          label="Taux de contact"
          value={`${stats.conversion.toFixed(1).replace(".", ",")} %`}
          footer={
            <span className="text-xs text-gray-400">
              Devis pour 100 vues
            </span>
          }
        />

        <Kpi
          icon={Car}
          label="Véhicules en ligne"
          value={counts.available}
          footer={
            <span className="text-xs text-gray-400">
              {counts.sold} vendu{counts.sold > 1 ? "s" : ""} au total
            </span>
          }
        />
      </section>

      {/* Chart and stock */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="border border-gray-200 bg-white p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-black uppercase tracking-tight text-black">
            Activité
          </h2>

          <ActivityChart series={stats.series} />
        </div>

        <div className="border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-black uppercase tracking-tight text-black">
            Votre stock
          </h2>

          {counts.total === 0 ? (
            <p className="text-sm text-gray-500">
              Aucun véhicule pour le moment.
            </p>
          ) : (
            <>
              <div
                className="flex h-3 overflow-hidden bg-gray-100"
                role="img"
                aria-label="Répartition du stock"
              >
                {stock.map((item) => (
                  <span
                    key={item.label}
                    className={item.color}
                    style={{
                      width: `${(item.value / counts.total) * 100}%`,
                    }}
                  />
                ))}
              </div>

              <ul className="mt-5 space-y-3">
                {stock.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={`h-3 w-3 ${item.color}`}
                      />
                      {item.label}
                    </span>

                    <span className="font-black text-black">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-gray-100 pt-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Chiffre d&apos;affaires
                </p>

                <p className="mt-1 text-2xl font-black text-black">
                  {formatPrice(stats.revenue)}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {stats.activeOrders} commande
                  {stats.activeOrders > 1 ? "s" : ""} en cours
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Best vehicles and orders */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Most viewed vehicles */}
        <div className="border border-gray-200 bg-white lg:col-span-2">
          <div className="flex items-center justify-between px-6 pt-6">
            <h2 className="text-lg font-black uppercase tracking-tight text-black">
              Vos véhicules les plus vus
            </h2>

            <Link
              href="/seller/vehicles"
              className="text-xs font-bold text-[#D80005] underline underline-offset-4 hover:text-black"
            >
              Tout voir
            </Link>
          </div>

          {stats.top.length === 0 ? (
            <p className="px-6 pb-8 pt-4 text-sm text-gray-500">
              Vos véhicules apparaîtront ici avec leurs statistiques.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="border-y border-gray-200 bg-gray-50 text-xs font-bold text-gray-600">
                  <tr>
                    <th className="px-6 py-3">Véhicule</th>
                    <th className="px-3 py-3">Vues</th>
                    <th className="px-3 py-3">Devis</th>
                    <th className="px-3 py-3">Contact</th>
                    <th className="px-6 py-3">Statut</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {stats.top.map(({ vehicle, views, quotes }) => {
                    // Vehicle uses imageUrl, not an images array.
                    const cover = vehicle.imageUrl;

                    return (
                      <tr key={vehicle.id}>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <span className="relative flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden bg-gray-100 text-gray-400">
                              {cover ? (
                                <Image
                                  src={cover}
                                  alt={`Photo de ${vehicle.title}`}
                                  fill
                                  unoptimized
                                  sizes="56px"
                                  className="object-cover"
                                />
                              ) : (
                                <Car
                                  size={20}
                                  aria-label="Aucune photo disponible"
                                />
                              )}
                            </span>

                            <span className="font-bold text-black">
                              {vehicle.title}{" "}
                              <span className="font-normal text-gray-500">
                                {vehicle.year}
                              </span>
                            </span>
                          </div>
                        </td>

                        <td className="px-3 py-3 font-black">{views}</td>

                        <td className="px-3 py-3 font-black text-[#D80005]">
                          {quotes}
                        </td>

                        <td className="px-3 py-3 text-gray-600">
                          {views > 0
                            ? `${((quotes / views) * 100)
                                .toFixed(1)
                                .replace(".", ",")} %`
                            : "–"}
                        </td>

                        <td className="px-6 py-3">
                          <VehicleStatusBadge status={vehicle.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div className="border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-black uppercase tracking-tight text-black">
            Dernières commandes
          </h2>

          {stats.recentOrders.length === 0 ? (
            <p className="text-sm leading-relaxed text-gray-500">
              Les commandes passées par vos clients depuis l&apos;application
              apparaîtront ici.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {stats.recentOrders.map((order) => (
                <li key={order.id} className="py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-black">
                        {order.vehicle.title}
                      </p>

                      <p className="text-xs text-gray-500">
                        {order.buyer.name} ·{" "}
                        {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>

                    <OrderStatusBadge status={order.status} />
                  </div>

                  <p className="mt-1 text-sm font-black text-black">
                    {formatPrice(order.price)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}