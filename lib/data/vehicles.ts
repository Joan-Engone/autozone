export type Origin = "Japon" | "Corée du Sud" | "Europe" | "États-Unis";
export type Fuel = "Essence" | "Diesel" | "Hybride";
export type Transmission = "Automatique" | "Manuelle";
export type Status = "En stock" | "En transit";

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number; // FCFA
  mileage: number; // km
  fuel: Fuel;
  transmission: Transmission;
  origin: Origin;
  status: Status;
}

export const ORIGINS: Origin[] = ["Japon", "Corée du Sud", "Europe", "États-Unis"];
export const FUELS: Fuel[] = ["Essence", "Diesel", "Hybride"];
export const TRANSMISSIONS: Transmission[] = ["Automatique", "Manuelle"];


// Sample data: replace with your real inventory (API, Firebase, Prisma...).
export const VEHICLES: Vehicle[] = [
  { id: 1, make: "Toyota", model: "Land Cruiser Prado", year: 2019, price: 28500000, mileage: 62000, fuel: "Diesel", transmission: "Automatique", origin: "Japon", status: "En stock" },
  { id: 2, make: "Toyota", model: "Corolla", year: 2020, price: 9800000, mileage: 48000, fuel: "Essence", transmission: "Automatique", origin: "Japon", status: "En stock" },
  { id: 3, make: "Hyundai", model: "Tucson", year: 2021, price: 14200000, mileage: 35000, fuel: "Essence", transmission: "Automatique", origin: "Corée du Sud", status: "En transit" },
  { id: 4, make: "Kia", model: "Sportage", year: 2020, price: 13500000, mileage: 51000, fuel: "Diesel", transmission: "Automatique", origin: "Corée du Sud", status: "En stock" },
  { id: 5, make: "Peugeot", model: "3008", year: 2019, price: 12900000, mileage: 70000, fuel: "Diesel", transmission: "Automatique", origin: "Europe", status: "En stock" },
  { id: 6, make: "Volkswagen", model: "Golf 7", year: 2018, price: 8700000, mileage: 88000, fuel: "Essence", transmission: "Manuelle", origin: "Europe", status: "En transit" },
  { id: 7, make: "Ford", model: "F-150", year: 2018, price: 24000000, mileage: 90000, fuel: "Essence", transmission: "Automatique", origin: "États-Unis", status: "En stock" },
  { id: 8, make: "Toyota", model: "RAV4 Hybrid", year: 2021, price: 19800000, mileage: 29000, fuel: "Hybride", transmission: "Automatique", origin: "Japon", status: "En transit" },
  { id: 9, make: "Mercedes-Benz", model: "Classe C", year: 2019, price: 17500000, mileage: 66000, fuel: "Diesel", transmission: "Automatique", origin: "Europe", status: "En stock" },
];