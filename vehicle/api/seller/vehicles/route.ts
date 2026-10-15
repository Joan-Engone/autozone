import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { FUELS, ORIGINS } from "@/lib/data/vehicles";
import { getSellerFromRequest } from "@/lib/seller-access";
import { MAX_IMAGES, saveImage } from "@/lib/uploads";

export const runtime = "nodejs";

const TRANSMISSIONS = ["Automatique", "Manuelle"];
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

// Creates a vehicle (with its photos) for the signed-in seller
export async function POST(request: Request) {
  const user = await getSellerFromRequest(request);
  if (!user) return fail("Vous devez être connecté en tant que vendeur.", 401);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("Formulaire invalide.");
  }

  const text = (key: string, max = 200) => String(form.get(key) ?? "").trim().slice(0, max);
  const number = (key: string) => {
    const value = text(key, 20);
    return value === "" ? NaN : Number(value);
  };

  const make = text("make", 60);
  const model = text("model", 60);
  const year = number("year");
  const price = number("price");
  const mileage = number("mileage");
  const fuel = text("fuel", 40);
  const transmission = text("transmission", 40);
  const origin = text("origin", 40);
  const description = text("description", 2000);
  const photos = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);

  if (make.length < 2 || model.length < 1) return fail("La marque et le modèle sont obligatoires.");
  if (!Number.isInteger(year) || year < 1980 || year > new Date().getFullYear() + 1) return fail("L'année n'est pas valide.");
  if (!Number.isInteger(price) || price <= 0) return fail("Saisissez un prix valide.");
  if (!Number.isInteger(mileage) || mileage < 0) return fail("Le kilométrage n'est pas valide.");
  if (!(FUELS as readonly string[]).includes(fuel)) return fail("Choisissez un carburant.");
  if (!TRANSMISSIONS.includes(transmission)) return fail("Choisissez une boîte de vitesses.");
  if (!(ORIGINS as readonly string[]).includes(origin)) return fail("Choisissez une provenance.");
  if (photos.length === 0) return fail("Ajoutez au moins une photo.");
  if (photos.length > MAX_IMAGES) return fail(`Vous pouvez ajouter ${MAX_IMAGES} photos au maximum.`);

  const urls: string[] = [];
  for (const photo of photos) {
    const url = await saveImage(photo);
    if (!url) return fail("Une photo n'est pas valide (JPG, PNG ou WebP, 5 Mo maximum).");
    urls.push(url);
  }

  try {
    const vehicle = await prisma.vehicle.create({
      data: {
        title: `${make} ${model}`,
        brand: make,
        model,
        year,
        price,
        mileage,
        fuel,
        transmission,
        origin,
        description: description || null,
        images: urls,
        imageUrl: urls[0],
        sellerId: user.id,
      },
    });
    return NextResponse.json({ id: vehicle.id }, { status: 201 });
  } catch (error) {
    console.error("Seller: could not create the vehicle", error);
    return fail("Le véhicule n'a pas pu être enregistré. Réessayez.", 500);
  }
}