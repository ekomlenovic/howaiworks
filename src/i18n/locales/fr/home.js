// Page d'accueil
export default {
  titleStart: 'Voici comment l’IA',
  titleAccent: 'fonctionne.',
  subtitle: 'Ne vous contentez pas de lire sur l’IA : expérimentez-la. Tapez, observez et comprenez ce qui se passe à l’intérieur de la machine.',
  lessons: {
    '/what-is-ai': { title: 'C’est quoi l’IA', desc: 'Voyez comment l’IA est passée des règles au langage' },
    '/tokenize': { title: 'Tokeniser', desc: 'Voyez comment l’IA découpe vos mots en morceaux' },
    '/understand': { title: 'Comprendre', desc: 'Regardez l’IA ranger les mots selon leur sens' },
    '/attention': { title: 'Attention', desc: 'Voyez comment les transformers se concentrent sur l’essentiel' },
    '/run': { title: 'Exécuter', desc: 'Faites s’affronter le cloud et le local' },
  },
  locked: [
    { title: 'Affiner', desc: 'Entraîner sur vos propres données' },
    { title: 'Évaluer', desc: 'Mesurer la qualité d’un modèle' },
    { title: 'Déployer', desc: 'Le mettre en production' },
  ],
  cta: 'Commencer à apprendre',
  // Phrases tapées en boucle par la démo de tokenisation en haut de page
  demoSentences: [
    'Comment fonctionne vraiment l’IA ?',
    'Le chat est assis sur le tapis',
    'anticonstitutionnellement',
    'مرحبا كيف حالك',
  ],
  loadingTokenizer: 'Chargement du tokeniseur…',
}
