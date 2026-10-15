"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { createAdminAccount } from "@/app/admin/actions";

const field =
  "w-full border border-gray-300 bg-white px-4 py-3.5 text-sm text-black outline-none transition focus:border-black focus:ring-2 focus:ring-[#D80005]";

export default function AdminRegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sending, setSending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setSending(true);

    try {
      const result = await createAdminAccount({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      setSuccess("Le compte administrateur a été créé.");

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      router.refresh();
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
        <div className="flex h-11 w-11 items-center justify-center bg-red-50 text-[#D80005]">
          <ShieldCheck size={22} aria-hidden="true" />
        </div>

        <div>
          <h2 className="font-bold text-black">
            Administrator details
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Create a new privileged account
          </p>
        </div>
      </div>

      <div>
        <label
          htmlFor="admin-name"
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          Full name
        </label>

        <input
          id="admin-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={100}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Administrator name"
          className={field}
        />
      </div>

      <div>
        <label
          htmlFor="admin-email"
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          Email address
        </label>

        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@example.com"
          className={field}
        />
      </div>

      <div>
        <label
          htmlFor="admin-password"
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          Password
        </label>

        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 8 characters"
          className={field}
        />
      </div>

      <div>
        <label
          htmlFor="admin-confirm-password"
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          Confirm password
        </label>

        <input
          id="admin-confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Re-enter your password"
          className={field}
        />
      </div>

      {error && (
        <div
          role="alert"
          className="flex gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex gap-3 border border-green-200 bg-green-50 p-4 text-sm text-green-800"
        >
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <span>{success}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={sending}
        className="inline-flex w-full items-center justify-center gap-3 bg-[#D80005] px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2"
      >
        {sending ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Creating account...
          </>
        ) : (
          "Create administrator"
        )}
      </button>

      <p className="text-xs leading-5 text-gray-500">
        Administrator accounts have elevated permissions. Only create
        accounts for trusted individuals.
      </p>
    </form>
  );
}