import ProductCard from "./ProductCard";
import { INVENTORY_DATA } from "@/data/inventory";

export default function Inventory() {
  return (
    <section
      id="catalogue"
      aria-labelledby="inventory-heading"
      className="py-24 lg:py-[100px] bg-white"
    >
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <h2
            id="inventory-heading"
            className="text-3xl lg:text-4xl font-black uppercase text-black"
          >
            NOTRE INVENTAIRE PREMIUM
          </h2>
          <div className="h-[3px] w-12 bg-[#D80005] mx-auto mt-4 mb-4" aria-hidden />
          <p className="text-gray-500 text-sm">
            Sélectionné avec soin. Qualité assurée.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {INVENTORY_DATA.map((vehicle) => (
            <ProductCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
}