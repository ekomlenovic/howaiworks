// Page « Ressources »
export default {
  title: 'Ressources',
  subtitle: 'Quelques ressources supplémentaires pour aller plus loin.',
  voicesTitle: 'Des voix de confiance en IA',
  voicesSubtitle: 'Des personnes à suivre : chercheurs et pédagogues qui expliquent l’IA avec profondeur et honnêteté.',

  TRUSTED_VOICES: [
    {
      name: 'Andrew Ng',
      role: 'Cofondateur de Coursera, fondateur de DeepLearning.AI',
      photo: '/andrew-ng.jpg',
      desc: 'Professeur à Stanford et ancien directeur de Google Brain. Ses cours gratuits sur l’apprentissage automatique et l’apprentissage profond sont la référence pour débuter (en anglais, sous-titres disponibles).',
      links: [
        { label: 'DeepLearning.AI', href: 'https://www.deeplearning.ai/' },
        { label: 'Cours de ML sur Coursera', href: 'https://www.coursera.org/learn/machine-learning' },
      ],
    },
    {
      name: 'Andrej Karpathy',
      role: 'Ancien directeur de l’IA chez Tesla, ex-OpenAI',
      photo: 'https://pbs.twimg.com/profile_images/1296667294148382721/9Pr6XrPB_400x400.jpg',
      desc: 'Sa série YouTube « Neural Networks: Zero to Hero » construit des transformers à partir de zéro : le meilleur moyen de vraiment comprendre ce qu’il y a sous le capot (en anglais).',
      links: [
        { label: 'YouTube', href: 'https://www.youtube.com/@AndrejKarpathy' },
        { label: 'Zero to Hero', href: 'https://karpathy.ai/zero-to-hero.html' },
      ],
    },
    {
      name: 'Jeremy Howard',
      role: 'Cofondateur de fast.ai',
      photo: 'https://pbs.twimg.com/profile_images/1550854978044698624/Rj2vTOiR_400x400.jpg',
      desc: 'Une approche pratique de l’apprentissage profond, qui part du concret. Les cours fast.ai sont gratuits et pensés pour celles et ceux qui veulent construire des choses, pas seulement étudier la théorie (en anglais).',
      links: [
        { label: 'fast.ai', href: 'https://www.fast.ai/' },
        { label: 'Le cours', href: 'https://course.fast.ai/' },
      ],
    },
  ],

  RESOURCES: [
    {
      href: 'https://bbycroft.net/llm',
      title: 'Visualisation de LLM (Brendan Bycroft)',
      desc: 'Une visite interactive en 3D d’un transformer complet : suivez les tokens à travers les embeddings, l’attention et la prédiction, étape par étape.',
    },
    {
      href: 'https://arxiv.org/abs/1508.07909',
      title: 'L’article sur le BPE (Sennrich et al., 2016)',
      desc: 'L’article original qui a introduit l’encodage par paires d’octets (Byte Pair Encoding) pour la traduction automatique neuronale.',
    },
    {
      href: 'https://github.com/dqbd/tiktoken',
      title: 'js-tiktoken',
      desc: 'La bibliothèque de tokenisation qui fait tourner cette démo, entièrement dans votre navigateur.',
    },
    {
      href: 'https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them',
      title: 'Qu’est-ce qu’un token ? (OpenAI)',
      desc: 'L’explication officielle d’OpenAI sur les tokens, la façon de les compter et leur effet sur les prix (en anglais).',
    },
  ],
}
