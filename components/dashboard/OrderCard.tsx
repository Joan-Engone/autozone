import { Car } from "lucide-react";
import { formatPrice } from "@/lib/formatters";
import { ORDER_LABEL, ORDER_STEPS } from "@/lib/orders";

export interface OrderCardData {
  id: string;
  price: number;
  status: string;
  createdAt: Date;
  vehicle: { title: string; year: number; imageUrl: string | null };
  /** Most recent tracking message, if any */
  lastLog?: { message: string; createdAt: Date } | null;
}

const dateFormat = (d: Date) =>
  d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default function OrderCard({ order }: { order: OrderCardData }) {
  const cancelled = order.status === "CANCELLED";
  const stepIndex = ORDER_STEPS.findIndex((s) => s === order.status);
  const label = ORDER_LABEL[order.status] ?? order.status;

  return (
    <li className="border border-gray-200 bg-white">
      <div className="flex flex-col gap-6 p-6 sm:flex-row">
        <div className="flex h-32 w-full shrink-0 items-center justify-center overflow-hidden bg-gray-100 text-gray-300 sm:w-48">
          {order.vehicle.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={order.vehicle.imageUrl} alt={order.vehicle.title} className="h-full w-full object-cover" />
          ) : (
            <Car size={48} strokeWidth={1.25} aria-hidden="true" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-black tracking-tight text-black">{order.vehicle.title}</h2>
              <p className="mt-1 text-xs text-gray-500">
                Commande du {dateFormat(order.createdAt)} · réf. {order.id.slice(-6).toUpperCase()}
              </p>
            </div>
            <span
              className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white ${
                cancelled ? "bg-gray-500" : order.status === "DELIVERED" ? "bg-black" : "bg-[#D80005]"
              }`}
            >
              {label}
            </span>
          </div>

          <p className="mt-4 text-2xl font-black text-[#D80005]">{formatPrice(order.price)}</p>

          {/* Progress: six segments, one per step */}
          {!cancelled && stepIndex >= 0 && (
            <div className="mt-5">
              <p className="text-xs font-bold text-black">
                Étape {stepIndex + 1} sur {ORDER_STEPS.length}
                <span className="font-normal text-gray-500"> · {label}</span>
              </p>
              <ol className="mt-2 grid grid-cols-6 gap-1.5" aria-hidden="true">
                {ORDER_STEPS.map((step, i) => (
                  <li key={step} className={`h-1.5 ${i <= stepIndex ? "bg-[#D80005]" : "bg-gray-200"}`} />
                ))}
              </ol>
            </div>
          )}

          {order.lastLog && (
            <p className="mt-4 border-l-4 border-[#D80005] bg-gray-50 px-4 py-3 text-sm text-gray-700">
              {order.lastLog.message}
              <span className="ml-2 text-xs text-gray-400">{dateFormat(order.lastLog.createdAt)}</span>
            </p>
          )}
        </div>
      </div>
    </li>
  );
}