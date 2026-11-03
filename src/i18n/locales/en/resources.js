// Resources page
export default {
  title: 'Resources',
  subtitle: 'Here are some more resources to go deeper.',
  voicesTitle: 'Trusted Voices in AI',
  voicesSubtitle: 'People worth following — researchers and educators who explain AI with depth and honesty.',

  TRUSTED_VOICES: [
    {
      name: 'Andrew Ng',
      role: 'Co-founder of Coursera, founder of DeepLearning.AI',
      photo: '/andrew-ng.jpg',
      desc: 'Stanford professor and former head of Google Brain. His free courses on machine learning and deep learning are the gold standard for getting started.',
      links: [
        { label: 'DeepLearning.AI', href: 'https://www.deeplearning.ai/' },
        { label: 'Coursera ML Course', href: 'https://www.coursera.org/learn/machine-learning' },
      ],
    },
    {
      name: 'Andrej Karpathy',
      role: 'Former Director of AI at Tesla, ex-OpenAI',
      photo: 'https://pbs.twimg.com/profile_images/1296667294148382721/9Pr6XrPB_400x400.jpg',
      desc: 'His "Neural Networks: Zero to Hero" YouTube series builds transformers from scratch — the best way to truly understand what\'s under the hood.',
      links: [
        { label: 'YouTube', href: 'https://www.youtube.com/@AndrejKarpathy' },
        { label: 'Zero to Hero', href: 'https://karpathy.ai/zero-to-hero.html' },
      ],
    },
    {
      name: 'Jeremy Howard',
      role: 'Co-founder of fast.ai',
      photo: 'https://pbs.twimg.com/profile_images/1550854978044698624/Rj2vTOiR_400x400.jpg',
      desc: 'Practical, top-down approach to deep learning. The fast.ai courses are free and designed for people who want to build things, not just study theory.',
      links: [
        { label: 'fast.ai', href: 'https://www.fast.ai/' },
        { label: 'Course', href: 'https://course.fast.ai/' },
      ],
    },
  ],

  RESOURCES: [
    {
      href: 'https://bbycroft.net/llm',
      title: 'LLM Visualizer (Brendan Bycroft)',
      desc: '3D interactive walkthrough of a full transformer — see how tokens flow through embeddings, attention, and prediction step by step.',
    },
    {
      href: 'https://arxiv.org/abs/1508.07909',
      title: 'BPE Paper (Sennrich et al. 2016)',
      desc: 'The original paper that introduced Byte Pair Encoding for neural machine translation.',
    },
    {
      href: 'https://github.com/dqbd/tiktoken',
      title: 'js-tiktoken',
      desc: 'The client-side tokenizer library powering this demo — runs entirely in your browser.',
    },
    {
      href: 'https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them',
      title: 'What Are Tokens?',
      desc: 'OpenAI\'s official explainer on tokens, counting, and how they affect pricing.',
    },
  ],
}
