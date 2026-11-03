// ─────────────────────────────────────────────────────────────────────────
// Langues disponibles sur le site.
//
// Pour ajouter une langue :
//   1. copiez le dossier src/i18n/locales/fr/ vers src/i18n/locales/<code>/
//   2. traduisez les textes de chaque fichier de ce nouveau dossier
//   3. ajoutez une ligne ci-dessous
// C'est tout : le sélecteur de langue et le site la prennent en compte automatiquement.
// Voir docs/AJOUTER_UNE_LANGUE.md pour le détail.
//
// Ce fichier est lu à la fois par le site (React) et par scripts/prerender.mjs :
// gardez-le en JavaScript simple (pas de JSX).
// ─────────────────────────────────────────────────────────────────────────

export const LANGUAGES = [
  { code: 'fr', label: 'Français', short: 'FR', ogLocale: 'fr_FR' },
  { code: 'en', label: 'English', short: 'EN', ogLocale: 'en_US' },
]

// Langue affichée par défaut, utilisée pour le pré-rendu (SEO) et comme
// repli quand une traduction manque dans une autre langue.
export const DEFAULT_LANG = 'fr'
