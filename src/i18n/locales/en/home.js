// Home page
export default {
  titleStart: 'This is how AI',
  titleAccent: 'works.',
  subtitle: 'Don\'t read about AI. Experience it. Type, see, and understand what happens inside the machine.',
  lessons: {
    '/what-is-ai': { title: 'What is AI', desc: 'See how AI evolved from rules to language' },
    '/tokenize': { title: 'Tokenize', desc: 'See how AI splits your words into pieces' },
    '/understand': { title: 'Understand', desc: 'Watch AI organize words by meaning' },
    '/attention': { title: 'Attention', desc: 'See how transformers focus on what matters' },
    '/run': { title: 'Run', desc: 'Race cloud vs local inference' },
  },
  locked: [
    { title: 'Fine-tune', desc: 'Train on your own data' },
    { title: 'Evaluate', desc: 'Measure model quality' },
    { title: 'Deploy', desc: 'Ship it to production' },
  ],
  cta: 'Start learning',
  demoSentences: [
    'How does AI actually work?',
    'The cat sat on the mat',
    'strawberry',
    'مرحبا كيف حالك',
  ],
  loadingTokenizer: 'Loading tokenizer...',
}
