import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// Counts a vehicle view or a quote request, for the seller's statistics
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 60;
const hits = new Map<string, number[]>();

function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return true;
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (tooMany(ip)) return NextResponse.json({ ok: true });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const vehicleId = typeof body.vehicleId === "string" ? body.vehicleId.slice(0, 60) : "";
  const type = body.type === "VIEW" || body.type === "QUOTE" ? body.type : null;
  if (!vehicleId || !type) return NextResponse.json({ error: "invalid" }, { status: 400 });

  try {
    const exists = await prisma.vehicle.findUnique({ where: { id: vehicleId }, select: { id: true } });
    if (exists) await prisma.vehicleEvent.create({ data: { vehicleId, type } });
  } catch (error) {
    console.error("Track: could not save the event", error);
  }
  return NextResponse.json({ ok: true });
}