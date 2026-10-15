-- CreateEnum
CREATE TYPE "VehicleEventType" AS ENUM ('VIEW', 'QUOTE');

-- CreateTable
CREATE TABLE "vehicle_events" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "type" "VehicleEventType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "vehicle_events_vehicleId_createdAt_idx" ON "vehicle_events"("vehicleId", "createdAt");

-- CreateIndex
CREATE INDEX "vehicle_events_type_createdAt_idx" ON "vehicle_events"("type", "createdAt");

-- AddForeignKey
ALTER TABLE "vehicle_events" ADD CONSTRAINT "vehicle_events_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
