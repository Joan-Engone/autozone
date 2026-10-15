/** Call from the public site: trackVehicle(vehicle.id, "VIEW") when a vehicle page opens, "QUOTE" when "Demander un devis" is clicked. */
export function trackVehicle(vehicleId: string, type: "VIEW" | "QUOTE") {
  try {
    if (type === "VIEW") {
      // Count one view per visitor and vehicle for the whole visit
      const key = `az-viewed-${vehicleId}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    }
    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicleId, type }),
      keepalive: true,
    });
  } catch {
    /* ignore */
  }
}