
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

interface VehicleOption extends Option {
  total: number;
}

interface NewOrderFormProps {
  vehicles: VehicleOption[];
  customers: Option[];
}

const field =
  "w-full border border-gray-300 bg-white px-4 py-3.5 text-sm text-black focus:border-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]";

export default function NewOrderForm({
  vehicles = [],
  customers = [],
}: NewOrderFormProps) {
  const router = useRouter();

  const [vehicleId, setVehicleId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [fee, setFee] = useState("0");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const vehicle = vehicles.find((item) => item.id === vehicleId);

  const shippingFee = Number(fee);
  const validFee =
    Number.isFinite(shippingFee) &&
    shippingFee >= 0 &&
    Number.isInteger(shippingFee);

  const total = vehicle
    ? vehicle.total + (validFee ? shippingFee : 0)
    : 0;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (sending) return;

    if (!vehicleId || !customerId) {
      setError("Choisissez un véhicule et un client.");
      return;
    }

    if (!validFee) {
      setError(
        "Les frais d'expédition et de douane doivent être un montant entier positif ou nul.",
      );
      return;
    }

    setError("");
    setSending(true);

    try {
      const result = await createOrderByAdmin(
        vehicleId,
        customerId,
        shippingFee,
      );

      if (result.error || !result.id) {
        setError(
          result.error ?? "La commande n'a pas pu être créée.",
        );
        return;
      }

      router.push(`/admin/orders/${result.id}`);
      router.refresh();
    } catch {
      setError(
        "Une erreur inattendue est survenue. Veuillez réessayer.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 w-full min-w-0 max-w-none space-y-6 border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <label
          htmlFor="vehicle"
          className="mb-2 block text-[13px] font-bold text-black"
        >
          Véhicule
        </label>

        <select
          id="vehicle"
          required
          value={vehicleId}
          onChange={(event) => setVehicleId(event.target.value)}
          className={field}
        >
          <option value="">Choisir un véhicule disponible</option>

          {vehicles.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>

        {vehicles.length === 0 && (
          <p className="mt-2 text-xs text-gray-500">
            Aucun véhicule disponible pour le moment.
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="customer"
          className="mb-2 block text-[13px] font-bold text-black"
        >
          Client
        </label>

        <select
          id="customer"
          required
          value={customerId}
          onChange={(event) => setCustomerId(event.target.value)}
          className={field}
        >
          <option value="">Choisir un client</option>

          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.label}
            </option>
          ))}
        </select>

        {customers.length === 0 && (
          <p className="mt-2 text-xs text-gray-500">
            Aucun compte client avec le rôle BUYER n&apos;a été trouvé.
          </p>
        )}

        <p className="mt-2 text-xs text-gray-500">
          Le client doit avoir un compte. Utilisez ce formulaire pour
          enregistrer une commande reçue par téléphone ou WhatsApp.
        </p>
      </div>

      <div>
        <label
          htmlFor="shipping"
          className="mb-2 block text-[13px] font-bold text-black"
        >
          Frais d&apos;expédition et de douane (FCFA)
        </label>

        <input
          id="shipping"
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          required
          value={fee}
          onChange={(event) => setFee(event.target.value)}
          className={field}
        />
      </div>

      {vehicle && (
        <div className="space-y-3 border-l-4 border-[#D80005] bg-gray-50 px-5 py-4">
          <div className="flex items-start justify-between gap-4 text-sm">
            <span className="text-gray-600">Prix du véhicule</span>
            <span className="font-semibold text-black">
              {formatPrice(vehicle.total)}
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 text-sm">
            <span className="text-gray-600">
              Expédition et douane
            </span>
            <span className="font-semibold text-black">
              {formatPrice(validFee ? shippingFee : 0)}
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 border-t border-gray-200 pt-3 text-sm">
            <span className="font-bold text-black">
              Total pour le client
            </span>
            <span className="font-black text-[#D80005]">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex gap-3 border border-[#D80005] bg-red-50 p-4 text-sm text-[#D80005]"
        >
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={
            sending ||
            vehicles.length === 0 ||
            customers.length === 0
          }
          className="inline-flex items-center gap-3 bg-[#D80005] px-8 py-4 text-[13px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2"
        >
          {sending && (
            <Loader2
              size={16}
              className="animate-spin"
              aria-hidden="true"
            />
          )}
          {sending ? "Création en cours..." : "Créer la commande"}
        </button>

        <Link
          href="/admin/orders"
          className="text-sm font-bold text-gray-600 hover:text-black"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}
