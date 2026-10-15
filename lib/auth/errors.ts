interface AuthError {
  status?: number;
  code?: string;
  message?: string;
}

/** Turns a Better Auth error into a message for the user, in French. */
export function authErrorMessage(error: AuthError, fallback: string): string {
  const code = error.code ?? "";
  if (code.includes("INVALID_EMAIL_OR_PASSWORD") || error.status === 401) {
    return "E-mail ou mot de passe incorrect.";
  }
  if (code.includes("USER_ALREADY_EXISTS")) {
    return "Un compte existe déjà avec cette adresse e-mail.";
  }
  if (code.includes("PASSWORD_TOO_SHORT")) {
    return "Le mot de passe contient au moins 8 caractères.";
  }
  if (code.includes("INVALID_TOKEN")) {
    return "Ce lien est invalide ou a expiré. Demandez-en un nouveau.";
  }
  if (error.status === 403) {
    return "Vous devez confirmer votre adresse e-mail avant de vous connecter.";
  }
  if (error.status === 429) {
    return "Trop de tentatives. Réessayez dans quelques instants.";
  }
  return fallback;
}