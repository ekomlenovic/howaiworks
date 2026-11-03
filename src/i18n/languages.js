// ─────────────────────────────────────────────────────────────────────────
// Languages available on the site.
//
// To add a language:
//   1. copy src/i18n/locales/en/ to src/i18n/locales/<code>/
//   2. translate the strings in every file of the new folder
//   3. add a line below
// That's it: the language switcher and the site pick it up automatically.
// See docs/add_a_language.md for details.
//
// This file is read both by the site (React) and by scripts/prerender.mjs:
// keep it plain JavaScript (no JSX).
// ─────────────────────────────────────────────────────────────────────────

export const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN', ogLocale: 'en_US' },
  { code: 'fr', label: 'Français', short: 'FR', ogLocale: 'fr_FR' },
]

// Language shown by default, used for prerendering (SEO) and as the
// fallback when a string is missing from another language.
export const DEFAULT_LANG = 'en'
