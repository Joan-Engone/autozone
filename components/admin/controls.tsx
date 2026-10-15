"use client";

import { useState, useTransition } from "react";
import type { ListingStatus, OrderStatus, SellerStatus } from "@prisma/client";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import {
  advanceOrder,
  cancelOrder,
  markSellerPaid,
  reviewVehicle,
  saveOrderNote,
  setSellerStatus,
  updateShippingFee,
} from "@/app/admin/actions";
import type { ActionResult } from "@/app/admin/actions";
import { NEXT_STEP, publicPrice } from "@/lib/order-constants";
import { formatPrice } from "@/lib/formatters";

const primary =
  "inline-flex items-center justify-center gap-2 bg-[#D80005] px-6 py-3.5 text-[13px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2";
const outline =
  "inline-flex items-center justify-center gap-2 border-2 border-black px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-black transition-colors hover:bg-black hover:text-white disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2";
const field =
  "w-full border border-gray-300 bg-white px-4 py-3 text-sm text-black focus:border-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]";

function useAction() {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const run = (fn: () => Promise<ActionResult>) =>
    start(async () => {
      setError("");
      const result = await fn();
      if (result.error) setError(result.error);
    });
  return { pending, error, run };
}

const ErrorLine = ({ message }: { message: string }) =>
  message ? (
    <p role="alert" className="mt-3 flex items-center gap-2 text-xs text-[#D80005]">
      <AlertCircle size={14} aria-hidden="true" />
      {message}
    </p>
  ) : null;

/* ─────────── One order: every action the owner can take ─────────── */

export function OrderActions({
  id,
  status,
  shippingFee,
  note,
  sellerPaid,
}: {
  id: string;
  status: OrderStatus;
  shippingFee: number;
  note: string;
  sellerPaid: boolean;
}) {
  const { pending, error, run } = useAction();
  const [fee, setFee] = useState(String(shippingFee));
  const [text, setText] = useState(note);
  const [reason, setReason] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);

  const next = NEXT_STEP[status];
  const canEditFee = ["PENDING", "VERIFIED", "CONFIRMED"].includes(status);
  const canCancel = status !== "DELIVERED" && status !== "CANCELLED";

  return (
    <div className="space-y-6">
      {next && (
        <div className="border border-[#D80005] border-l-4 bg-white p-6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#D80005]">Prochaine étape</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">{next.hint}</p>
          <button type="button" disabled={pending} onClick={() => run(() => advanceOrder(id, next.to))} className={`${primary} mt-4`}>
            {pending ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Check size={16} aria-hidden="true" />}
            {next.label}
          </button>
        </div>
      )}

      {status === "DELIVERED" && !sellerPaid && (
        <div className="border border-[#D80005] border-l-4 bg-white p-6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#D80005]">À faire</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">Le véhicule est livré : vous pouvez maintenant payer le vendeur.</p>
          <button type="button" disabled={pending} onClick={() => run(() => markSellerPaid(id))} className={`${primary} mt-4`}>
            <Check size={16} aria-hidden="true" />
            J&apos;ai payé le vendeur
          </button>
        </div>
      )}

      {canEditFee && (
        <div className="border border-gray-200 bg-white p-6">
          <label htmlFor="fee" className="text-[13px] font-bold text-black">Frais d&apos;expédition et de douane (FCFA)</label>
          <div className="mt-3 flex gap-3">
            <input id="fee" type="number" inputMode="numeric" min={0} value={fee} onChange={(e) => setFee(e.target.value)} className={field} />
            <button type="button" disabled={pending} onClick={() => run(() => updateShippingFee(id, Number(fee)))} className={outline}>
              Enregistrer
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">Le total du client est recalculé. Modifiable jusqu&apos;au paiement.</p>
        </div>
      )}

      <div className="border border-gray-200 bg-white p-6">
        <label htmlFor="note" className="text-[13px] font-bold text-black">Note interne</label>
        <textarea id="note" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Visible seulement par vous" className={`${field} mt-3 resize-y`} />
        <button type="button" disabled={pending} onClick={() => run(() => saveOrderNote(id, text))} className={`${outline} mt-3`}>
          Enregistrer la note
        </button>
      </div>

      {canCancel && (
        <div className="border border-gray-200 bg-white p-6">
          {confirmCancel ? (
            <>
              <label htmlFor="reason" className="text-[13px] font-bold text-black">Raison de l&apos;annulation (facultatif)</label>
              <input id="reason" value={reason} onChange={(e) => setReason(e.target.value)} className={`${field} mt-3`} />
              <div className="mt-3 flex gap-3">
                <button type="button" disabled={pending} onClick={() => run(() => cancelOrder(id, reason))} className={primary}>Confirmer l&apos;annulation</button>
                <button type="button" onClick={() => setConfirmCancel(false)} className="px-3 text-sm font-bold text-gray-600 hover:text-black">Retour</button>
              </div>
            </>
          ) : (
            <button type="button" onClick={() => setConfirmCancel(true)} className="text-sm font-bold text-[#D80005] underline underline-offset-4 hover:text-black">
              Annuler cette commande
            </button>
          )}
        </div>
      )}
      <ErrorLine message={error} />
    </div>
  );
}

/* ─────────── A seller: approve or suspend ─────────── */

export function SellerActions({ userId, status }: { userId: string; status: SellerStatus }) {
  const { pending, error, run } = useAction();
  const set = (next: SellerStatus) => run(() => setSellerStatus(userId, next));

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {status !== "APPROVED" && (
          <button type="button" disabled={pending} onClick={() => set("APPROVED")} className={primary.replace("px-6 py-3.5", "px-4 py-2.5")}>
            {status === "SUSPENDED" ? "Réactiver" : "Approuver"}
          </button>
        )}
        {status === "APPROVED" && (
          <button type="button" disabled={pending} onClick={() => set("SUSPENDED")} className={outline}>Suspendre</button>
        )}
        {status === "PENDING" && (
          <button type="button" disabled={pending} onClick={() => set("SUSPENDED")} className={outline}>Refuser</button>
        )}
      </div>
      <ErrorLine message={error} />
    </div>
  );
}

/* ─────────── A vehicle: approve it and set the margin ─────────── */

export function VehicleReview({
  id,
  listing,
  price,
  margin,
}: {
  id: string;
  listing: ListingStatus;
  price: number;
  margin: number;
}) {
  const { pending, error, run } = useAction();
  const [value, setValue] = useState(String(margin));
  const amount = Math.max(0, Number(value) || 0);

  const save = (decision: ListingStatus) => run(() => reviewVehicle(id, decision, amount));

  return (
    <div className="min-w-[260px]">
      <label htmlFor={`margin-${id}`} className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Votre marge (FCFA)</label>
      <input
        id={`margin-${id}`}
        type="number"
        inputMode="numeric"
        min={0}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`${field} mt-1`}
      />
      <p className="mt-2 text-xs text-gray-500">
        Prix affiché au client : <span className="font-black text-black">{formatPrice(publicPrice(price, amount))}</span>
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {listing === "APPROVED" ? (
          <button type="button" disabled={pending} onClick={() => save("APPROVED")} className={outline}>
            {pending && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
            Enregistrer la marge
          </button>
        ) : (
          <>
            <button type="button" disabled={pending} onClick={() => save("APPROVED")} className={primary.replace("px-6 py-3.5", "px-4 py-2.5")}>
              {pending && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
              Approuver
            </button>
            {listing === "PENDING" && (
              <button type="button" disabled={pending} onClick={() => save("REJECTED")} className={outline}>Refuser</button>
            )}
          </>
        )}
      </div>
      <ErrorLine message={error} />
    </div>
  );
}

/* ─────────── Payments: mark one order as paid to the seller ─────────── */

export function PaySellerButton({ orderId }: { orderId: string }) {
  const { pending, error, run } = useAction();
  return (
    <div>
      <button type="button" disabled={pending} onClick={() => run(() => markSellerPaid(orderId))} className={outline}>
        {pending && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
        Marquer payé
      </button>
      <ErrorLine message={error} />
    </div>
  );
}