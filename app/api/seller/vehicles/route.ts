import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { FUELS, ORIGINS, TRANSMISSIONS } from "@/lib/data/vehicles";
import { getSellerFromRequest } from "@/lib/seller-access";
import { MAX_IMAGES, saveImage } from "@/lib/uploads";

export const runtime = "nodejs";

const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(request: Request) {
  const user = await getSellerFromRequest(request);

  if (!user) {
    return fail("Vous devez être connecté en tant que vendeur.", 401);
  }

  if (user.role === "SELLER" || user.role === "seller") {
    const profile = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
    });

    if (profile?.status !== "APPROVED") {
      return fail("Votre compte vendeur n'est pas encore approuvé.", 403);
    }
  }

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

  // Field names match the form (components/seller/VehicleForm.tsx) and the Vehicle model
  const brand = text("brand", 60);
  const model = text("model", 60);
  const year = number("year");
  const price = number("price");
  const mileage = number("mileage");
  const fuel = text("fuel", 40);
  const transmission = text("transmission", 40);
  const origin = text("origin", 40);
  const description = text("description", 2000);

  const photos = form.getAll("photos").filter((file): file is File => file instanceof File && file.size > 0);

  if (!brand || !model) {
    return fail("La marque et le modèle sont obligatoires.");
  }

  if (!Number.isInteger(year) || year < 1900 || year > new Date().getFullYear() + 1) {
    return fail("L'année du véhicule est invalide.");
  }

  // The title is typed by the seller; if it is missing or too short, build it from the other fields
  const typedTitle = text("title", 80);
  const title = typedTitle.length >= 5 ? typedTitle : `${brand} ${model} ${year}`;

  // price is an Int in the database, so decimals are refused
  if (!Number.isInteger(price) || price <= 0) {
    return fail("Le prix du véhicule est invalide.");
  }

  if (!Number.isInteger(mileage) || mileage < 0) {
    return fail("Le kilométrage est invalide.");
  }

  if (!FUELS.includes(fuel as (typeof FUELS)[number])) {
    return fail("Le type de carburant est invalide.");
  }

  if (!TRANSMISSIONS.includes(transmission as (typeof TRANSMISSIONS)[number])) {
    return fail("La transmission est invalide.");
  }

  if (!ORIGINS.includes(origin as (typeof ORIGINS)[number])) {
    return fail("L'origine du véhicule est invalide.");
  }

  if (photos.length === 0) {
    return fail("Ajoutez au moins une photo du véhicule.");
  }

  if (photos.length > MAX_IMAGES) {
    return fail(`Vous pouvez ajouter au maximum ${MAX_IMAGES} photos.`);
  }

  const urls: string[] = [];

  for (const photo of photos) {
    const url = await saveImage(photo);

    if (!url) {
      return fail("Une photo n'est pas valide (JPG, PNG ou WebP, 5 Mo maximum).");
    }

    urls.push(url);
  }

  try {
    const vehicle = await prisma.vehicle.create({
      data: {
        title,
        brand,
        model,
        year,
        price,
        mileage,
        fuel,
        transmission,
        origin,
        description: description || null,
        imageUrl: urls[0], // cover photo
        images: urls, // all photos, cover first (needs `images String[]` in schema.prisma)
        sellerId: user.id, // always from the session, never from the form
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({ id: vehicle.id }, { status: 201 });
  } catch (error) {
    console.error("Seller: could not create the vehicle", error);

    return fail("Le véhicule n'a pas pu être enregistré. Réessayez.", 500);
  }
}