"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ImagePlus, Loader2, Star, X } from "lucide-react";
import { FUELS, ORIGINS, TRANSMISSIONS } from "@/lib/data/vehicles";

const MAX_PHOTOS = 6;
const MAX_BYTES = 5 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

interface Photo {
  id: string;
  file: File;
  url: string;
}

// Field names match the Vehicle model in schema.prisma
interface Values {
  title: string;
  brand: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  fuel: string;
  transmission: string;
  origin: string;
  description: string;
}

const input =
  "w-full border bg-white px-4 py-3.5 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]";
const label = "mb-2 block text-[13px] font-bold text-black";

export default function VehicleForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoError, setPhotoError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [titleEdited, setTitleEdited] = useState(false);
  const [values, setValues] = useState<Values>({
    title: "",
    brand: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    fuel: "",
    transmission: "",
    origin: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [sending, setSending] = useState(false);

  // Free the previews when leaving the page
  const photosRef = useRef(photos);
  photosRef.current = photos;
  useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.url)), []);

  const set =
    (key: keyof Values) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setValues((v) => {
        const next = { ...v, [key]: value };
        // The title writes itself from brand, model and year until the seller edits it
        if (!titleEdited && (key === "brand" || key === "model" || key === "year")) {
          next.title = [next.brand, next.model, next.year].map((s) => s.trim()).filter(Boolean).join(" ");
        }
        return next;
      });
    };

  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Emptying the field gives control back to the automatic title
    setTitleEdited(e.target.value !== "");
    setValues((v) => ({ ...v, title: e.target.value }));
  };

  const addFiles = (list: FileList | File[]) => {
    setPhotoError("");
    const incoming = Array.from(list);
    const accepted: Photo[] = [];
    let message = "";

    for (const file of incoming) {
      if (!TYPES.includes(file.type)) message = "Seuls les formats JPG, PNG et WebP sont acceptés.";
      else if (file.size > MAX_BYTES) message = "Chaque photo doit faire 5 Mo au maximum.";
      else if (photos.length + accepted.length >= MAX_PHOTOS) message = `Vous pouvez ajouter ${MAX_PHOTOS} photos au maximum.`;
      else accepted.push({ id: `${file.name}-${file.size}-${Math.random()}`, file, url: URL.createObjectURL(file) });
    }
    if (message) setPhotoError(message);
    if (accepted.length) setPhotos((p) => [...p, ...accepted]);
  };

  const removePhoto = (id: string) =>
    setPhotos((list) => {
      const target = list.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return list.filter((p) => p.id !== id);
    });

  const makeCover = (id: string) =>
    setPhotos((list) => {
      const target = list.find((p) => p.id === id);
      return target ? [target, ...list.filter((p) => p.id !== id)] : list;
    });

  const validate = () => {
    const next: Record<string, string> = {};
    const year = Number(values.year);
    if (values.brand.trim().length < 2) next.brand = "Saisissez la marque.";
    if (!values.model.trim()) next.model = "Saisissez le modèle.";
    if (values.title.trim().length < 5) next.title = "Saisissez le titre de l'annonce (5 caractères minimum).";
    if (!Number.isInteger(year) || year < 1980 || year > new Date().getFullYear() + 1) next.year = "Année invalide.";
    if (!(Number(values.price) > 0)) next.price = "Saisissez le prix.";
    if (values.mileage === "" || Number(values.mileage) < 0) next.mileage = "Saisissez le kilométrage.";
    if (!values.fuel) next.fuel = "Choisissez le carburant.";
    if (!values.transmission) next.transmission = "Choisissez la boîte.";
    if (!values.origin) next.origin = "Choisissez la provenance.";
    if (photos.length === 0) next.photos = "Ajoutez au moins une photo.";
    return next;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.getElementById(`field-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setSending(true);
    try {
      const body = new FormData();
      Object.entries(values).forEach(([k, v]) => body.append(k, v.trim()));
      photos.forEach((p) => body.append("photos", p.file));

      const response = await fetch("/api/seller/vehicles", { method: "POST", body });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setFormError(data?.error ?? "Le véhicule n'a pas pu être enregistré. Réessayez.");
        setSending(false);
        return;
      }
      router.push("/seller/vehicles?added=1");
      router.refresh();
    } catch {
      setFormError("Connexion impossible. Vérifiez votre réseau et réessayez.");
      setSending(false);
    }
  };

  const fieldClass = (key: string) => `${input} ${errors[key] ? "border-[#D80005]" : "border-gray-300"}`;
  const Err = ({ k }: { k: string }) =>
    errors[k] ? (
      <p id={`error-${k}`} className="mt-2 text-xs text-[#D80005]">
        {errors[k]}
      </p>
    ) : null;
  const a11y = (k: string) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `error-${k}` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 space-y-10">
      {/* Photos */}
      <section className="border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-black uppercase tracking-tight text-black">1. Photos</h2>
        <p className="mt-1 text-sm text-gray-600">
          Ajoutez l&apos;avant, l&apos;arrière, les côtés et l&apos;intérieur. La première photo est la photo principale.
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          className={`mt-5 flex flex-col items-center justify-center border-2 border-dashed px-6 py-10 text-center transition-colors ${
            dragging ? "border-[#D80005] bg-red-50" : errors.photos ? "border-[#D80005]" : "border-gray-300"
          }`}
        >
          <ImagePlus size={32} className="text-gray-400" aria-hidden="true" />
          <p className="mt-3 text-sm text-gray-600">Glissez vos photos ici ou</p>
          <button
            id="field-photos"
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mt-3 border-2 border-black px-6 py-2.5 text-[13px] font-bold uppercase tracking-wider text-black transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2"
          >
            Choisir des photos
          </button>
          <p className="mt-3 text-xs text-gray-400">JPG, PNG ou WebP · 5 Mo maximum par photo · {MAX_PHOTOS} photos maximum</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            tabIndex={-1}
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
        {(photoError || errors.photos) && (
          <p role="alert" className="mt-3 text-xs text-[#D80005]">{photoError || errors.photos}</p>
        )}

        {photos.length > 0 && (
          <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {photos.map((p, i) => (
              <li key={p.id} className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                {i === 0 && (
                  <span className="absolute left-0 top-3 bg-[#D80005] px-2.5 py-1 text-[11px] font-bold text-white">Principale</span>
                )}
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/70 to-transparent p-2">
                  {i !== 0 ? (
                    <button
                      type="button"
                      onClick={() => makeCover(p.id)}
                      className="flex items-center gap-1 bg-white/90 px-2 py-1 text-[11px] font-bold text-black hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]"
                    >
                      <Star size={12} aria-hidden="true" />
                      Principale
                    </button>
                  ) : (
                    <span />
                  )}
                  <button
                    type="button"
                    onClick={() => removePhoto(p.id)}
                    aria-label={`Retirer la photo ${i + 1}`}
                    className="flex h-7 w-7 items-center justify-center bg-white/90 text-black hover:bg-[#D80005] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]"
                  >
                    <X size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Details */}
      <section className="border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-black uppercase tracking-tight text-black">2. Informations</h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="field-brand" className={label}>Marque</label>
            <input id="field-brand" value={values.brand} onChange={set("brand")} placeholder="Toyota" className={fieldClass("brand")} {...a11y("brand")} />
            <Err k="brand" />
          </div>
          <div>
            <label htmlFor="field-model" className={label}>Modèle</label>
            <input id="field-model" value={values.model} onChange={set("model")} placeholder="Land Cruiser Prado" className={fieldClass("model")} {...a11y("model")} />
            <Err k="model" />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="field-title" className={label}>Titre de l&apos;annonce</label>
            <input
              id="field-title"
              maxLength={80}
              value={values.title}
              onChange={onTitleChange}
              placeholder="Toyota Land Cruiser Prado 2020"
              className={fieldClass("title")}
              {...a11y("title")}
            />
            <p className="mt-2 text-xs text-gray-500">
              Il se remplit tout seul avec la marque, le modèle et l&apos;année. Vous pouvez le modifier.
            </p>
            <Err k="title" />
          </div>

          <div>
            <label htmlFor="field-year" className={label}>Année</label>
            <input id="field-year" type="number" inputMode="numeric" value={values.year} onChange={set("year")} placeholder="2020" className={fieldClass("year")} {...a11y("year")} />
            <Err k="year" />
          </div>
          <div>
            <label htmlFor="field-mileage" className={label}>Kilométrage (km)</label>
            <input id="field-mileage" type="number" inputMode="numeric" min={0} value={values.mileage} onChange={set("mileage")} placeholder="62000" className={fieldClass("mileage")} {...a11y("mileage")} />
            <Err k="mileage" />
          </div>
          <div>
            <label htmlFor="field-fuel" className={label}>Carburant</label>
            <select id="field-fuel" value={values.fuel} onChange={set("fuel")} className={fieldClass("fuel")} {...a11y("fuel")}>
              <option value="">Choisir</option>
              {FUELS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            <Err k="fuel" />
          </div>
          <div>
            <label htmlFor="field-transmission" className={label}>Boîte de vitesses</label>
            <select id="field-transmission" value={values.transmission} onChange={set("transmission")} className={fieldClass("transmission")} {...a11y("transmission")}>
              <option value="">Choisir</option>
              {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <Err k="transmission" />
          </div>
          <div>
            <label htmlFor="field-origin" className={label}>Provenance</label>
            <select id="field-origin" value={values.origin} onChange={set("origin")} className={fieldClass("origin")} {...a11y("origin")}>
              <option value="">Choisir</option>
              {ORIGINS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <Err k="origin" />
          </div>
          <div>
            <label htmlFor="field-price" className={label}>Votre prix (FCFA)</label>
            <input id="field-price" type="number" inputMode="numeric" min={0} value={values.price} onChange={set("price")} placeholder="18500000" className={fieldClass("price")} {...a11y("price")} />
            <p className="mt-2 text-xs text-gray-500">C&apos;est le montant que vous recevez. Auto Zone ajoute sa marge pour le client.</p>
            <Err k="price" />
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="field-description" className={label}>
            Description <span className="font-normal text-gray-400">(facultatif)</span>
          </label>
          <textarea
            id="field-description"
            rows={5}
            maxLength={2000}
            value={values.description}
            onChange={set("description")}
            placeholder="État général, options, historique d'entretien…"
            className={`${input} resize-y border-gray-300`}
          />
        </div>
      </section>

      {formError && (
        <div role="alert" className="flex gap-3 border border-[#D80005] bg-red-50 p-4 text-sm text-[#D80005]">
          <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{formError}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-3 bg-[#D80005] px-10 py-4 text-[13px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2"
        >
          {sending && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
          {sending ? "Publication en cours" : "Publier le véhicule"}
        </button>
        <Link href="/seller/vehicles" className="text-sm font-bold text-gray-600 hover:text-black">Annuler</Link>
      </div>
    </form>
  );
}