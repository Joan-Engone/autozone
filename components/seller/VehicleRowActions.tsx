"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { deleteVehicle, setVehicleStatus } from "@/app/seller/vehicles/new/actions";

type Status = "AVAILABLE" | "RESERVED" | "SOLD";

export default function VehicleRowActions({ id, status, title }: { id: string; status: string; title: string }) {
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={`status-${id}`} className="sr-only">Statut de {title}</label>
      <select
        id={`status-${id}`}
        defaultValue={status}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as Status;
          start(async () => {
            await setVehicleStatus(id, next);
          });
        }}
        className="border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-black focus:border-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] disabled:opacity-60"
      >
        <option value="AVAILABLE">En ligne</option>
        <option value="RESERVED">Réservé</option>
        <option value="SOLD">Vendu</option>
      </select>

      {pending && <Loader2 size={16} className="animate-spin text-gray-400" aria-label="Enregistrement" />}

      {confirming ? (
        <>
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              start(async () => {
                await deleteVehicle(id);
              })
            }
            className="bg-[#D80005] px-3 py-2 text-xs font-bold text-white hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2"
          >
            Supprimer
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="px-2 py-2 text-xs font-bold text-gray-600 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]"
          >
            Annuler
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          aria-label={`Supprimer ${title}`}
          className="flex h-8 w-8 items-center justify-center text-gray-400 transition-colors hover:bg-red-50 hover:text-[#D80005] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}