// Lesson 1: "What is AI?"
export default {
  titleStart: 'What is',
  titleAccent: 'AI?',
  subtitle1: 'From hand-written rules to machines that write poetry.',
  subtitle2: 'Four eras in four minutes.',
  eras: [
    {
      yearRange: '1950s – 1980s',
      title: 'Humans wrote the rules',
      explanation: 'Early AI was just if/then logic. Programmers told the computer exactly what to do for every situation.',
    },
    {
      yearRange: '1990s – 2000s',
      title: 'Machines found the patterns',
      explanation: 'Instead of writing rules, we gave computers thousands of examples and let them figure out the patterns themselves.',
    },
    {
      yearRange: '2010s',
      title: 'Layers of understanding',
      explanation: 'Stack many pattern-finders in layers. The first layer sees edges, the next sees shapes, the next sees faces. This is how AI learned to see, hear, and speak.',
    },
    {
      yearRange: '2020s',
      title: 'Predicting the next word',
      explanation: 'Train on billions of sentences from the internet. Learn which word comes next, over and over. That\'s ChatGPT — the world\'s best autocomplete.',
    },
  ],
  flowchart: { q1: 'Is it round?', q2: 'Is it orange?', q3: 'Does it peel?', yes: 'yes', answer: 'It\'s an orange!' },
  scatter: { collecting: 'collecting emails...', classifying: 'classifying...', found: 'pattern found!', spam: 'spam', notSpam: 'not spam' },
  network: { input: 'input', output: 'output' },
  nextWord: { words: ['The', 'cat', 'sat', 'on', 'the'], prediction: 'mat', probability: '85% probability' },
  bridge: {
    before: 'Today\'s AI reads text as numbers, finds patterns in those numbers, and predicts what comes next. But before any of that — it needs to ',
    highlight: 'break your words into pieces',
    after: ' it can understand.',
    cta: 'See how AI reads text',
  },
  digDeeper: 'Dig deeper — explore all three to complete this lesson',
  nudges: {
    images: {
      label: 'What about images?',
      insight: 'Same idea, different data. AI sees an image as a grid of numbers — the brightness and color of each pixel. It finds patterns in those numbers the same way it finds patterns in text. Edges → shapes → objects → scenes. Everything is numbers in, patterns out.',
    },
    thinking: {
      label: 'Is AI really thinking?',
      insight: 'This is the "Chinese Room" question. Imagine someone in a room who doesn\'t speak Chinese, but has a giant rulebook. They receive Chinese characters, look up the right response, and slide it back under the door. From outside, it looks like they speak Chinese. AI is similar — it matches patterns brilliantly, but whether that counts as "understanding" is still debated.',
    },
    learning: {
      label: 'How does it learn?',
      insight: 'The training loop: See a sentence → predict the next word → check if you were right → adjust your weights slightly → repeat. Do this billions of times across terabytes of text, and the model slowly learns grammar, facts, reasoning patterns, and more. Each tiny adjustment makes it a little bit better.',
    },
  },
}
