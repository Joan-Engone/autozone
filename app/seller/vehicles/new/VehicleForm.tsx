"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  UploadCloud,
  X,
  XCircle,
} from "lucide-react";
import { createVehicle } from "./actions";

const input =
  "w-full border border-gray-300 bg-white px-4 py-3.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]";

const label = "mb-2 block text-[13px] font-bold text-black";

type FormState = {
  error?: string;
  success?: string;
};

type Toast = {
  type: "success" | "error";
  message: string;
  id: number;
};

export default function VehicleForm() {
  const [state, formAction, pending] = useActionState(
    createVehicle,
    {} as FormState
  );

  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const toastIdRef = useRef(0);
  const previousStateRef = useRef<FormState>({});

  // Show a popup when the server action returns a new result.
  useEffect(() => {
    const previousState = previousStateRef.current;

    if (state.success && state.success !== previousState.success) {
      setToast({
        type: "success",
        message: state.success,
        id: ++toastIdRef.current,
      });

      // Reset the form only after successful publication.
      formRef.current?.reset();
      setPreview(null);
      setFileName("");
    } else if (state.error && state.error !== previousState.error) {
      setToast({
        type: "error",
        message: state.error,
        id: ++toastIdRef.current,
      });
    }

    previousStateRef.current = state;
  }, [state]);

  // Automatically dismiss the popup after 5 seconds.
  useEffect(() => {
    if (!toast) return;

    const toastId = toast.id;

    const timeout = window.setTimeout(() => {
      setToast((current) =>
        current?.id === toastId ? null : current
      );
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  // Clean up the temporary image preview URL.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      setPreview(null);
      setFileName("");
      return;
    }

    if (preview) URL.revokeObjectURL(preview);

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      event.target.value = "";
      setPreview(null);
      setFileName("");

      setToast({
        type: "error",
        message: "Choisissez une image JPG, PNG ou WebP.",
        id: ++toastIdRef.current,
      });

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      event.target.value = "";
      setPreview(null);
      setFileName("");

      setToast({
        type: "error",
        message: "L'image ne doit pas dépasser 5 Mo.",
        id: ++toastIdRef.current,
      });

      return;
    }

    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
  }

  function removeImage() {
    const fileInput = document.getElementById(
      "image"
    ) as HTMLInputElement | null;

    if (fileInput) fileInput.value = "";

    if (preview) URL.revokeObjectURL(preview);

    setPreview(null);
    setFileName("");
  }

  return (
    <>
      {/* Toast notification */}
      {toast && (
        <div
          key={toast.id}
          role={toast.type === "error" ? "alert" : "status"}
          aria-live={toast.type === "error" ? "assertive" : "polite"}
          className={`fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-md items-start gap-3 border bg-white p-4 shadow-xl sm:right-6 sm:top-6 ${
            toast.type === "success"
              ? "border-green-200"
              : "border-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2
              size={23}
              className="mt-0.5 shrink-0 text-green-600"
            />
          ) : (
            <XCircle
              size={23}
              className="mt-0.5 shrink-0 text-[#D80005]"
            />
          )}

          <div className="min-w-0 flex-1">
            <p className="font-bold text-black">
              {toast.type === "success"
                ? "Publication réussie"
                : "Échec de la publication"}
            </p>

            <p className="mt-1 break-words text-sm leading-5 text-gray-600">
              {toast.message}
            </p>

            {toast.type === "success" && (
              <Link
                href="/seller/vehicles"
                className="mt-2 inline-block text-sm font-bold text-[#D80005] underline underline-offset-4 hover:text-black"
              >
                Voir mes véhicules
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Fermer la notification"
            className="shrink-0 text-gray-400 transition hover:text-black"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <form
        ref={formRef}
        action={formAction}
        className="space-y-6"
      >
        <div>
          <label htmlFor="title" className={label}>
            Titre de l&apos;annonce *
          </label>
          <input
            id="title"
            name="title"
            required
            placeholder="Toyota Land Cruiser Prado 2019"
            className={input}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="brand" className={label}>
              Marque *
            </label>
            <input
              id="brand"
              name="brand"
              required
              placeholder="Toyota"
              className={input}
            />
          </div>

          <div>
            <label htmlFor="model" className={label}>
              Modèle *
            </label>
            <input
              id="model"
              name="model"
              required
              placeholder="Land Cruiser Prado"
              className={input}
            />
          </div>

          <div>
            <label htmlFor="year" className={label}>
              Année *
            </label>
            <input
              id="year"
              name="year"
              type="number"
              required
              min={1886}
              max={new Date().getFullYear() + 1}
              placeholder="2019"
              className={input}
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className={label}>
              Prix (FCFA) *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              required
              min={1}
              placeholder="18500000"
              className={input}
            />
          </div>

          <div>
            <label htmlFor="mileage" className={label}>
              Kilométrage (km)
            </label>
            <input
              id="mileage"
              name="mileage"
              type="number"
              min={0}
              placeholder="62000"
              className={input}
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="fuel" className={label}>
              Carburant
            </label>
            <select
              id="fuel"
              name="fuel"
              defaultValue=""
              className={input}
            >
              <option value="">Non précisé</option>
              <option value="Essence">Essence</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybride">Hybride</option>
              <option value="Électrique">Électrique</option>
            </select>
          </div>

          <div>
            <label htmlFor="transmission" className={label}>
              Boîte de vitesses
            </label>
            <select
              id="transmission"
              name="transmission"
              defaultValue=""
              className={input}
            >
              <option value="">Non précisé</option>
              <option value="Automatique">Automatique</option>
              <option value="Manuelle">Manuelle</option>
            </select>
          </div>

          <div>
            <label htmlFor="origin" className={label}>
              Pays d&apos;origine
            </label>
            <input
              id="origin"
              name="origin"
              placeholder="Japon"
              className={input}
            />
          </div>
        </div>

        <div>
          <label htmlFor="image" className={label}>
            Photo principale
          </label>

          <div className="relative">
            <input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="sr-only"
            />

            <label
              htmlFor="image"
              className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-6 text-center transition hover:border-[#D80005] hover:bg-red-50/30"
            >
              {preview ? (
                <Image
                  src={preview}
                  alt="Aperçu de la photo du véhicule"
                  width={480}
                  height={270}
                  unoptimized
                  className="max-h-56 w-auto max-w-full object-contain"
                />
              ) : (
                <>
                  <UploadCloud
                    size={30}
                    className="text-[#D80005]"
                  />
                  <span className="text-sm font-bold text-black">
                    Cliquez pour choisir une photo
                  </span>
                  <span className="text-xs text-gray-500">
                    JPG, PNG ou WebP · 5 Mo maximum
                  </span>
                </>
              )}
            </label>
          </div>

          {fileName && (
            <div className="mt-3 flex items-center justify-between gap-3 text-sm text-gray-600">
              <span className="truncate">{fileName}</span>
              <button
                type="button"
                onClick={removeImage}
                className="flex shrink-0 items-center gap-1 font-semibold text-[#D80005] hover:text-black"
              >
                <X size={16} />
                Retirer
              </button>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="description" className={label}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            className={input}
            placeholder="État, options, historique d'entretien..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-2 bg-[#D80005] px-8 py-4 text-[13px] font-bold uppercase text-white transition-all duration-300 hover:bg-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending && (
              <Loader2 size={16} className="animate-spin" />
            )}
            {pending ? "Enregistrement" : "Publier l'annonce"}
          </button>

          <Link
            href="/seller/vehicles"
            className="text-sm font-bold text-gray-600 hover:text-[#D80005]"
          >
            Annuler
          </Link>
        </div>
      </form>
    </>
  );
}