"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { ListingStatus, OrderStatus, SellerStatus } from "@prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/session";
import {
  NEXT_STEP,
  OrderError,
  STATUS_LABEL,
  createOrder,
} from "@/lib/orders";

export type ActionResult = { error?: string };

async function owner() {
  const session = await requireRole(["admin"]);
  return session.user;
}

function refresh(orderId?: string) {
  [
    "/admin",
    "/admin/orders",
    "/admin/payments",
    "/admin/sellers",
    "/admin/vehicles",
  ].forEach((path) => revalidatePath(path));

  if (orderId) {
    revalidatePath(`/admin/orders/${orderId}`);
  }
}

const toAmount = (value: number) =>
  Number.isFinite(value) && value >= 0 ? Math.round(value) : null;

/* ─────────── Orders ─────────── */

export async function advanceOrder(
  orderId: string,
  to: OrderStatus,
): Promise<ActionResult> {
  const actor = await owner();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order || NEXT_STEP[order.status]?.to !== to) {
    return { error: "Cette étape n'est pas possible." };
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: {
        status: to,
        ...(to === "PAID" ? { paidAt: new Date() } : {}),
      },
    });

    await tx.orderLog.create({
      data: {
        orderId,
        status: to,
        message: STATUS_LABEL[to],
        actorName: actor.name,
      },
    });

    if (to === "DELIVERED") {
      await tx.vehicle.update({
        where: { id: order.vehicleId },
        data: { status: "SOLD" },
      });
    }
  });

  refresh(orderId);
  return {};
}

export async function cancelOrder(
  orderId: string,
  reason: string,
): Promise<ActionResult> {
  const actor = await owner();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { vehicle: true },
  });

  if (
    !order ||
    order.status === "DELIVERED" ||
    order.status === "CANCELLED"
  ) {
    return { error: "Cette commande ne peut plus être annulée." };
  }

  const why = reason.trim().slice(0, 300);

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    });

    await tx.orderLog.create({
      data: {
        orderId,
        status: "CANCELLED",
        message: why
          ? `Commande annulée : ${why}`
          : "Commande annulée",
        actorName: actor.name,
      },
    });

    if (order.vehicle.status === "RESERVED") {
      await tx.vehicle.update({
        where: { id: order.vehicleId },
        data: { status: "AVAILABLE" },
      });
    }
  });

  refresh(orderId);
  return {};
}

export async function updateShippingFee(
  orderId: string,
  fee: number,
): Promise<ActionResult> {
  const actor = await owner();
  const amount = toAmount(fee);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (amount === null) {
    return { error: "Montant invalide." };
  }

  if (
    !order ||
    !["PENDING", "VERIFIED", "CONFIRMED"].includes(order.status)
  ) {
    return {
      error: "Les frais ne peuvent plus être modifiés après le paiement.",
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: {
        shippingFee: amount,
        price: order.sellerPrice + order.margin + amount,
      },
    });

    await tx.orderLog.create({
      data: {
        orderId,
        message: "Frais d'expédition et de douane mis à jour",
        actorName: actor.name,
      },
    });
  });

  refresh(orderId);
  return {};
}

export async function saveOrderNote(
  orderId: string,
  note: string,
): Promise<ActionResult> {
  await owner();

  await prisma.order.update({
    where: { id: orderId },
    data: { note: note.trim().slice(0, 2000) || null },
  });

  refresh(orderId);
  return {};
}

export async function markSellerPaid(
  orderId: string,
): Promise<ActionResult> {
  const actor = await owner();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (
    !order ||
    order.status !== "DELIVERED" ||
    order.sellerPaidAt
  ) {
    return {
      error: "Le vendeur ne peut pas être payé pour cette commande.",
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { sellerPaidAt: new Date() },
    });

    await tx.orderLog.create({
      data: {
        orderId,
        message: "Vendeur payé",
        actorName: actor.name,
      },
    });
  });

  refresh(orderId);
  return {};
}

export async function createOrderByAdmin(
  vehicleId: string,
  customerId: string,
  shippingFee: number,
): Promise<ActionResult & { id?: string }> {
  const actor = await owner();

  try {
    const order = await createOrder({
      vehicleId,
      customerId,
      shippingFee: toAmount(shippingFee) ?? 0,
      actorName: actor.name,
    });

    refresh();
    return { id: order.id };
  } catch (error) {
    if (error instanceof OrderError) {
      return { error: error.message };
    }

    console.error("Admin: could not create the order", error);

    return { error: "La commande n'a pas pu être créée." };
  }
}

/* ─────────── Sellers ─────────── */

export async function setSellerStatus(
  userId: string,
  status: SellerStatus,
): Promise<ActionResult> {
  await owner();

  await prisma.sellerProfile.upsert({
    where: { userId },
    update: { status },
    create: { userId, status },
  });

  refresh();
  return {};
}

/* ─────────── Vehicles ─────────── */

/** Approving a vehicle sets the margin Auto Zone adds on top of the seller's price. */
export async function reviewVehicle(
  vehicleId: string,
  decision: ListingStatus,
  margin: number,
): Promise<ActionResult> {
  await owner();

  const amount = toAmount(margin);

  if (amount === null) {
    return { error: "Marge invalide." };
  }

  await prisma.vehicle.update({
    where: { id: vehicleId },
    data: { listing: decision, margin: amount },
  });

  refresh();
  return {};
}

/* ─────────── Admin Accounts ─────────── */

export async function createAdminAccount({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}): Promise<ActionResult> {
  // Require an existing administrator before creating another one.
  const actor = await owner();

  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedName || normalizedName.length > 100) {
    return { error: "Veuillez saisir un nom valide." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return { error: "Veuillez saisir une adresse e-mail valide." };
  }

  if (password.length < 8) {
    return {
      error: "Le mot de passe doit contenir au moins 8 caractères.",
    };
  }

  try {
    await auth.api.createUser({
      body: {
        name: normalizedName,
        email: normalizedEmail,
        password,
        role: "admin",
      },
      headers: await headers(),
    });

    revalidatePath("/admin");

    return {};
  } catch (error) {
    console.error(
      `Admin account creation failed for ${actor.id}`,
      error,
    );

    return {
      error:
        "Impossible de créer le compte. Vérifiez si cette adresse e-mail est déjà utilisée.",
    };
  }
}