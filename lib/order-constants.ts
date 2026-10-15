import type { OrderStatus } from "@prisma/client";

/* ─────────── The life of an order ─────────── */

export const FLOW: OrderStatus[] = [
  "PENDING",
  "VERIFIED",
  "CONFIRMED",
  "PAID",
  "SHIPPED",
  "DELIVERED",
];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Reçue",
  VERIFIED: "Vérifiée",
  CONFIRMED: "Confirmée par le vendeur",
  PAID: "Paiement reçu",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

export const NEXT_STEP: Partial<
  Record<OrderStatus, { to: OrderStatus; label: string; hint: string }>
> = {
  PENDING: {
    to: "VERIFIED",
    label: "Marquer comme vérifiée",
    hint: "Vérifiez le client, puis confirmez le prix avec les frais d'expédition.",
  },
  VERIFIED: {
    to: "CONFIRMED",
    label: "Le vendeur a confirmé",
    hint: "Contactez le vendeur : le véhicule est-il toujours disponible ?",
  },
  CONFIRMED: {
    to: "PAID",
    label: "Paiement du client reçu",
    hint: "Confirmez que le client a bien payé le total.",
  },
  PAID: {
    to: "SHIPPED",
    label: "Marquer comme expédiée",
    hint: "Organisez le transport et le dédouanement.",
  },
  SHIPPED: {
    to: "DELIVERED",
    label: "Marquer comme livrée",
    hint: "Confirmez que le client a reçu son véhicule. Le vendeur pourra alors être payé.",
  },
};

export const shortRef = (id: string) => `#${id.slice(-6).toUpperCase()}`;

/** The seller's price plus AutoZone's margin. */
export const publicPrice = (sellerPrice: number, margin: number) =>
  sellerPrice + margin;