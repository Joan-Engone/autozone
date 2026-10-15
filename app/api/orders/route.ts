import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server"; // ← the file that contains betterAuth({...})
import { prisma } from "@/lib/db/prisma";
import { OrderError, STATUS_LABEL, createOrder } from "@/lib/orders";

export const runtime = "nodejs";

// The customer's orders (for the app)
export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Non connecté." }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { buyerId: session.user.id },
    include: { vehicle: { select: { title: true, year: true, images: true, imageUrl: true } } },
    orderBy: { createdAt: "desc" },
  });

  // Customers see their total and status, never the seller's price or Auto Zone's margin
  return NextResponse.json(
    orders.map((o) => ({
      id: o.id,
      vehicle: { title: o.vehicle.title, year: o.vehicle.year, image: o.vehicle.images[0] ?? o.vehicle.imageUrl },
      total: o.price,
      status: o.status,
      statusLabel: STATUS_LABEL[o.status],
      createdAt: o.createdAt,
    }))
  );
}

// A customer orders a vehicle from the app
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Non connecté." }, { status: 401 });

  let body: { vehicleId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  if (typeof body.vehicleId !== "string") return NextResponse.json({ error: "Véhicule manquant." }, { status: 400 });

  try {
    const order = await createOrder({ vehicleId: body.vehicleId, customerId: session.user.id, actorName: session.user.name });
    return NextResponse.json({ id: order.id }, { status: 201 });
  } catch (error) {
    if (error instanceof OrderError) return NextResponse.json({ error: error.message }, { status: 409 });
    console.error("Orders: could not create the order", error);
    return NextResponse.json({ error: "La commande n'a pas pu être créée." }, { status: 500 });
  }
}