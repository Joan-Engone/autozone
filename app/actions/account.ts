
"use server";

import { prisma } from "@/lib/db/prisma";
import { requireSession } from "@/lib/auth/session";

/**
 * Switches the signed-in user from buyer to seller.
 * Admin accounts cannot become sellers through this action.
 */
export async function becomeSeller(): Promise<{ ok: boolean }> {
  const session = await requireSession();

  const result = await prisma.user.updateMany({
    where: {
      id: session.user.id,
      role: {
        in: ["BUYER", "client"],
      },
    },
    data: {
      role: "SELLER",
      accountType: "seller",
    },
  });

  if (result.count > 0) {
    await prisma.sellerProfile.upsert({
      where: { userId: session.user.id },
      update: {},
      create: { userId: session.user.id },
    });

    return { ok: true };
  }

  // If the user is already a seller, ensure their profile exists.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role === "SELLER") {
    await prisma.sellerProfile.upsert({
      where: { userId: session.user.id },
      update: {},
      create: { userId: session.user.id },
    });

    return { ok: true };
  }

  // Do not promote administrators or users with unknown roles.
  return { ok: false };
}
