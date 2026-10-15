"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import PasswordInput from "@/components/auth/PasswordInput";
import { signUp } from "@/lib/auth/client";
import { becomeSeller } from "@/app/actions/account";

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

type AccountType = "client" | "seller";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8; // Better Auth's default minimum

const ACCOUNT_TYPES: { value: AccountType; title: string; text: string }[] = [
  { value: "client", title: "Acheteur", text: "J'achète des véhicules et je suis mes commandes." },
  { value: "seller", title: "Vendeur", text: "Je vends des véhicules et je suis mes ventes." },
];

export default function RegisterForm() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>("client");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};

    if (!name.trim()) next.name = "Saisissez votre nom.";

    if (!email.trim()) next.email = "Saisissez votre adresse e-mail.";
    else if (!EMAIL_RE.test(email.trim()))
      next.email = "Cette adresse e-mail n'est pas valide.";

    if (!password) next.password = "Saisissez votre mot de passe.";
    else if (password.length < MIN_PASSWORD)
      next.password = `Le mot de passe doit contenir au moins ${MIN_PASSWORD} caractères.`;

    if (!confirmPassword) next.confirmPassword = "Confirmez votre mot de passe.";
    else if (confirmPassword !== password)
      next.confirmPassword = "Les mots de passe ne correspondent pas.";

    return next;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    try {
      const { error } = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      if (error) {
        setFormError(
          error.code?.startsWith("USER_ALREADY_EXISTS")
            ? "Un compte existe déjà avec cette adresse e-mail."
            : "Inscription impossible. Réessayez."
        );
        return;
      }

      if (accountType === "seller") {
        await becomeSeller();
        // Full reload so the navbar picks up the new role
        window.location.assign("/seller");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setFormError("Inscription impossible. Vérifiez votre connexion et réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full border bg-white px-4 py-4 text-sm text-black placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]";

  return (
    <main className="min-h-[calc(100vh-6rem)] grid md:grid-cols-2">
      {/* Brand panel */}
      <section className="hidden md:flex flex-col justify-between bg-black text-white p-14">
        <p className="font-black text-2xl tracking-tighter text-[#D80005] italic leading-none">
          AUTO ZONE
        </p>
        <div className="max-w-md">
          <h1 className="text-4xl font-black leading-tight tracking-tight">
            Créez votre compte et suivez vos véhicules.
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-gray-300">
            Inscrivez-vous pour consulter vos commandes, vos devis et
            l&apos;état de vos expéditions.
          </p>
        </div>
        <p className="text-xs text-gray-500">Import &amp; Export de véhicules</p>
      </section>

      {/* Form */}
      <section className="flex items-center justify-center px-6 py-16">
        <form onSubmit={handleSubmit} noValidate className="w-full max-w-md">
          <h2 className="text-3xl font-black tracking-tight text-black">
            Inscription
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Créez votre espace Auto Zone en quelques secondes.
          </p>

          {formError && (
            <div
              role="alert"
              className="mt-6 flex gap-3 border border-[#D80005] bg-red-50 p-4 text-sm text-[#D80005]"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Account type */}
          <fieldset className="mt-8">
            <legend className="mb-2 block text-[13px] font-bold text-black">
              Je souhaite
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {ACCOUNT_TYPES.map((t) => {
                const selected = accountType === t.value;
                return (
                  <label
                    key={t.value}
                    className={`cursor-pointer border p-4 transition-colors ${
                      selected
                        ? "border-[#D80005] bg-red-50"
                        : "border-gray-300 hover:border-black"
                    }`}
                  >
                    <input
                      type="radio"
                      name="accountType"
                      value={t.value}
                      checked={selected}
                      onChange={() => setAccountType(t.value)}
                      className="sr-only"
                    />
                    <span className="block text-sm font-black text-black">{t.title}</span>
                    <span className="mt-1 block text-xs leading-snug text-gray-600">
                      {t.text}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Name */}
          <div className="mt-6">
            <label
              htmlFor="name"
              className="mb-2 block text-[13px] font-bold text-black"
            >
              Nom complet
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              placeholder="Jean Mba"
              className={`${inputBase} ${
                errors.name ? "border-[#D80005]" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p id="name-error" className="mt-2 text-xs text-[#D80005]">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mt-6">
            <label
              htmlFor="email"
              className="mb-2 block text-[13px] font-bold text-black"
            >
              Adresse e-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              placeholder="vous@exemple.com"
              className={`${inputBase} ${
                errors.email ? "border-[#D80005]" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p id="email-error" className="mt-2 text-xs text-[#D80005]">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mt-6">
            <label
              htmlFor="password"
              className="mb-2 block text-[13px] font-bold text-black"
            >
              Mot de passe
            </label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              hasError={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p id="password-error" className="mt-2 text-xs text-[#D80005]">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mt-6">
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-[13px] font-bold text-black"
            >
              Confirmer le mot de passe
            </label>
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              hasError={!!errors.confirmPassword}
              aria-describedby={
                errors.confirmPassword ? "confirm-password-error" : undefined
              }
            />
            {errors.confirmPassword && (
              <p
                id="confirm-password-error"
                className="mt-2 text-xs text-[#D80005]"
              >
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-2 bg-[#D80005] px-8 py-4 text-[13px] font-bold uppercase text-white transition-all duration-300 hover:bg-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Inscription en cours" : "Créer mon compte"}
          </button>

          <p className="mt-8 text-center text-sm text-gray-600">
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="font-bold text-black hover:text-[#D80005] transition-colors"
            >
              Se connecter
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}