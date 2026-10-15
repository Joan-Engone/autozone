import "server-only";

import { prisma } from "@/lib/db/prisma";

export {
  FLOW,
  STATUS_LABEL,
  NEXT_STEP,
  shortRef,
  publicPrice,
} from "@/lib/order-constants";

/* ─────────── Customer-side steps and labels ─────────── */

/** The normal path of an order, in order. CANCELLED is outside this path. */
export const ORDER_STEPS = ["PENDING", "VERIFIED", "CONFIRMED", "PAID", "SHIPPED", "DELIVERED"] as const;

export const ORDER_LABEL: Record<string, string> = {
  PENDING: "Demande reçue",
  VERIFIED: "Véhicule vérifié",
  CONFIRMED: "Commande confirmée",
  PAID: "Paiement reçu",
  SHIPPED: "Expédié",
  DELIVERED: "Livré",
  CANCELLED: "Annulée",
};

/* ─────────── Order errors ─────────── */

export class OrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderError";
  }
}

/* ─────────── Creating an order ─────────── */

/** Used by customers and administrators to create an order. */
export async function createOrder(params: {
  vehicleId: string;
  customerId: string;
  shippingFee?: number;
  actorName: string;
}) {
  const { vehicleId, customerId, actorName } = params;
  const rawFee = params.shippingFee ?? 0;

  if (!Number.isFinite(rawFee) || rawFee < 0) {
    throw new OrderError("Les frais d'expédition sont invalides.");
  }

  const shippingFee = Math.round(rawFee);

  return prisma.$transaction(async (tx) => {
    const vehicle = await tx.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (
      !vehicle ||
      vehicle.listing !== "APPROVED" ||
      vehicle.status !== "AVAILABLE"
    ) {
      throw new OrderError("Ce véhicule n'est plus disponible.");
    }

    const sellerPrice = vehicle.price;
    const margin = vehicle.margin;

    const order = await tx.order.create({
      data: {
        vehicleId,
        buyerId: customerId,
        sellerPrice,
        margin,
        shippingFee,
        price: sellerPrice + margin + shippingFee,
        status: "PENDING",
      },
    });

    await tx.orderLog.create({
      data: {
        orderId: order.id,
        status: "PENDING",
        message: "Commande reçue",
        actorName,
      },
    });

    await tx.vehicle.update({
      where: { id: vehicleId },
      data: { status: "RESERVED" },
    });

    return order;
  });
}

/* ─────────── Numbers for the owner's overview ─────────── */

export async function getAdminStats() {
  const [orders, pendingSellers, pendingVehicles, messages] =
    await Promise.all([
      prisma.order.findMany({
        include: {
          vehicle: { select: { title: true, year: true } },
          buyer: { select: { name: true } },
        },
        orderBy: { createdAt: "asc" },
      }),

      prisma.user.count({
        where: {
          role: "seller",
          OR: [
            { sellerProfile: null },
            { sellerProfile: { status: "PENDING" } },
          ],
        },
      }),

      prisma.vehicle.count({
        where: { listing: "PENDING" },
      }),

      prisma.contactMessage.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 86_400_000),
          },
        },
      }),
    ]);

  const sum = (
    list: typeof orders,
    field: "margin" | "price" | "sellerPrice",
  ) => list.reduce((total, order) => total + order[field], 0);

  const delivered = orders.filter(
    (order) => order.status === "DELIVERED",
  );

  const inProgress = orders.filter(
    (order) =>
      !["DELIVERED", "CANCELLED"].includes(order.status),
  );

  const notYetPaid = orders.filter((order) =>
    ["PENDING", "VERIFIED", "CONFIRMED"].includes(order.status),
  );

  const sellersToPay = delivered.filter(
    (order) => !order.sellerPaidAt,
  );

  return {
    counts: {
      toProcess: orders.filter(
        (order) => order.status === "PENDING",
      ).length,
      pendingSellers,
      pendingVehicles,
      messages,
    },
    marginEarned: sum(delivered, "margin"),
    marginInProgress: sum(inProgress, "margin"),
    toCollect: sum(notYetPaid, "price"),
    toPaySellers: sum(sellersToPay, "sellerPrice"),
    queue: inProgress.slice(0, 8),
  };
}