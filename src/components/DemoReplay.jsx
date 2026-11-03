// Pre-recorded conversations for demo mode
// Simulates realistic Ollama streaming at ~30 tokens/sec

export const DEMO_CONVERSATIONS = [
  {
    prompt: 'Qu\'est-ce qu\'un réseau de neurones ?',
    response: 'Un réseau de neurones est un système de calcul inspiré du cerveau biologique. Il est composé de couches de nœuds interconnectés (les neurones) qui traitent l\'information. Chaque connexion possède un poids qui s\'ajuste pendant l\'entraînement. Les données entrent par la couche d\'entrée, sont transformées par les couches cachées, puis produisent une sortie. Le réseau apprend en ajustant ses poids pour réduire ses erreurs de prédiction : c\'est ce qu\'on appelle la rétropropagation. Même ce petit modèle de 500 millions de paramètres utilise la même architecture de base que GPT-4, simplement avec moins de couches et de neurones.',
  },
  {
    prompt: 'Comment comprends-tu mes mots ?',
    response: 'Je ne lis pas les mots comme vous. Votre texte est découpé en tokens : de petits morceaux qui sont souvent des bouts de mots plutôt que des mots entiers. Chaque token correspond à un nombre (un identifiant), et ces nombres sont convertis en vecteurs (des listes de centaines de nombres). Ces vecteurs capturent le sens : des mots proches ont des vecteurs proches. Je fais passer ces vecteurs dans des couches d\'attention, où chaque token regarde tous les autres pour comprendre le contexte. Le mot « avocat » ne veut pas dire la même chose dans « manger un avocat » et « appeler son avocat » : c\'est l\'attention qui m\'aide à faire la différence.',
  },
  {
    prompt: 'Peux-tu tourner sur un Chromebook ?',
    response: 'Oui ! Je suis qwen2.5:0.5b, un modèle de 500 millions de paramètres qui n\'a besoin que d\'environ 1 Go de mémoire vive. C\'est assez léger pour tourner sur la plupart des Chromebooks, de vieux ordinateurs portables, et même un Raspberry Pi. Pas besoin de carte graphique, ni d\'internet, ni de clé d\'API, ni d\'abonnement. Les plus gros modèles comme GPT-4 ont plus de mille milliards de paramètres et ont besoin d\'énormes fermes de serveurs. Je peux quand même tenir une conversation, répondre à des questions et expliquer des notions. En contrepartie, je suis moins bon sur les raisonnements complexes, mais pour apprendre et expérimenter, je fais très bien l\'affaire. L\'IA n\'a pas besoin d\'être chère ou réservée à quelques-uns.',
  },
]

// Simulate token streaming by splitting response into word-level chunks
// Optional params: initialDelay (ms before first token), tokenInterval (ms between tokens)
export function simulateTokenStream(text, onToken, onDone, options = {}) {
  const {
    initialDelay = 0,
    tokenInterval = 30 + Math.random() * 20,
  } = options

  // Split into small chunks that approximate tokens
  const chunks = []
  let i = 0
  while (i < text.length) {
    // Vary chunk size for realism (2-6 chars)
    const chunkSize = Math.min(2 + Math.floor(Math.random() * 4), text.length - i)
    // Don't break in the middle of a word if possible
    let end = i + chunkSize
    if (end < text.length && text[end] !== ' ' && text.indexOf(' ', i) > 0) {
      const nextSpace = text.indexOf(' ', end)
      const prevSpace = text.lastIndexOf(' ', end)
      if (nextSpace > 0 && nextSpace - end < 3) {
        end = nextSpace + 1
      } else if (prevSpace > i) {
        // keep end as-is for variety
      }
    }
    chunks.push(text.slice(i, end))
    i = end
  }

  let idx = 0
  let intervalId = null
  let cancelled = false

  const startStreaming = () => {
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
  }

  if (initialDelay > 0) {
    const delayTimer = setTimeout(startStreaming, initialDelay)
    return () => {
      cancelled = true
      clearTimeout(delayTimer)
      if (intervalId) clearInterval(intervalId)
    }
  } else {
    startStreaming()
    return () => {
      cancelled = true
      if (intervalId) clearInterval(intervalId)
    }
  }
}
