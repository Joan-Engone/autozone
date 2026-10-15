import { ClipboardCheck, FileCheck2, Search, Ship, ShoppingCart, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Service {
  icon: LucideIcon;
  title: string;
  text: string;
}

// Edit these to match what Auto Zone really offers.
export const SERVICES: Service[] = [
  { icon: Search, title: "Recherche sur mesure", text: "Vous nous donnez la marque, le modèle et votre budget. Nous cherchons le véhicule chez nos vendeurs à l'étranger." },
  { icon: ShoppingCart, title: "Achat de véhicule", text: "Nous achetons le véhicule choisi dans le catalogue ou trouvé pour vous, et négocions le prix." },
  { icon: ClipboardCheck, title: "Contrôle avant achat", text: "Le véhicule est vérifié avant le paiement: état général, kilométrage et papiers." },
  { icon: Ship, title: "Expédition", text: "Nous organisons le transport maritime et vous informons à chaque étape du voyage." },
  { icon: FileCheck2, title: "Dédouanement", text: "Nous préparons les documents et réglons les formalités à l'arrivée du véhicule." },
  { icon: Truck, title: "Livraison", text: "Le véhicule vous est remis avec ses papiers, prêt à rouler." },
];