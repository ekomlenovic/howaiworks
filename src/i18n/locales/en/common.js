// Shared strings: navigation, footer, common labels.
export default {
  nav: { home: 'Home', resources: 'Resources', about: 'About' },
  languageLabel: 'Language',
  lessonTitles: {
    '/what-is-ai': 'What is AI',
    '/tokenize': 'Tokenize',
    '/understand': 'Understand',
    '/attention': 'Attention',
    '/run': 'Run',
  },
  lockedTitles: ['Fine-tune', 'Evaluate', 'Deploy'],
  status: { locked: 'locked', completed: 'completed', inProgress: 'in progress' },
  footer: {
    builtBy: 'Built by Matt Feroz',
    note: 'This project is open source — built to make AI education accessible to everyone.',
  },
  deeperDive: 'DEEPER DIVE',
  depthPanelTitle: 'The computer science behind this',
  explored: (n, total) => `${n}/${total} explored`,
}
