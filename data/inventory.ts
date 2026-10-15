export interface Vehicle {
  id: string;
  name: string;
  year: number;
  engine: string;
  transmission: string;
  price: number;
  currency: string;
  imageUrl: string;
  imageAlt: string;
}

export const INVENTORY_DATA: Vehicle[] = [
  {
    id: "mercedes-g63-amg",
    name: "Mercedes-Benz G63 AMG",
    year: 2023,
    engine: "4.0L V8",
    transmission: "Automatique",
    price: 185000,
    currency: "€",
    imageUrl:
      "/cars/amg.jpg",
    imageAlt: "Mercedes-Benz G63 AMG 2023",
  },
  {
    id: "Mercedes-Benz-E-450",
    name: "Mercedes-Benz E-450",
    year: 2019,
    engine: "5.2L V10",
    transmission: "Automatique",
    price: 35400,
    currency: "$",
    imageUrl:
      "/cars/mercedes.jpg",
    imageAlt: "MERCEDES BENZ E-450 4MATIC CABRIOLET — 2019",
  },
  {
    id: "MG-7-SPORTBACK",
    name: "MG-7 SPORTBACK",
    year: 2024,
    engine: "2,0L",
    transmission: "Automatique",
    price: 17100,
    currency: "$",
    imageUrl:
      "/cars/mg.jpg",
    imageAlt: "MG-7 SPORTBACK 2024",
  },
  {
    id: "range-rover-autobiography",
    name: "Range Rover Autobiography",
    year: 2023,
    engine: "4,4L V8",
    transmission: "Automatique",
    price: 165000,
    currency: "$",
    imageUrl:
      "/cars/range.jpg",
    imageAlt: "Range Rover Autobiography 2023",
  },
  {
    id: "range-rover-autobiography",
    name: "Range Rover Autobiography",
    year: 2023,
    engine: "4,4L V8",
    transmission: "Automatique",
    price: 165000,
    currency: "$",
    imageUrl:
      "/cars/range.jpg",
    imageAlt: "Range Rover Autobiography 2023",
  },

  {
    id: "MG-7-SPORTBACK",
    name: "MG-7 SPORTBACK",
    year: 2024,
    engine: "2,0L",
    transmission: "Automatique",
    price: 17100,
    currency: "$",
    imageUrl:
      "/cars/mg.jpg",
    imageAlt: "MG-7 SPORTBACK 2024",
  },

  {
    id: "mercedes-g63-amg",
    name: "Mercedes-Benz G63 AMG",
    year: 2023,
    engine: "4.0L V8",
    transmission: "Automatique",
    price: 185000,
    currency: "€",
    imageUrl:
      "/cars/amg.jpg",
    imageAlt: "Mercedes-Benz G63 AMG 2023",
  },

  {
    id: "Mercedes-Benz-E-450",
    name: "Mercedes-Benz E-450",
    year: 2019,
    engine: "5.2L V10",
    transmission: "Automatique",
    price: 35400,
    currency: "$",
    imageUrl:
      "/cars/mercedes.jpg",
    imageAlt: "MERCEDES BENZ E-450 4MATIC CABRIOLET — 2019",
  },
  
];