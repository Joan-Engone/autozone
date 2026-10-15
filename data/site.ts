/* ───────────────────────────────────────────────────────────────
   ONE place for the company information.
   The footer, the contact section and the chatbot all read from here.
   Leave a value empty ("") and it simply isn't displayed.
   ─────────────────────────────────────────────────────────────── */

export const SITE = {
  name: "AUTO ZONE",
  legalName: "AutoZone Import & Export",
  description: "Import et export de véhicules premium, de la sélection à la livraison.",

  phone: "", // e.g. "+241 01 23 45 67"
  email: "", // e.g. "contact@autozone.com"
  whatsapp: "", // with country code, no "+" or spaces, e.g. "24101234567"
  address: "", // e.g. "Libreville, Gabon"
  hours: "", // e.g. "Lun - Ven : 8h - 18h"

  /** Company registration, tax number... if your country requires it to be shown. e.g. "RCCM : XX-XXXX" */
  registration: "",

  /** Payment methods you really accept, e.g. ["Virement bancaire", "Mobile Money"] */
  payments: [] as string[],

  /** Full links of your pages. Empty = the icon is hidden. */
  socials: {
    instagram: "",
    facebook: "",
  },

  /** Paths of your legal pages once they exist, e.g. "/mentions-legales". Empty = the link is hidden. */
  legal: {
    mentions: "",
    terms: "",
    privacy: "",
  },
};