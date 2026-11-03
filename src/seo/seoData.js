// Données SEO indépendantes de la langue. Les textes traduits (titres,
// descriptions, prose) sont dans src/i18n/locales/<langue>/seo.js.
// Lu par le site et par scripts/prerender.mjs : JavaScript simple uniquement.

export const SITE = {
  // Vercel's production domain is www; the apex 307-redirects to it.
  // Canonical URLs must point at the served domain, not the redirect.
  origin: 'https://www.howaiworks.io',
  name: 'howaiworks.io',
  ogImage: '/og.png',
  author: {
    name: 'Matt Feroz',
    url: 'https://matthewferoz.com',
  },
  github: 'https://github.com/MatthewFeroz/howaiworks',
}

// Ordered list used for sitemap generation and prev/next navigation.
export const ROUTE_ORDER = ['/', '/what-is-ai', '/tokenize', '/understand', '/attention', '/run', '/about', '/resources']

// Lesson routes get LearningResource structured data; others get WebPage.
export const LESSON_ROUTES = ['/what-is-ai', '/tokenize', '/understand', '/attention', '/run']
