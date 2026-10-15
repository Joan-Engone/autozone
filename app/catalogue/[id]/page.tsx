import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VehicleDetail from "@/components/catalogue/VehicleDetail";
import { INVENTORY_DATA } from "@/data/inventory";

type Props = { params: Promise<{ id: string }> };

const findVehicle = (id: string) => INVENTORY_DATA.find((v) => String(v.id) === id);

export function generateStaticParams() {
  return INVENTORY_DATA.map((v) => ({ id: String(v.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const vehicle = findVehicle(id);
  if (!vehicle) return { title: "Véhicule introuvable | Auto Zone Import & Export" };

  return {
    title: `${vehicle.name} ${vehicle.year} | Auto Zone Import & Export`,
    description: `${vehicle.name} (${vehicle.year}) : ${vehicle.engine}, ${vehicle.transmission}. Demandez votre devis.`,
    openGraph: { images: [vehicle.imageUrl] },
  };
}

export default async function VehiclePage({ params }: Props) {
  const { id } = await params;
  const vehicle = findVehicle(id);
  if (!vehicle) notFound();

  const others = INVENTORY_DATA.filter((v) => String(v.id) !== id).slice(0, 4);

  return (
    <>
      <Navbar />
      <VehicleDetail vehicle={vehicle} others={others} />
      <Footer />
    </>
  );
}