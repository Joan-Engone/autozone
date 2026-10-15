"use server";

import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

type FormState = {
  error?: string;
  success?: string;
};

type VehicleStatus = "AVAILABLE" | "RESERVED" | "SOLD";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function getSellerId(): Promise<string> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized. Please sign in.");
  }

  return session.user.id;
}

async function uploadVehicleImage(file: File): Promise<string> {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Choisissez une image JPG, PNG ou WebP.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("L'image ne doit pas dépasser 5 Mo.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "autozone/vehicles",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          console.error("Cloudinary upload failed:", error);
          reject(new Error("Impossible de téléverser l'image."));
          return;
        }

        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
}

// Create a vehicle listing and upload its image.
export async function createVehicle(
  _previousState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const sellerId = await getSellerId();

    const title = String(formData.get("title") ?? "").trim();
    const brand = String(formData.get("brand") ?? "").trim();
    const model = String(formData.get("model") ?? "").trim();

    const year = Number(formData.get("year"));
    const price = Number(formData.get("price"));
    const mileageValue = formData.get("mileage");

    const mileage =
      mileageValue !== null && String(mileageValue).trim() !== ""
        ? Number(mileageValue)
        : null;

    const fuel = String(formData.get("fuel") ?? "").trim() || null;
    const transmission =
      String(formData.get("transmission") ?? "").trim() || null;
    const origin = String(formData.get("origin") ?? "").trim() || null;
    const description =
      String(formData.get("description") ?? "").trim() || null;

    if (!title || !brand || !model) {
      return { error: "Veuillez remplir les champs obligatoires." };
    }

    if (
      !Number.isInteger(year) ||
      year < 1886 ||
      year > new Date().getFullYear() + 1
    ) {
      return { error: "L'année du véhicule est invalide." };
    }

    if (!Number.isSafeInteger(price) || price <= 0) {
      return { error: "Le prix doit être un nombre entier positif." };
    }

    if (
      mileage !== null &&
      (!Number.isSafeInteger(mileage) || mileage < 0)
    ) {
      return { error: "Le kilométrage est invalide." };
    }

    const image = formData.get("image");
    let imageUrl: string | null = null;

    if (image instanceof File && image.size > 0) {
      imageUrl = await uploadVehicleImage(image);
    }

    await prisma.vehicle.create({
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
        description,
        imageUrl,
        sellerId,
      },
    });

    revalidatePath("/seller/vehicles");
    revalidatePath("/seller");

    return {
      success: "Votre véhicule a été publié avec succès !",
    };
  } catch (error) {
    console.error("createVehicle failed:", error);

    return {
      error:
        error instanceof Error &&
        error.message !== "Unauthorized. Please sign in."
          ? error.message
          : "Impossible de publier l'annonce. Vérifiez votre connexion et réessayez.",
    };
  }
}

// Delete a vehicle belonging to the authenticated seller.
export async function deleteVehicle(vehicleId: string) {
  const sellerId = await getSellerId();

  if (!vehicleId?.trim()) {
    throw new Error("Identifiant du véhicule invalide.");
  }

  const vehicle = await prisma.vehicle.findFirst({
    where: {
      id: vehicleId,
      sellerId,
    },
    select: {
      id: true,
      _count: {
        select: {
          orders: true,
        },
      },
    },
  });

  if (!vehicle) {
    throw new Error("Véhicule introuvable ou accès refusé.");
  }

  if (vehicle._count.orders > 0) {
    throw new Error(
      "Impossible de supprimer un véhicule associé à des commandes."
    );
  }

  await prisma.vehicle.delete({
    where: {
      id: vehicle.id,
    },
  });

  revalidatePath("/seller/vehicles");
  revalidatePath("/seller");

  return { success: true };
}

// Update the status of a vehicle belonging to the authenticated seller.
export async function setVehicleStatus(
  vehicleId: string,
  status: VehicleStatus
) {
  const sellerId = await getSellerId();

  if (!vehicleId?.trim()) {
    throw new Error("Identifiant du véhicule invalide.");
  }

  if (!["AVAILABLE", "RESERVED", "SOLD"].includes(status)) {
    throw new Error("Statut de véhicule invalide.");
  }

  const result = await prisma.vehicle.updateMany({
    where: {
      id: vehicleId,
      sellerId,
    },
    data: {
      status,
    },
  });

  if (result.count === 0) {
    throw new Error("Véhicule introuvable ou accès refusé.");
  }

  revalidatePath("/seller/vehicles");
  revalidatePath("/seller");

  return { success: true };
}