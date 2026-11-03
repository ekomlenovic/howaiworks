# Adding a language

The site is in English by default; French is available as an additional language. Every user-facing string lives in `src/i18n/locales/<code>/`. Pages and components contain no text of their own: they read it with `useT('<namespace>')`.

## In 3 steps

1. **Copy the English folder**

   ```bash
   cp -r src/i18n/locales/en src/i18n/locales/es
   ```

2. **Translate the files in the new folder.** One file per page:

   | File | Content |
   |---|---|
   | `common.js` | navigation, footer, shared labels |
   | `seo.js` | page titles and descriptions, "Deeper dive" prose, end-of-lesson CTAs |
   | `home.js` | home page |
   | `whatIsAI.js` | lesson 1: what is AI? |
   | `tokenizer.jsx` | lesson 2: tokens |
   | `embeddings.jsx` | lesson 3: meaning |
   | `attention.jsx` | lesson 4: attention |
   | `run.jsx` | lesson 5: cloud vs. local |
   | `about.js`, `resources.js` | About and Resources pages |

   Translate the **values** only, never the keys.

3. **Register the language** in `src/i18n/languages.js`:

   ```js
   { code: 'es', label: 'Español', short: 'ES', ogLocale: 'es_ES' },
   ```

That's it: the folder is discovered automatically (`import.meta.glob`) and the language shows up in the navbar switcher.

## Good to know

- **Partial translations are fine.** Any missing key falls back to the default language (`DEFAULT_LANG` in `languages.js`, English), so a language can be shipped a little at a time.
- **`.jsx` files.** Some strings contain markup (bold, links, code). Keep the tags (`<strong>`, `<Accent>`, `<InlineCode>`, `<ExternalLink>`, `<QKVDiagram>`…) and translate only the text between them. These helpers live in `src/components/LessonBits.jsx`, which must not import `src/i18n` (circular import).
- **Functions.** A few values are functions, e.g. `explored: (n, total) => \`${n} of ${total} explored\``. Keep the signature and translate the sentence.
- **Don't translate** the embedding-map words or the attention example sentence: the data is computed word by word in English. `embeddings.jsx` has a `wordGloss` map to show a translation next to each word (see `locales/fr/embeddings.jsx`).
- **`seo.js` and `languages.js` stay plain JavaScript** (no JSX): `scripts/prerender.mjs` also reads them to generate static HTML in the default language.
- **How the language is picked:** `?lang=fr` in the URL, otherwise the visitor's last choice (stored in `localStorage` under `howaiworks-lang`), otherwise the default language.
