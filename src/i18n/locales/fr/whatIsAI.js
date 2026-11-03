// Lesson 1: "What is AI?"
export default {
  titleStart: 'C’est quoi',
  titleAccent: 'l’IA ?',
  subtitle1: 'Des règles écrites à la main aux machines qui écrivent des poèmes.',
  subtitle2: 'Quatre ères en quatre minutes.',
  eras: [
    {
      yearRange: 'Années 1950 – 1980',
      title: 'Les humains écrivaient les règles',
      explanation: 'Les premières IA n’étaient que de la logique « si… alors… ». Les programmeurs disaient à l’ordinateur exactement quoi faire dans chaque situation.',
    },
    {
      yearRange: 'Années 1990 – 2000',
      title: 'Les machines trouvaient les régularités',
      explanation: 'Au lieu d’écrire des règles, on a donné aux ordinateurs des milliers d’exemples en les laissant trouver eux-mêmes les régularités.',
    },
    {
      yearRange: 'Années 2010',
      title: 'Des couches de compréhension',
      explanation: 'On empile de nombreux détecteurs de régularités en couches. La première couche voit des contours, la suivante des formes, la suivante des visages. C’est ainsi que l’IA a appris à voir, entendre et parler.',
    },
    {
      yearRange: 'Années 2020',
      title: 'Prédire le mot suivant',
      explanation: 'On l’entraîne sur des milliards de phrases venues d’internet, pour apprendre quel mot vient ensuite, encore et encore. C’est ça, ChatGPT : la meilleure saisie semi-automatique du monde.',
    },
  ],
  // Era 1 animation (decision tree)
  flowchart: { q1: 'C’est rond ?', q2: 'C’est orange ?', q3: 'Ça s’épluche ?', yes: 'oui', answer: 'C’est une orange !' },
  // Era 2 animation (spam filter)
  scatter: { collecting: 'collecte des e-mails…', classifying: 'classement…', found: 'régularité trouvée !', spam: 'spam', notSpam: 'pas du spam' },
  // Era 3 animation (neural network)
  network: { input: 'entrée', output: 'sortie' },
  // Era 4 animation: the sentence is typed word by word, then the predicted word appears
  nextWord: { words: ['Le', 'chat', 'dort', 'sur', 'le'], prediction: 'canapé', probability: 'probabilité de 85 %' },
  bridge: {
    before: 'L’IA d’aujourd’hui lit le texte sous forme de nombres, y repère des régularités et prédit la suite. Mais avant tout cela, elle doit ',
    highlight: 'découper vos mots en morceaux',
    after: ' qu’elle sait traiter.',
    cta: 'Voir comment l’IA lit un texte',
  },
  digDeeper: 'Creusez un peu : explorez les trois pour terminer cette leçon',
  nudges: {
    images: {
      label: 'Et pour les images ?',
      insight: 'Même idée, autres données. L’IA voit une image comme une grille de nombres : la luminosité et la couleur de chaque pixel. Elle y repère des régularités de la même façon que dans un texte. Contours → formes → objets → scènes. Des nombres en entrée, des régularités en sortie.',
    },
    thinking: {
      label: 'L’IA pense-t-elle vraiment ?',
      insight: 'C’est la question de la « chambre chinoise ». Imaginez une personne enfermée dans une pièce, qui ne parle pas chinois mais dispose d’un énorme manuel de règles. On lui glisse des caractères chinois sous la porte ; elle cherche la bonne réponse dans le manuel et la renvoie. Vu de l’extérieur, on croirait qu’elle parle chinois. L’IA, c’est un peu pareil : elle associe des régularités de façon brillante, mais savoir si cela compte comme de la « compréhension » fait toujours débat.',
    },
    learning: {
      label: 'Comment apprend-elle ?',
      insight: 'La boucle d’entraînement : lire une phrase → prédire le mot suivant → vérifier si c’était juste → ajuster légèrement ses poids → recommencer. Répétez cela des milliards de fois sur des téraoctets de texte, et le modèle apprend peu à peu la grammaire, des connaissances, des façons de raisonner, et bien plus. Chaque petit ajustement le rend un tout petit peu meilleur.',
    },
  },
}
