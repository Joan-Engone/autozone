"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";

import PasswordInput from "@/components/auth/PasswordInput";
import { authClient, signIn } from "@/lib/auth/client";
import { homeForRole } from "@/lib/routes";

interface FieldErrors {
  email?: string;
  password?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};

    if (!email.trim()) {
      next.email = "Saisissez votre adresse e-mail.";
    } else if (!EMAIL_RE.test(email.trim())) {
      next.email = "Cette adresse e-mail n'est pas valide.";
    }

    if (!password) {
      next.password = "Saisissez votre mot de passe.";
    }

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
      const { error } = await signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        setFormError(
          error.code === "INVALID_EMAIL_OR_PASSWORD"
            ? "E-mail ou mot de passe incorrect."
            : "Connexion impossible. Réessayez."
        );
        return;
      }

      // Retrieve the authenticated user's session and role.
      const sessionResult = await authClient.getSession();

      if (sessionResult.error || !sessionResult.data?.user) {
        setFormError(
          "Connexion réussie, mais impossible de récupérer votre session. Actualisez la page."
        );
        return;
      }

      const role = sessionResult.data.user.role;
      const destination = homeForRole(role);

      router.replace(destination);
      router.refresh();
    } catch {
      setFormError(
        "Connexion impossible. Vérifiez votre connexion et réessayez."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full border bg-white px-4 py-4 text-sm text-black placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]";

  return (
    <main className="grid min-h-[calc(100vh-6rem)] md:grid-cols-2">
      {/* Brand panel */}
      <section className="hidden flex-col justify-between bg-black p-14 text-white md:flex">
        <p className="text-2xl font-black italic leading-none tracking-tighter text-[#D80005]">
          AUTO ZONE
        </p>

        <div className="max-w-md">
          <h1 className="text-4xl font-black leading-tight tracking-tight">
            Suivez vos véhicules, de l&apos;achat à la livraison.
          </h1>

          <p className="mt-6 text-sm leading-relaxed text-gray-300">
            Connectez-vous pour consulter vos commandes, vos devis et
            l&apos;état de vos expéditions.
          </p>
        </div>

        <p className="text-xs text-gray-500">
          Import &amp; Export de véhicules
        </p>
      </section>

      {/* Login form */}
      <section className="flex items-center justify-center px-6 py-16">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="w-full max-w-md"
        >
          <h2 className="text-3xl font-black tracking-tight text-black">
            Connexion
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Accédez à votre espace Auto Zone.
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

          {/* Email */}
          <div className="mt-8">
            <label
              htmlFor="email"
              className="mb-2 block text-[13px] font-bold text-black"
            >
              Adresse e-mail
            </label>

            <input
              id="email"
              name="email"
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
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-[13px] font-bold text-black"
              >
                Mot de passe
              </label>

              <Link
                href="/forgot-password"
                className="text-xs font-bold text-gray-600 transition-colors hover:text-[#D80005]"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <PasswordInput
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              hasError={!!errors.password}
              aria-describedby={
                errors.password ? "password-error" : undefined
              }
            />

            {errors.password && (
              <p
                id="password-error"
                className="mt-2 text-xs text-[#D80005]"
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-2 bg-[#D80005] px-8 py-4 text-[13px] font-bold uppercase text-white transition-all duration-300 hover:bg-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}

            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>

          <p className="mt-8 text-center text-sm text-gray-600">
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="font-bold text-black transition-colors hover:text-[#D80005]"
            >
              Créer un compte
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}