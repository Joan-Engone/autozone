import { Resend } from "resend";

interface EmailInput {
  to: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * Sends an e-mail with Resend. Without RESEND_API_KEY (local development) the
 * message is printed in the terminal instead, so you can copy the reset link.
 */
export async function sendEmail({ to, subject, text, html }: EmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`\n[email non envoyé: RESEND_API_KEY manquante]\nÀ: ${to}\nSujet: ${subject}\n${text}\n`);
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Auto Zone <onboarding@resend.dev>",
    to,
    subject,
    text,
    html,
  });
  if (error) console.error("Échec de l'envoi de l'e-mail:", error);
}

export function resetPasswordEmail(name: string, url: string) {
  const subject = "Réinitialisation de votre mot de passe Auto Zone";
  const text = `Bonjour ${name},\n\nPour choisir un nouveau mot de passe, ouvrez ce lien (valable 1 heure):\n${url}\n\nSi vous n'avez pas fait cette demande, ignorez cet e-mail.`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;color:#000">
      <p style="font-weight:900;font-style:italic;font-size:22px;color:#D80005;margin:0 0 24px">AUTO ZONE</p>
      <p>Bonjour ${name},</p>
      <p>Pour choisir un nouveau mot de passe, cliquez sur le bouton ci-dessous. Le lien est valable 1 heure.</p>
      <p style="margin:28px 0">
        <a href="${url}" style="background:#D80005;color:#fff;padding:14px 28px;text-decoration:none;font-weight:bold;text-transform:uppercase;font-size:13px">Choisir un mot de passe</a>
      </p>
      <p style="font-size:13px;color:#555">Si vous n'avez pas fait cette demande, ignorez cet e-mail: votre mot de passe ne change pas.</p>
    </div>`;
  return { subject, text, html };
}