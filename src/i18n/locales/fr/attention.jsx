// Lesson 4: attention (/attention page)
// The example sentence stays in English: attention weights are defined word by word.
import { QKVDiagram } from '../../../components/LessonBits'

export default {
  titleStart: "Comment l’IA",
  titleAccent: "fait attention.",
  subtitle: <>
    Chaque mot regarde tous les autres. Le modèle décide de ce qui compte.
    C’est le mécanisme qui a rendu possible l’IA moderne.
  </>,

  // The page's 4 cards (badge, title, explanation)
  cards: [
    {
      badge: "LE PROBLÈME",
      title: "Le sens des mots change selon le contexte",
      explanation: `« Avocat » ne veut pas dire la même chose dans « manger un avocat » et « appeler son avocat ». Les anciens modèles d’IA traitaient les mots un par un, de gauche à droite : arrivés à la fin d’une phrase, ils en avaient déjà oublié le début. L’attention a résolu ce problème en permettant à chaque mot de regarder tous les autres, en même temps.`,
    },
    {
      badge: "AUTO-ATTENTION",
      title: "Chaque mot se demande : « À qui dois-je faire attention ? »",
      explanation: "Pour chaque mot, le modèle calcule un score avec chacun des autres mots de la phrase. Un score élevé signifie un lien fort. Ce calcul se fait en parallèle pour tous les mots à la fois. (La phrase est en anglais : « L’animal n’a pas traversé la rue parce qu’il était trop fatigué ».)",
    },
    {
      badge: "MULTI-TÊTES",
      title: "Plusieurs points de vue à la fois",
      explanation: "Un seul schéma d’attention ne capture qu’un type de relation. Les vrais transformers font tourner de nombreuses têtes d’attention en parallèle, et chacune apprend à se concentrer sur un schéma différent.",
    },
    {
      badge: "VUE D’ENSEMBLE",
      title: "Le bloc transformer",
      explanation: "L’attention n’est qu’une partie du tout. Un bloc transformer complet associe l’auto-attention à des couches feed-forward, des connexions résiduelles et une normalisation. Puis le bloc entier se répète.",
    },
  ],

  // "Before / after attention" demo. Keep 10 words: the arcs link
  // word #8 to #2, #10 to #6, etc. (see RNNvsTransformerInner).
  rnnWords: ['Le', 'chat', 'dort', 'sur', 'le', 'tapis', 'car', 'il', 'est', 'doux'],
  rnn: {
    before: "Avant l’attention (RNN, réseaux récurrents) :",
    forgot: "il = ??? (a oublié « chat »)",
    after: "Avec l’attention (transformers) :",
    every: "Chaque mot accède directement à tous les autres",
    replay: "↻ rejouer",
  },

  // Clickable attention map (the sentence stays in English)
  heatmap: {
    watch: 'Regardez…',
    click: 'Cliquez sur un mot pour voir à quoi il fait attention',
    // Explanation shown for the clicked word
    insight: (selectedWord) => (
    selectedWord === 'it' ? (
        <>
          <strong style={{ color: 'var(--brand)' }}>« it »</strong> (il) accorde 55 % de son attention à{' '}
          <strong style={{ color: 'var(--brand)' }}>« animal »</strong> : le modèle a compris
          que « it » désigne l’animal, pas la rue (« street »). Personne n’a programmé cette règle.
        </>
      ) : selectedWord === 'cross' ? (
        <>
          <strong style={{ color: 'var(--brand)' }}>« cross »</strong> (traverser) regarde surtout{' '}
          <strong style={{ color: 'var(--brand)' }}>« street »</strong> (la rue, 35 %) : il cherche
          ce qui est traversé.
        </>
      ) : selectedWord === 'tired' ? (
        <>
          <strong style={{ color: 'var(--brand)' }}>« tired »</strong> (fatigué) regarde{' '}
          <strong style={{ color: 'var(--brand)' }}>« animal »</strong> (25 %) et{' '}
          <strong style={{ color: 'var(--brand)' }}>« it »</strong> (20 %) : il relie
          la fatigue au sujet de la phrase.
        </>
      ) : (
        <>
          <strong style={{ color: 'var(--brand)' }}>« {selectedWord} »</strong> répartit
          son attention sur toute la phrase. Les mots les plus lumineux sont ceux que le modèle juge les plus
          utiles pour comprendre ce mot dans son contexte.
        </>
      )
    ),
  },

  // Attention heads. Don't change `from` / `to`: they are words of the English sentence.
  heads: [
    {
      name: 'Grammaire',
      color: '#6ec0e8',
      description: 'Suit l’accord sujet-verbe et la structure de la phrase',
      connections: [
        { from: 'animal', to: 'didn\'t', label: 'sujet → verbe' },
        { from: 'it', to: 'was', label: 'sujet → verbe' },
        { from: 'The', to: 'animal', label: 'déterminant → nom' },
      ],
    },
    {
      name: 'Coréférence',
      color: '#f85f00',
      description: 'Retrouve ce que désignent les pronoms',
      connections: [
        { from: 'it', to: 'animal', label: 'pronom → référent' },
        { from: 'tired', to: 'animal', label: 'adjectif → sujet' },
      ],
    },
    {
      name: 'Sémantique',
      color: '#e8956e',
      description: 'Relie les sens apparentés dans toute la phrase',
      connections: [
        { from: 'cross', to: 'street', label: 'action → objet' },
        { from: 'tired', to: 'didn\'t', label: 'cause → effet' },
        { from: 'because', to: 'tired', label: 'raison → cause' },
      ],
    },
  ],
  toggleHeads: "Activez plusieurs têtes pour comparer",

  // Transformer block
  layers: [
    { name: 'Embeddings d’entrée', desc: 'Convertit les tokens en vecteurs (vu dans la leçon « Comprendre »)', color: '#6ec0e8' },
    { name: 'Auto-attention', desc: 'Chaque mot regarde tous les autres pour récupérer du contexte', color: '#f85f00' },
    { name: 'Addition et normalisation', desc: 'On rajoute l’entrée d’origine (connexion résiduelle) puis on normalise', color: '#8a8a96' },
    { name: 'Feed-forward', desc: 'Deux multiplications de matrices avec une activation : c’est là que sont stockées les connaissances', color: '#e8956e' },
    { name: 'Addition et normalisation', desc: 'Une autre connexion résiduelle suivie d’une normalisation', color: '#8a8a96' },
  ],
  layersLabel: "×N couches",


  explore: (n, total) => `Explorez pour continuer (${n}/${total})`,
  nudges: [
    {
      key: 'pronoun-resolution',
      icon: '🔍',
      label: <>À quoi renvoie <strong>« it »</strong> ?</>,
      insight: (
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <p style={{ margin: '0 0 12px' }}>
            Dans la phrase « The animal didn’t cross the street because <strong>it</strong> was too tired »
            (« L’animal n’a pas traversé la rue parce qu’il était trop fatigué »), un humain sait immédiatement que « it » = l’animal. Mais comment un modèle le devine-t-il ?
          </p>
          <p style={{ margin: '0 0 12px' }}>
            <strong style={{ color: 'var(--brand)' }}>Avant l’attention :</strong> les modèles comme les RNN (réseaux de neurones récurrents)
            lisaient les mots de gauche à droite. Le temps d’arriver à « it », l’information sur « animal »
            s’était estompée, comme quand on essaie de se souvenir du début d’une très longue phrase.
          </p>
          <p style={{ margin: 0 }}>
            <strong style={{ color: 'var(--brand)' }}>Avec l’attention :</strong> le modèle peut regarder
            directement « animal » quand il traite « it ». Pas d’oubli, pas d’effacement. Il calcule un
            score de pertinence entre chaque paire de mots, en même temps.
          </p>
        </div>
      ),
    },
    {
      key: 'why-multiple-heads',
      icon: '🧠',
      label: <>Pourquoi <strong>plusieurs</strong> têtes d’attention ?</>,
      insight: (
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <p style={{ margin: '0 0 12px' }}>
            Le langage encode plein de relations à la fois. Dans « Le chat dort sur le tapis »,
            vous comprenez en même temps la grammaire (chat = sujet), la position (chat vient avant dort)
            et le sens (les chats dorment sur des choses).
          </p>
          <p style={{ margin: '0 0 12px' }}>
            Un seul schéma d’attention ne peut capturer qu’un type de relation. Plusieurs têtes
            permettent au modèle de toutes les suivre en parallèle : en général <strong style={{ color: 'var(--brand)' }}>de 12 à 96 têtes</strong> par
            couche, chacune apprenant un schéma différent.
          </p>
          <p style={{ margin: 0 }}>
            Ce ne sont pas des linguistes qui l’ont conçu. Les têtes <strong>émergent de l’entraînement</strong> : le modèle
            découvre que se spécialiser l’aide à mieux prédire le mot suivant.
          </p>
        </div>
      ),
    },
    {
      key: 'how-deep',
      icon: '📚',
      label: <>Jusqu’à quelle <strong>profondeur</strong> ?</>,
      insight: (
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <p style={{ margin: '0 0 12px' }}>
            Un transformer, ce n’est pas une seule étape d’attention : c’est le même bloc répété de nombreuses fois.
            Chaque couche affine la représentation :
          </p>
          <div style={{ margin: '0 0 12px', paddingLeft: 12, borderLeft: '2px solid var(--border)' }}>
            <div style={{ marginBottom: 6 }}><strong style={{ color: '#6ec0e8' }}>Premières couches</strong> : syntaxe de base, frontières des mots, nature des mots</div>
            <div style={{ marginBottom: 6 }}><strong style={{ color: 'var(--brand)' }}>Couches intermédiaires</strong> : relations de sens, coréférences, connaissances</div>
            <div><strong style={{ color: '#e8956e' }}>Dernières couches</strong> : raisonnement propre à la tâche, mise en forme de la réponse</div>
          </div>
          <p style={{ margin: 0 }}>
            GPT-2 a 12 couches, GPT-3 en a 96. Plus de couches = une compréhension plus fine, mais aussi
            plus de calcul par token. C’est pour cela que les gros modèles sont plus lents, mais plus malins.
          </p>
        </div>
      ),
    },
  ],

  // "Go deeper" panel (DepthPanel)
  depthSections: [
    {
      label: 'Le concept',
      color: 'var(--brand)',
      defaultOpen: true,
      content: (
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <p style={{ margin: '0 0 16px' }}>
            L’auto-attention calcule trois vecteurs pour chaque token : la <strong>requête</strong> (Query : qu’est-ce que je cherche ?),{' '}
            la <strong>clé</strong> (Key : qu’est-ce que je contiens ?) et la <strong>valeur</strong> (Value : quelle information est-ce que je transporte ?).
          </p>
          <QKVDiagram inputLabel="Entrée" outputLabel="Sortie" />
          <div style={{
            padding: '16px',
            background: 'var(--bg-deep)',
            borderRadius: 10,
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            lineHeight: 1.8,
            marginBottom: 16,
          }}>
            <div style={{ color: 'var(--text-dim)', marginBottom: 8 }}>Pour chaque mot :</div>
            <div><span style={{ color: '#6ec0e8' }}>Q</span> = mot × W_query    <span style={{ color: 'var(--text-dim)' }}>// « qu’est-ce que je cherche ? »</span></div>
            <div><span style={{ color: '#e8956e' }}>K</span> = mot × W_key      <span style={{ color: 'var(--text-dim)' }}>// « qu’est-ce que je contiens ? »</span></div>
            <div><span style={{ color: '#f85f00' }}>V</span> = mot × W_value    <span style={{ color: 'var(--text-dim)' }}>// « quelle info je transporte ? »</span></div>
            <div style={{ marginTop: 12, color: 'var(--text-dim)' }}>Score d’attention :</div>
            <div>score = softmax(<span style={{ color: '#6ec0e8' }}>Q</span> · <span style={{ color: '#e8956e' }}>K</span>ᵀ / √d) × <span style={{ color: '#f85f00' }}>V</span></div>
          </div>
          <p style={{ margin: 0 }}>
            Le produit scalaire Q·K mesure à quel point chaque clé correspond à chaque requête. Diviser par √d
            (d étant la dimension) évite que les valeurs deviennent trop grandes. La fonction softmax transforme
            les scores bruts en distribution de probabilités. Le résultat est une somme pondérée des valeurs.
          </p>
        </div>
      ),
    },
    {
      label: 'Le code',
      color: '#6ec0e8',
      content: (
        <div style={{
          padding: '16px',
          background: 'var(--bg-deep)',
          borderRadius: 10,
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          lineHeight: 1.6,
          overflowX: 'auto',
        }}>
          <div style={{ color: 'var(--text-dim)', marginBottom: 12 }}>// Auto-attention simplifiée en Python</div>
          <pre style={{ margin: 0, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{`import numpy as np

def self_attention(X, W_q, W_k, W_v):
    """
    X:   embeddings d'entrée  (seq_len, d_model)
    W_q: poids des requêtes   (d_model, d_k)
    W_k: poids des clés       (d_model, d_k)
    W_v: poids des valeurs    (d_model, d_v)
    """
    Q = X @ W_q    # requêtes
    K = X @ W_k    # clés
    V = X @ W_v    # valeurs

    d_k = K.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)
    weights = softmax(scores)  # (seq_len, seq_len)

    return weights @ V  # somme pondérée des valeurs

def softmax(x):
    e = np.exp(x - x.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)`}</pre>
        </div>
      ),
    },
    {
      label: 'Défi',
      color: '#e8d06e',
      content: (
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <p style={{ margin: '0 0 12px' }}>
            L’auto-attention compare chaque mot à tous les autres. Si une phrase contient <em>n</em> mots,
            cela fait <em>n × n</em> comparaisons.
          </p>
          <div style={{
            padding: '12px 16px',
            background: 'var(--bg-deep)',
            borderRadius: 10,
            border: '1px solid var(--border)',
            marginBottom: 12,
          }}>
            <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 13 }}>
              Un prompt de 1 000 tokens = 1 000 000 de scores d’attention.{' '}
              <br />Un prompt de 100 000 tokens = 10 000 000 000 de scores.
            </p>
          </div>
          <p style={{ margin: 0 }}>
            Cette croissance en O(n²) explique pourquoi les fenêtres de contexte sont limitées, et pourquoi les chercheurs
            travaillent sur des alternatives comme Flash Attention, l’attention creuse (sparse) ou l’attention linéaire.
            Voyez-vous des façons de réduire le nombre de comparaisons sans perdre les relations importantes ?
          </p>
        </div>
      ),
    },
    {
      label: 'Dans la vraie vie',
      color: '#e87a96',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #6ec0e8' }}>
            <strong style={{ color: '#6ec0e8', fontSize: 14 }}>Traduction automatique</strong>
            <div style={{ marginTop: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
              L’attention a d’abord été inventée pour la traduction. Elle permet au modèle d’aligner les mots de la langue source et de la langue cible
              (« le chat » → « the cat ») sans correspondance rigide mot à mot.
            </div>
          </div>
          <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid var(--brand)' }}>
            <strong style={{ color: 'var(--brand)', fontSize: 14 }}>Complétion de code</strong>
            <div style={{ marginTop: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
              Quand Copilot vous suggère du code, l’attention lui permet de regarder en même temps vos signatures de fonctions,
              vos noms de variables et vos imports, pour écrire un code adapté au contexte.
            </div>
          </div>
          <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #e8956e' }}>
            <strong style={{ color: '#e8956e', fontSize: 14 }}>Transformers pour la vision</strong>
            <div style={{ marginTop: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
              Le même mécanisme d’attention fonctionne sur les images. On découpe l’image en petits carrés, on traite chaque
              carré comme un « mot », et on laisse les carrés faire attention les uns aux autres. C’est ainsi que fonctionnent DALL-E et
              les classificateurs d’images modernes.
            </div>
          </div>
        </div>
      ),
    },
  ],

  bridge: <>
    Vous avez vu comment l’IA lit le texte, cartographie le sens et dirige son attention.
    Voyons maintenant où tout cela tourne vraiment.
  </>,
  ctaNext: "Voir où tourne l’IA",
}
