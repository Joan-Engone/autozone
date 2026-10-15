"use server";

import { prisma } from "@/lib/db/prisma";
import { requireSession } from "@/lib/auth/session";

/**
 * Switches the signed-in user from buyer to seller.
 * Only "client" accounts can switch: admins are never touched,
 * and nobody can use this to become an admin.
 */
export async function becomeSeller(): Promise<{ ok: boolean }> {
  const session = await requireSession();

  const result = await prisma.user.updateMany({
    where: {
      id: session.user.id,
      OR: [{ role: "client" }, { role: null }],
    },
    data: { role: "seller" },
  });

  if (result.count > 0) {
    await prisma.sellerProfile.upsert({
      where: { userId: session.user.id },
      update: {},
      create: { userId: session.user.id }, // waits for the owner to approve
    });
  }

  return { ok: result.count > 0 };
}