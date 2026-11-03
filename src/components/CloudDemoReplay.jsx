// Pre-recorded cloud responses for demo mode
// Simulates cloud inference: longer initial delay (network hop) + faster token rate

export const CLOUD_DEMO_RESPONSES = [
  {
    prompt: 'Qu\'est-ce que l\'intelligence artificielle ?',
    response: 'L\'intelligence artificielle (IA) désigne des systèmes informatiques conçus pour accomplir des tâches qui demandent habituellement une intelligence humaine : comprendre le langage naturel, repérer des régularités dans des données, prendre des décisions ou encore produire du contenu créatif.\n\nAu fond, l\'IA moderne repose sur des réseaux de neurones : des modèles mathématiques vaguement inspirés du cerveau humain. Ces réseaux contiennent des milliards de paramètres (des nombres) qui sont ajustés pendant l\'entraînement sur d\'immenses jeux de données. Le modèle apprend des régularités statistiques : pour telle entrée, quelle est la sortie la plus probable ?\n\nL\'architecture transformer, présentée en 2017, a révolutionné l\'IA en permettant aux modèles de traiter des séquences de texte entières d\'un coup grâce à des « mécanismes d\'attention » : chaque mot peut tenir compte de tous les autres pour déterminer son sens. C\'est la base de GPT-4, Claude, Gemini et des autres grands modèles de langage que vous utilisez aujourd\'hui.\n\nPoint important : l\'IA ne « comprend » pas comme un humain. C\'est une machine extraordinairement sophistiquée à reconnaître des régularités, qui a appris la structure statistique du langage humain à partir de milliers de milliards de mots.',
  },
  {
    prompt: 'Explique comment apprend un réseau de neurones',
    response: 'Un réseau de neurones apprend grâce à un processus appelé entraînement, qui repose sur trois étapes répétées des millions de fois :\n\n1. **Propagation avant** : les données d\'entrée traversent les couches de neurones. Chaque neurone multiplie ses entrées par des poids, ajoute un biais et applique une fonction d\'activation. Le réseau produit une prédiction.\n\n2. **Calcul de l\'erreur** : la prédiction est comparée à la bonne réponse à l\'aide d\'une fonction de perte. On obtient un seul nombre qui mesure à quel point la prédiction était fausse.\n\n3. **Rétropropagation** : l\'erreur est propagée à l\'envers dans le réseau grâce au calcul différentiel (plus précisément, la règle de dérivation en chaîne). On obtient le gradient, c\'est-à-dire la part de chaque poids dans l\'erreur. Les poids sont ensuite légèrement ajustés dans la direction qui réduit l\'erreur.\n\nCe processus, appelé descente de gradient, est répété sur des milliards d\'exemples. Petit à petit, les poids convergent vers des valeurs qui donnent de bonnes prédictions sur les données d\'entraînement.\n\nL\'idée clé, c\'est que le réseau découvre lui-même ses propres représentations internes. Personne ne lui dit quelles caractéristiques chercher : il apprend que certaines régularités dans les données sont utiles pour prédire. C\'est ce qui rend l\'apprentissage profond si puissant, et si différent de la programmation traditionnelle.',
  },
]

// Simulate cloud streaming: initial delay (300-800ms) + faster token rate (~80 tok/s)
export function simulateCloudStream(text, onToken, onDone, options = {}) {
  const {
    initialDelay = 400 + Math.random() * 400,
    tokenInterval = 12 + Math.random() * 8,
  } = options

  // Split into small chunks that approximate tokens
  const chunks = []
  let i = 0
  while (i < text.length) {
    const chunkSize = Math.min(2 + Math.floor(Math.random() * 4), text.length - i)
    let end = i + chunkSize
    if (end < text.length && text[end] !== ' ' && text.indexOf(' ', i) > 0) {
      const nextSpace = text.indexOf(' ', end)
      if (nextSpace > 0 && nextSpace - end < 3) {
        end = nextSpace + 1
      }
    }
    chunks.push(text.slice(i, end))
    i = end
  }

  let idx = 0
  let intervalId = null
  let cancelled = false

  // Initial delay simulating network latency
  const delayTimer = setTimeout(() => {
    if (cancelled) return
    intervalId = setInterval(() => {
      if (idx >= chunks.length) {
        clearInterval(intervalId)
        onDone()
        return
      }
      onToken(chunks[idx])
      idx++
    }, tokenInterval)
  }, initialDelay)

  return () => {
    cancelled = true
    clearTimeout(delayTimer)
    if (intervalId) clearInterval(intervalId)
  }
}
