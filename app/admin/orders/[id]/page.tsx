"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { createOrderByAdmin } from "@/app/admin/actions";
import { formatPrice } from "@/lib/formatters";

interface Option {
  id: string;
  label: string;
}

const field =
  "w-full border border-gray-300 bg-white px-4 py-3.5 text-sm text-black focus:border-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]";

export default function NewOrderForm({
  vehicles,
  customers,
}: {
  vehicles: (Option & { total: number })[];
  customers: Option[];
}) {
  const router = useRouter();
  const [vehicleId, setVehicleId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [fee, setFee] = useState("0");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const vehicle = vehicles.find((v) => v.id === vehicleId);
  const total = vehicle ? vehicle.total + Math.max(0, Number(fee) || 0) : 0;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !customerId) return setError("Choisissez un véhicule et un client.");
    setError("");
    setSending(true);
    const result = await createOrderByAdmin(vehicleId, customerId, Number(fee) || 0);
    if (result.error || !result.id) {
      setError(result.error ?? "La commande n'a pas pu être créée.");
      setSending(false);
      return;
    }
    router.push(`/admin/orders/${result.id}`);
  };

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-2xl space-y-6 border border-gray-200 bg-white p-6 sm:p-8">
      <div>
        <label htmlFor="vehicle" className="mb-2 block text-[13px] font-bold text-black">Véhicule</label>
        <select id="vehicle" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className={field}>
          <option value="">Choisir un véhicule disponible</option>
          {vehicles.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="customer" className="mb-2 block text-[13px] font-bold text-black">Client</label>
        <select id="customer" value={customerId} onChange={(e) => setCustomerId(e.target.value)} className={field}>
          <option value="">Choisir un client</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <p className="mt-2 text-xs text-gray-500">Le client doit avoir un compte. Pour une commande reçue par téléphone ou WhatsApp.</p>
      </div>

      <div>
        <label htmlFor="shipping" className="mb-2 block text-[13px] font-bold text-black">Frais d&apos;expédition et de douane (FCFA)</label>
        <input id="shipping" type="number" inputMode="numeric" min={0} value={fee} onChange={(e) => setFee(e.target.value)} className={field} />
      </div>

      {vehicle && (
        <p className="border-l-4 border-[#D80005] bg-gray-50 px-5 py-4 text-sm text-gray-700">
          Total pour le client : <span className="font-black text-black">{formatPrice(total)}</span>
        </p>
      )}

      {error && (
        <div role="alert" className="flex gap-3 border border-[#D80005] bg-red-50 p-4 text-sm text-[#D80005]">
          <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-3 bg-[#D80005] px-8 py-4 text-[13px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-black disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2"
        >
          {sending && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
          Créer la commande
        </button>
        <Link href="/admin/orders" className="text-sm font-bold text-gray-600 hover:text-black">Annuler</Link>
      </div>
    </form>
  );
}