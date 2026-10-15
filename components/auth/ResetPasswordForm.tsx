"use client";
import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import FormField from "@/components/auth/FormField";
import PasswordInput from "@/components/auth/PasswordInput";
import ButtonLink from "@/components/ui/ButtonLink";
import { authClient } from "@/lib/auth/client";
import { authErrorMessage } from "@/lib/auth/errors";
import { ROUTES } from "@/lib/routes";

interface FieldErrors {
  password?: string;
  confirm?: string;
}

export default function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token");
  const linkIsBad = !token || params.get("error") === "INVALID_TOKEN";

  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);

  if (linkIsBad) {
    return (
      <div className="w-full max-w-md text-center">
        <AlertCircle size={40} className="mx-auto text-[#D80005]" />
        <h1 className="mt-6 text-3xl font-black tracking-tight text-black">Lien invalide ou expiré</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          Ce lien ne fonctionne plus. Les liens sont valables 1 heure et ne s&apos;utilisent qu&apos;une fois.
        </p>
        <ButtonLink href={ROUTES.forgotPassword} className="mt-8">
          Demander un nouveau lien
        </ButtonLink>
      </div>
    );
  }

  if (done) {
    return (
      <div className="w-full max-w-md text-center">
        <CheckCircle2 size={40} className="mx-auto text-[#D80005]" />
        <h1 className="mt-6 text-3xl font-black tracking-tight text-black">Mot de passe modifié</h1>
        <p className="mt-3 text-sm text-gray-600">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
        <ButtonLink href={ROUTES.login} className="mt-8">
          Se connecter
        </ButtonLink>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    const found: FieldErrors = {};
    if (!password) found.password = "Choisissez un mot de passe.";
    else if (password.length < 8) found.password = "Le mot de passe contient au moins 8 caractères.";
    if (!confirm) found.confirm = "Confirmez votre mot de passe.";
    else if (confirm !== password) found.confirm = "Les deux mots de passe sont différents.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    try {
      const { error } = await authClient.resetPassword({ newPassword: password, token: token! });
      if (error) {
        setFormError(authErrorMessage(error, "Impossible de modifier le mot de passe. Réessayez."));
        return;
      }
      setDone(true);
    } catch {
      setFormError("Impossible de modifier le mot de passe. Vérifiez votre connexion internet et réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-md">
      <h1 className="text-3xl font-black tracking-tight text-black">Nouveau mot de passe</h1>
      <p className="mt-2 text-sm text-gray-600">Choisissez un mot de passe d&apos;au moins 8 caractères.</p>

      {formError && (
        <div role="alert" className="mt-6 flex gap-3 border border-[#D80005] bg-red-50 p-4 text-sm text-[#D80005]">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>
            {formError}{" "}
            <Link href={ROUTES.forgotPassword} className="font-bold underline underline-offset-2">
              Demander un nouveau lien
            </Link>
          </span>
        </div>
      )}

      <div className="mt-8 space-y-6">
        <FormField id="password" label="Nouveau mot de passe" error={errors.password}>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby={errors.password ? "password-error" : undefined}
            hasError={!!errors.password}
          />
        </FormField>

        <FormField id="confirm" label="Confirmer le mot de passe" error={errors.confirm}>
          <PasswordInput
            id="confirm"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            aria-describedby={errors.confirm ? "confirm-error" : undefined}
            hasError={!!errors.confirm}
          />
        </FormField>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-8 flex w-full items-center justify-center gap-2 bg-[#D80005] px-8 py-4 text-[13px] font-bold uppercase text-white transition-all duration-300 hover:bg-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "Enregistrement" : "Enregistrer le mot de passe"}
      </button>
    </form>
  );
}