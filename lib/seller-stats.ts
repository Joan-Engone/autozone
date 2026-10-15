import "server-only";

import { prisma } from "@/lib/db/prisma";

const DAY = 86_400_000;

export interface DayPoint {
  date: string;
  label: string;
  views: number;
  quotes: number;
}

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const trend = (current: number, previous: number): number | null =>
  previous === 0
    ? null
    : Math.round(((current - previous) / previous) * 100);

/** Everything the seller's overview page shows. */
export async function getSellerStats(sellerId: string, days = 30) {
  if (!Number.isInteger(days) || days < 1 || days > 365) {
    throw new Error("days must be an integer between 1 and 365");
  }

  const today = startOfDay(new Date());
  const start = new Date(today.getTime() - (days - 1) * DAY);
  const previousStart = new Date(start.getTime() - days * DAY);

  const [vehicles, events, orders] = await Promise.all([
    prisma.vehicle.findMany({
      where: { sellerId },
      orderBy: { createdAt: "desc" },
    }),

    prisma.vehicleEvent.findMany({
      where: {
        vehicle: { sellerId },
        createdAt: { gte: previousStart, lt: new Date(today.getTime() + DAY) },
      },
      select: {
        vehicleId: true,
        type: true,
        createdAt: true,
      },
    }),

    prisma.order.findMany({
      where: { vehicle: { sellerId } },
      include: { vehicle: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const series: DayPoint[] = [];
  const byDay = new Map<string, DayPoint>();

  for (let i = 0; i < days; i++) {
    const d = new Date(start.getTime() + i * DAY);

    const point: DayPoint = {
      date: dayKey(d),
      label: d.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      }),
      views: 0,
      quotes: 0,
    };

    series.push(point);
    byDay.set(point.date, point);
  }

  let views = 0;
  let quotes = 0;
  let previousViews = 0;
  let previousQuotes = 0;

  const perVehicle = new Map<
    string,
    { views: number; quotes: number }
  >();

  for (const event of events) {
    if (event.createdAt < start) {
      if (event.type === "VIEW") {
        previousViews++;
      } else {
        previousQuotes++;
      }
      continue;
    }

    const point = byDay.get(dayKey(event.createdAt));

    const entry = perVehicle.get(event.vehicleId) ?? {
      views: 0,
      quotes: 0,
    };

    if (event.type === "VIEW") {
      views++;
      entry.views++;
      if (point) point.views++;
    } else {
      quotes++;
      entry.quotes++;
      if (point) point.quotes++;
    }

    perVehicle.set(event.vehicleId, entry);
  }

  const top = vehicles
    .map((vehicle) => ({
      vehicle,
      ...(perVehicle.get(vehicle.id) ?? {
        views: 0,
        quotes: 0,
      }),
    }))
    .sort((a, b) => b.views - a.views || b.quotes - a.quotes)
    .slice(0, 5);

  const countStatus = (status: string) =>
    vehicles.filter((vehicle) => vehicle.status === status).length;

  const revenue = orders
    .filter((order) => order.status !== "CANCELLED")
    .reduce((sum, order) => sum + order.sellerPrice, 0);

  return {
    days,
    series,
    views,
    quotes,
    viewsTrend: trend(views, previousViews),
    quotesTrend: trend(quotes, previousQuotes),
    conversion: views > 0 ? (quotes / views) * 100 : 0,

    counts: {
      total: vehicles.length,
      available: countStatus("AVAILABLE"),
      reserved: countStatus("RESERVED"),
      sold: countStatus("SOLD"),
    },

    top,
    revenue,

    activeOrders: orders.filter((order) =>
      ["PENDING", "VERIFIED", "CONFIRMED", "PAID", "SHIPPED"].includes(
        order.status,
      ),
    ).length,

    recentOrders: orders.slice(0, 5),
  };
}

/** All-time views and quote requests for each vehicle. */
export async function getVehicleTotals(sellerId: string) {
  const rows = await prisma.vehicleEvent.groupBy({
    by: ["vehicleId", "type"],
    where: { vehicle: { sellerId } },
    _count: { _all: true },
  });

  const totals = new Map<
    string,
    { views: number; quotes: number }
  >();

  for (const row of rows) {
    const entry = totals.get(row.vehicleId) ?? {
      views: 0,
      quotes: 0,
    };

    if (row.type === "VIEW") {
      entry.views = row._count._all;
    } else {
      entry.quotes = row._count._all;
    }

    totals.set(row.vehicleId, entry);
  }

  return totals;
}