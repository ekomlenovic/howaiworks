# Ajouter une langue

Tous les textes du site vivent dans `src/i18n/locales/<code>/`. Le code des pages ne contient plus de texte : il lit ses textes avec `useT('<page>')`.

## En 3 étapes

1. **Copier le dossier d'une langue existante**

   ```bash
   cp -r src/i18n/locales/fr src/i18n/locales/es
   ```

2. **Traduire les fichiers du nouveau dossier.** Un fichier par page :

   | Fichier | Contenu |
   |---|---|
   | `common.js` | navigation, pied de page, libellés partagés |
   | `seo.js` | titres et descriptions des pages (moteurs de recherche) |
   | `home.js` | page d'accueil |
   | `whatIsAI.js` | leçon 1 : qu'est-ce que l'IA ? |
   | `tokenizer.jsx` | leçon 2 : les tokens |
   | `embeddings.jsx` | leçon 3 : le sens des mots |
   | `attention.jsx` | leçon 4 : l'attention |
   | `run.jsx` | leçon 5 : cloud ou local |
   | `about.js`, `resources.js` | pages « À propos » et « Ressources » |

   Ne traduisez que les **valeurs**, jamais les clés (`title: '…'` → on change ce qui est entre guillemets).

3. **Déclarer la langue** dans `src/i18n/languages.js` :

   ```js
   { code: 'es', label: 'Español', short: 'ES', ogLocale: 'es_ES' },
   ```

C'est tout : le dossier est détecté automatiquement et la langue apparaît dans le sélecteur de la barre de navigation.

## Bon à savoir

- **Traduction partielle possible.** Toute clé absente retombe sur la langue par défaut (`DEFAULT_LANG` dans `languages.js`). On peut donc publier une langue au fur et à mesure.
- **Fichiers `.jsx`.** Certains textes contiennent de la mise en forme (gras, liens, code). Gardez les balises (`<strong>`, `<Accent>`, `<InlineCode>`, `<ExternalLink>`…) et traduisez seulement le texte entre elles.
- **Fonctions.** Quelques valeurs sont des fonctions, par ex. `explored: (n, total) => \`${n} sur ${total} explorés\``. Gardez la forme, traduisez la phrase.
- **Ne pas traduire** : les mots de la carte des embeddings et la phrase d'exemple de l'attention (les données sont calculées mot par mot en anglais). Le fichier `embeddings.jsx` propose `wordGloss` pour afficher une traduction à côté de chaque mot.
- **`seo.js` et `languages.js` restent en JavaScript pur** (pas de JSX) : ils sont aussi lus par le script de pré-rendu `scripts/prerender.mjs`, qui génère le HTML statique dans la langue par défaut.
- **Choix de la langue.** Paramètre d'URL `?lang=en`, sinon le dernier choix de l'utilisateur (stocké dans le navigateur), sinon la langue par défaut.
