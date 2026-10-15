"use client";
import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Loader2, MailCheck } from "lucide-react";
import FormField from "@/components/auth/FormField";
import { authClient } from "@/lib/auth/client";
import { authErrorMessage } from "@/lib/auth/errors";
import { ROUTES } from "@/lib/routes";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [formError, setFormError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    if (!email.trim()) return setEmailError("Saisissez votre adresse e-mail.");
    if (!EMAIL_RE.test(email.trim())) return setEmailError("Cette adresse e-mail n'est pas valide.");
    setEmailError("");

    setLoading(true);
    try {
      const { error } = await authClient.requestPasswordReset({
        email: email.trim(),
        redirectTo: `${window.location.origin}${ROUTES.resetPassword}`,
      });
      if (error?.status === 429) {
        setFormError(authErrorMessage(error, "Trop de tentatives. Réessayez plus tard."));
        return;
      }
      // Same message whether or not the account exists, so nobody can test which e-mails are registered.
      setSent(true);
    } catch {
      setFormError("Envoi impossible. Vérifiez votre connexion internet et réessayez.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="w-full max-w-md text-center">
        <MailCheck size={40} className="mx-auto text-[#D80005]" />
        <h1 className="mt-6 text-3xl font-black tracking-tight text-black">Vérifiez votre boîte mail</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          Si un compte existe avec l&apos;adresse <strong className="text-black">{email.trim()}</strong>, vous
          recevrez un lien pour choisir un nouveau mot de passe. Il est valable 1 heure.
        </p>
        <p className="mt-2 text-xs text-gray-500">Pensez à regarder dans vos courriers indésirables.</p>
        <Link
          href={ROUTES.login}
          className="mt-8 inline-block text-sm font-bold text-black underline underline-offset-4 hover:text-[#D80005] transition-colors"
        >
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-md">
      <Link
        href={ROUTES.login}
        className="mb-8 inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#D80005] transition-colors"
      >
        <ArrowLeft size={14} />
        Retour à la connexion
      </Link>

      <h1 className="text-3xl font-black tracking-tight text-black">Mot de passe oublié</h1>
      <p className="mt-2 text-sm text-gray-600">
        Saisissez votre adresse e-mail. Nous vous envoyons un lien pour choisir un nouveau mot de passe.
      </p>

      {formError && (
        <div role="alert" className="mt-6 flex gap-3 border border-[#D80005] bg-red-50 p-4 text-sm text-[#D80005]">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <div className="mt-8">
        <FormField id="email" label="Adresse e-mail" error={emailError}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "email-error" : undefined}
            placeholder="vous@exemple.com"
            className={`w-full border bg-white px-4 py-4 text-sm text-black placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] ${
              emailError ? "border-[#D80005]" : "border-gray-300"
            }`}
          />
        </FormField>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-8 flex w-full items-center justify-center gap-2 bg-[#D80005] px-8 py-4 text-[13px] font-bold uppercase text-white transition-all duration-300 hover:bg-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "Envoi en cours" : "Envoyer le lien"}
      </button>
    </form>
  );
}