// Shared strings: navigation, footer, common labels.
export default {
  nav: { home: 'Accueil', resources: 'Ressources', about: 'À propos' },
  languageLabel: 'Langue',
  lessonTitles: {
    '/what-is-ai': 'C’est quoi l’IA',
    '/tokenize': 'Tokeniser',
    '/understand': 'Comprendre',
    '/attention': 'Attention',
    '/run': 'Exécuter',
  },
  lockedTitles: ['Affiner', 'Évaluer', 'Déployer'],
  status: { locked: 'verrouillé', completed: 'terminé', inProgress: 'en cours' },
  footer: {
    builtBy: 'Créé par Matt Feroz',
    note: 'Ce projet est open source : il a été conçu pour rendre l’apprentissage de l’IA accessible à tous.',
  },
  deeperDive: 'POUR ALLER PLUS LOIN',
  depthPanelTitle: 'L’informatique derrière tout ça',
  // Nudge exploration counter: (explored, total)
  explored: (n, total) => `${n}/${total} explorés`,
}
