/* ───────────────────────── Edit this file ─────────────────────────
   All the chatbot's questions and answers live here.
   Write only what Auto Zone really offers: customers read these as promises. */

/** WhatsApp number with country code, no "+" or spaces. Example: "24101234567". Leave "" to hide the button. */
export const WHATSAPP_NUMBER = "";

/** Where the "contact a person" button goes */
export const CONTACT_HREF = "/#contact";

export interface ChatLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FaqEntry {
  id: string;
  /** Shown as a quick-reply button */
  question: string;
  /** Words that trigger this answer when a visitor types freely */
  keywords: string[];
  answer: string;
  links?: ChatLink[];
}

export interface Reply {
  text: string;
  links?: ChatLink[];
}

const whatsappLink = (): ChatLink[] =>
  WHATSAPP_NUMBER
    ? [
        {
          label: "WhatsApp",
          href: `https://wa.me/${WHATSAPP_NUMBER}`,
          external: true,
        },
      ]
    : [];

export const FAQ: FaqEntry[] = [
  {
    id: "commander",
    question: "Comment commander un véhicule ?",
    keywords: ["commander", "commande", "acheter", "achat", "comment acheter", "passer commande", "etapes", "fonctionne"],
    answer:
      "C'est simple :\n1. Choisissez un véhicule dans le catalogue, ou décrivez-nous celui que vous cherchez.\n2. Vous recevez un devis détaillé et vous validez votre commande.\n3. Nous gérons l'expédition et le dédouanement.\n4. Votre véhicule vous est livré.",
    links: [{ label: "Voir le catalogue", href: "/catalogue" }],
  },
  {
    id: "services",
    question: "Quels services proposez-vous ?",
    keywords: ["service", "services", "proposez", "proposer", "offrez", "faites", "import", "importer", "export", "exporter"],
    answer:
      "Nous proposons l'import et l'export de véhicules, l'expédition et le dédouanement, l'inspection avant achat et des solutions de financement.",
    links: [{ label: "Nos services", href: "/services" }],
  },
  {
    id: "delai",
    question: "Quel est le délai de livraison ?",
    keywords: ["delai", "delais", "livraison", "livrer", "livre", "combien de temps", "duree", "quand", "arrive", "recevoir"],
    answer:
      "Le délai dépend du véhicule, du pays de départ et de votre destination. Contactez un conseiller : il vous donnera une estimation précise pour votre cas.",
    links: [{ label: "Contacter un conseiller", href: CONTACT_HREF }, ...whatsappLink()],
  },
  {
    id: "prix",
    question: "Quels sont les frais et les taxes ?",
    keywords: ["prix", "cout", "couts", "frais", "tarif", "tarifs", "combien coute", "taxe", "taxes", "douane", "droits", "cher"],
    answer:
      "Le prix du véhicule est affiché dans le catalogue. Les frais d'expédition, de dédouanement et les taxes dépendent de votre pays : ils figurent dans le devis détaillé que nous vous envoyons.",
    links: [{ label: "Demander un devis", href: CONTACT_HREF }],
  },
  {
    id: "paiement",
    question: "Comment payer ?",
    keywords: ["payer", "paiement", "reglement", "regler", "virement", "moyen de paiement", "financement", "financer", "credit", "mensualite"],
    answer:
      "Les modalités de paiement sont précisées dans votre devis. Nous proposons aussi des solutions de financement : un conseiller peut vous les présenter.",
    links: [{ label: "Parler à un conseiller", href: CONTACT_HREF }, ...whatsappLink()],
  },
  {
    id: "suivi",
    question: "Comment suivre ma commande ?",
    keywords: ["suivre", "suivi", "tracking", "statut", "ma commande", "avancement", "espace client", "connexion", "compte"],
    answer: "Connectez-vous à votre espace client : vous y retrouvez vos commandes et leur avancement.",
    links: [{ label: "Me connecter", href: "/login" }],
  },
  {
    id: "vendre",
    question: "Comment vendre mon véhicule ?",
    keywords: ["vendre", "vendeur", "annonce", "annonces", "publier", "mettre en vente", "vente"],
    answer:
      "Créez un compte en choisissant « Vendeur » : vous pourrez publier vos annonces et suivre vos ventes depuis votre espace.",
    links: [{ label: "Devenir vendeur", href: "/register" }],
  },
  {
    id: "garantie",
    question: "Y a-t-il une garantie ?",
    keywords: ["garantie", "garanti", "inspection", "controle", "verifier", "verification", "etat", "panne", "defaut"],
    answer:
      "Nous proposons une inspection du véhicule avant l'achat. Pour les conditions de garantie, contactez un conseiller.",
    links: [{ label: "Contacter un conseiller", href: CONTACT_HREF }],
  },
  {
    id: "contact",
    question: "Comment vous contacter ?",
    keywords: ["contact", "contacter", "joindre", "telephone", "appeler", "whatsapp", "email", "mail", "parler", "conseiller", "humain"],
    answer: "Écrivez-nous depuis le formulaire de contact : un conseiller vous répond.",
    links: [{ label: "Formulaire de contact", href: CONTACT_HREF }, ...whatsappLink()],
  },
];

export const WELCOME =
  "Bonjour ! Je réponds aux questions fréquentes sur l'import, l'export et la livraison de véhicules. Choisissez une question ci-dessous ou écrivez la vôtre.";

/* ───────────────────────── Matching logic ───────────────────────── */

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const STOP_WORDS = new Set([
  "le", "la", "les", "un", "une", "des", "de", "du", "et", "ou", "au", "aux", "en", "je", "tu", "il", "nous", "vous",
  "ce", "ca", "que", "qui", "quoi", "est", "sont", "pour", "sur", "dans", "mon", "ma", "mes", "votre", "vos", "pas",
  "ne", "y", "d", "l", "j", "c", "qu", "s", "t", "m", "quel", "quels", "quelle", "comment",
]);

const GREETINGS = ["bonjour", "bonsoir", "salut", "hello", "coucou", "salam"];
const THANKS = ["merci", "thanks", "super", "parfait", "ok merci"];

function findEntry(input: string): FaqEntry | null {
  const q = normalize(input);
  if (!q) return null;

  // A quick-reply button sends the exact question
  const exact = FAQ.find((entry) => normalize(entry.question) === q);
  if (exact) return exact;

  const words = q.split(" ").filter((w) => w.length > 1 && !STOP_WORDS.has(w));
  let best: FaqEntry | null = null;
  let bestScore = 0;

  for (const entry of FAQ) {
    let score = 0;
    for (const keyword of entry.keywords) {
      const k = normalize(keyword);
      if (k.includes(" ")) {
        if (q.includes(k)) score += 2;
      } else if (words.some((w) => w === k || (w.length > 3 && k.length > 3 && (k.startsWith(w) || w.startsWith(k))))) {
        score += 1;
      }
    }
    if (score > bestScore) {
      best = entry;
      bestScore = score;
    }
  }
  return bestScore >= 1 ? best : null;
}

export function getReply(input: string): Reply {
  const q = normalize(input);
  const entry = findEntry(input);
  if (entry) return { text: entry.answer, links: entry.links };

  if (GREETINGS.some((g) => q === g || q.startsWith(`${g} `))) {
    return { text: "Bonjour ! Comment puis-je vous aider ? Choisissez une question ci-dessous ou écrivez la vôtre." };
  }
  if (THANKS.some((t) => q.includes(t))) {
    return { text: "Avec plaisir ! N'hésitez pas si vous avez d'autres questions." };
  }

  return {
    text: "Je n'ai pas trouvé de réponse précise à cette question. Essayez une des questions proposées, ou parlez directement à un conseiller.",
    links: [{ label: "Contacter un conseiller", href: CONTACT_HREF }, ...whatsappLink()],
  };
}