// Lesson 5: cloud vs. local (/run page)
import { Accent, StepBox, InlineCode, ExternalLink } from '../../../components/LessonBits'

export default {
  titleStart: "La même IA.",
  titleAccent: "Deux machines très différentes.",
  subtitle: <>
    <span style={{ color: '#6ec0e8' }}>Cloud</span> : une grappe de GPU dans un centre de données.{' '}
    <span style={{ color: 'var(--brand)' }}>Local</span> : votre propre ordinateur. Regardez-les faire la course.
  </>,

  // Latency race (LatencyRace)
  race: {
    cloudSublabel: "Simulé · grappe de GPU en centre de données",
    localSublabel: { ollama: "Ollama · Votre machine", webllm: "WebGPU · Dans le navigateur", simulated: "Simulé · qwen2.5:0.5b" },
    placeholder: "Écrivez un prompt et relancez la course…",
    race: "Lancer la course",
    racing: "Course en cours…",
    waiting: "En attente…",
    idle: "Écrivez un prompt et lancez la course",
    // Pre-recorded answers replayed when no model is running.
    // The race starts automatically with the first `cloud` prompt.
    // If a typed prompt exactly matches a `prompt`, its answer is replayed.
    demo: {
      cloud: [
        {
          prompt: 'Qu\'est-ce que l\'intelligence artificielle ?',
          response: 'L\'intelligence artificielle (IA) désigne des systèmes informatiques conçus pour accomplir des tâches qui demandent habituellement une intelligence humaine : comprendre le langage naturel, repérer des régularités dans des données, prendre des décisions ou encore produire du contenu créatif.\n\nAu fond, l\'IA moderne repose sur des réseaux de neurones : des modèles mathématiques vaguement inspirés du cerveau humain. Ces réseaux contiennent des milliards de paramètres (des nombres) qui sont ajustés pendant l\'entraînement sur d\'immenses jeux de données. Le modèle apprend des régularités statistiques : pour telle entrée, quelle est la sortie la plus probable ?\n\nL\'architecture transformer, présentée en 2017, a révolutionné l\'IA en permettant aux modèles de traiter des séquences de texte entières d\'un coup grâce à des « mécanismes d\'attention » : chaque mot peut tenir compte de tous les autres pour déterminer son sens. C\'est la base de GPT-4, Claude, Gemini et des autres grands modèles de langage que vous utilisez aujourd\'hui.\n\nPoint important : l\'IA ne « comprend » pas comme un humain. C\'est une machine extraordinairement sophistiquée à reconnaître des régularités, qui a appris la structure statistique du langage humain à partir de milliers de milliards de mots.',
        },
        {
          prompt: 'Explique comment apprend un réseau de neurones',
          response: 'Un réseau de neurones apprend grâce à un processus appelé entraînement, qui repose sur trois étapes répétées des millions de fois :\n\n1. **Propagation avant** : les données d\'entrée traversent les couches de neurones. Chaque neurone multiplie ses entrées par des poids, ajoute un biais et applique une fonction d\'activation. Le réseau produit une prédiction.\n\n2. **Calcul de l\'erreur** : la prédiction est comparée à la bonne réponse à l\'aide d\'une fonction de perte. On obtient un seul nombre qui mesure à quel point la prédiction était fausse.\n\n3. **Rétropropagation** : l\'erreur est propagée à l\'envers dans le réseau grâce au calcul différentiel (plus précisément, la règle de dérivation en chaîne). On obtient le gradient, c\'est-à-dire la part de chaque poids dans l\'erreur. Les poids sont ensuite légèrement ajustés dans la direction qui réduit l\'erreur.\n\nCe processus, appelé descente de gradient, est répété sur des milliards d\'exemples. Petit à petit, les poids convergent vers des valeurs qui donnent de bonnes prédictions sur les données d\'entraînement.\n\nL\'idée clé, c\'est que le réseau découvre lui-même ses propres représentations internes. Personne ne lui dit quelles caractéristiques chercher : il apprend que certaines régularités dans les données sont utiles pour prédire. C\'est ce qui rend l\'apprentissage profond si puissant, et si différent de la programmation traditionnelle.',
        },
      ],
      local: [
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
      ],
    },
  },

  // Setup guide (SetupGuide)
  setup: {
    heading: "Guide d’installation",
    description: "La course ci-dessous est simulée pour montrer des temps typiques : la piste cloud rejoue le comportement d’un centre de données (premier token plus lent, flux plus rapide ensuite). Installez Ollama ou utilisez WebGPU pour faire tourner le côté local pour de vrai.",
    titleWebllmActive: "Local : WebLLM actif (Ollama recommandé)",
    titleLoading: "Connecter le local : chargement dans le navigateur…",
    titleOllama: "Connecter le local : Ollama",
    connected: "Connecté",
    intro: "Ollama fait tourner des modèles d’IA directement sur votre machine : pas d’internet, pas de clé d’API, aucune donnée qui quitte votre ordinateur. Le modèle utilisé ici est Qwen 2.5, avec 500 millions de paramètres, assez petit pour tenir dans environ 1 Go de mémoire vive. Il n’atteindra pas la qualité du cloud (500 millions contre 70 milliards de paramètres), mais l’inférence démarre instantanément et vos messages restent privés. C’est exactement ce compromis que cette page vous fait ressentir.",
    steps: [
      {
        title: "Installer Ollama",
        body: <>
          Téléchargez-le sur{' '}
          <ExternalLink href="https://ollama.com">ollama.com</ExternalLink>. C’est un logiciel qui gère les modèles d’IA sur votre machine : il les télécharge, les charge en mémoire et les rend accessibles via une API locale, un peu comme Docker gère des conteneurs.
        </>,
      },
      {
        title: "Télécharger un modèle",
        body: <>
          Lancez <InlineCode>ollama pull qwen2.5:0.5b</InlineCode>. Cette commande télécharge les poids du modèle (~400 Mo), c’est-à-dire les paramètres appris qui contiennent tout ce que le modèle sait. Le « pull », c’est comme récupérer une image Docker : on télécharge une fois, on l’utilise autant de fois qu’on veut.
        </>,
      },
      {
        title: "Vérifier que ça marche",
        body: <>
          Lancez <InlineCode>ollama run qwen2.5:0.5b</InlineCode> et tapez une question. S’il répond, le modèle est bien chargé. Appuyez sur Ctrl+D pour quitter.
        </>,
      },
      {
        title: "Installer le serveur Python",
        body: <>
          Lancez <InlineCode>pip install fastapi uvicorn httpx tiktoken</InlineCode>. Cela installe le serveur qui fait le lien entre l’API locale d’Ollama et l’interface de ce site.
        </>,
      },
      {
        title: "Démarrer le serveur",
        body: <>
          Lancez <InlineCode>uvicorn main:app --port 8000</InlineCode>. Cela démarre le serveur FastAPI sur localhost:8000. Le serveur de développement du site lui redirige les requêtes <InlineCode>/api</InlineCode>.
        </>,
      },
      {
        title: "Rafraîchir cette page",
        body: <>
          Le badge « Simulé » disparaît de la colonne Local. Vous faites maintenant tourner une vraie inférence sur votre propre matériel.
        </>,
      },
    ],
  },

  // Ollama card (OllamaLocalCard)
  card: {
    title: "Faire tourner en local avec Ollama",
    subtitle: 'Faites tourner l’IA sur votre machine, sans internet',
    subtitleConnected: 'Ollama est lancé : inférence locale active',
    connected: "Connecté",
    intro: <>
    <strong style={{ color: 'var(--brand)' }}>L’inférence locale</strong> fait tourner le modèle d’IA directement
    sur votre ordinateur : pas d’internet, pas de clé d’API, aucune donnée qui quitte votre machine. La contrepartie : votre matériel
    limite les modèles que vous pouvez utiliser. Le modèle de 0,5 milliard de paramètres utilisé ici tient dans environ 1 Go de RAM, mais il est bien plus petit
    que les modèles du cloud.
  </>,
    quickStart: "Démarrage rapide",
    getOllama: "Télécharger Ollama",
    copied: "Copié !",
    webgpuLoaded: 'Modèle WebGPU chargé',
    webgpuLoading: 'Chargement du modèle WebGPU…',
    webgpuTry: "Impossible d’installer ? Essayez WebGPU",
  },

  progress: { loading: "Chargement de l’IA dans votre navigateur…", preparing: 'Préparation de WebGPU…' },

  // Tradeoff cards (TradeoffCards)
  tradeoffs: {
    title: "Les compromis",
    allExplored: "Tout exploré : vous avez une vue claire du match cloud contre local.",
    cards: [
      {
        key: 'latency',
        icon: '⚡',
        label: <>Latence : <Accent>le cloud réfléchit plus vite, mais il a plus de trajet à faire</Accent></>,
        insight: {
          headline: 'Temps avant le premier token ou nombre de tokens par seconde ?',
          body: <>
            Le <strong style={{ color: '#6ec0e8' }}>cloud</strong> a un TTFT (temps avant le premier token) élevé : votre message
            voyage sur internet jusqu’à un centre de données, attend son tour dans une file, puis la génération commence.
            Mais une fois lancé, ses puissants GPU A100/H100 produisent 80 à 150 tokens par seconde.
            <br /><br />
            Le <strong style={{ color: 'var(--brand)' }}>local</strong> démarre presque instantanément (pas de trajet réseau),
            mais le matériel grand public ne génère que 10 à 30 tokens par seconde. Pour une réponse courte, le local <em>paraît</em> plus rapide.
            Pour une réponse longue, le cloud prend l’avantage.
          </>,
        },
      },
      {
        key: 'privacy',
        icon: '🔒',
        label: <>Confidentialité : <Accent>l’IA locale garde vos secrets</Accent></>,
        insight: {
          headline: 'Vos données ne quittent jamais votre machine.',
          body: <>
            Quand vous utilisez une IA dans le cloud, vos messages sont envoyés à un serveur distant : ils peuvent être stockés, enregistrés dans des journaux,
            et parfois utilisés pour l’entraînement. Avec une IA locale, le modèle tourne entièrement sur votre matériel.
            <strong style={{ color: 'var(--text-primary)' }}> Rien n’est transmis. Rien n’est stocké. Rien n’est partagé.</strong>
            <br /><br />
            C’est essentiel dans la santé (secret médical), le droit (secret professionnel de l’avocat), la finance (réglementation bancaire),
            et pour toute personne attachée à la maîtrise de ses données (pensez au RGPD). De plus en plus d’hôpitaux font tourner des modèles locaux pour les données des patients,
            et des cabinets d’avocats les utilisent pour leurs documents confidentiels.
          </>,
        },
      },
      {
        key: 'cost',
        icon: '💰',
        label: <>Coût : <Accent>le cloud facture au token, le local est gratuit une fois installé</Accent></>,
        insight: {
          headline: 'Payer à l’usage ou investir au départ ?',
          body: <>
            <strong style={{ color: '#6ec0e8' }}>Tarifs du cloud</strong> (ordre de grandeur) : environ 0,03 $ pour 1 000 tokens en entrée,
            environ 0,06 $ pour 1 000 tokens en sortie. Un chatbot très sollicité, qui gère 10 000 conversations par jour, peut coûter 500 à 2 000 $ par mois.
            <br /><br />
            <strong style={{ color: 'var(--brand)' }}>Coût du local</strong> : on achète le matériel une fois, puis on l’utilise indéfiniment.
            Une carte graphique à 200 $ fait tourner de petits modèles ; une station de travail haut de gamme peut faire tourner des modèles de 70 milliards de paramètres.
            Une fois l’investissement de départ fait, chaque token est gratuit (hors électricité).
            <br /><br />
            <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>
              Le seuil de rentabilité dépend du volume d’utilisation : un usage léger favorise le cloud, un usage intensif favorise le local.
            </span>
          </>,
        },
      },
      {
        key: 'capability',
        icon: '🧠',
        label: <>Capacités : <Accent>plus le modèle est gros, meilleures sont les réponses</Accent></>,
        insight: {
          headline: '500 millions de paramètres contre plus de 8 milliards : la taille compte.',
          body: <>
            Le modèle local que vous avez vu (qwen2.5:0.5b) compte <strong style={{ color: 'var(--brand)' }}>500 millions de paramètres</strong>.
            Des modèles comme Llama 3.1 en ont <strong style={{ color: '#6ec0e8' }}>8 milliards ou plus</strong>, soit 16 fois plus.
            <br /><br />
            Plus de paramètres, c’est plus de « mémoire » pour les connaissances, un meilleur raisonnement et des textes longs plus cohérents.
            Mais il faut aussi plus de mémoire graphique. Un modèle de 70 milliards de paramètres a besoin d’environ 35 Go de VRAM (en quantification 4 bits) :
            c’est le niveau d’une A100 ou d’une carte grand public très haut de gamme.
            <br /><br />
            La tendance va vers des modèles plus petits et plus efficaces (distillation, quantification)
            qui réduisent cet écart, et le nouveau matériel permet de faire tourner des modèles toujours plus gros sur votre bureau.
          </>,
        },
      },
    ],
  },

  // "Go deeper" panel (DepthPanel)
  depthSections: [
    {
      label: 'Le concept',
      color: 'var(--brand)',
      defaultOpen: true,
      content: (
        <div>
          <p style={{ marginBottom: 16 }}>
            <strong style={{ color: 'var(--brand)', fontSize: 15 }}>La chaîne d’inférence</strong>
          </p>
          <p style={{ marginBottom: 12 }}>
            Quand vous envoyez un prompt à un modèle d’IA, voici ce qui se passe dans le GPU (la carte graphique) :
          </p>
          <div style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
            <StepBox step={1} title="Tokeniser">
              Votre texte est découpé en tokens (vous l’avez vu dans la leçon sur la tokenisation). Cela se passe sur le processeur (CPU) : rapide, pas besoin de GPU.
            </StepBox>
            <StepBox step={2} title="Plonger (embedding)">
              Les identifiants des tokens sont convertis en vecteurs d’embedding (leçon « Comprendre »). La table des embeddings est stockée dans la mémoire du GPU.
            </StepBox>
            <StepBox step={3} title="Propagation avant">
              Les embeddings traversent des dizaines de couches de transformer. Chaque couche contient des têtes d’attention et des réseaux
              « feed-forward » : des milliards de multiplications de matrices. C’est là que le GPU mérite son salaire.
            </StepBox>
            <StepBox step={4} title="Tirer le token suivant">
              Le modèle produit une distribution de probabilités sur les quelque 100 000 tokens possibles. On tire au sort dedans pour choisir le token suivant.
              Puis on recommence à l’étape 2 en ajoutant ce nouveau token.
            </StepBox>
          </div>

          <p style={{ marginBottom: 16 }}>
            <strong style={{ color: 'var(--brand)', fontSize: 15 }}>La mémoire du GPU, c’est le goulot d’étranglement</strong>
          </p>
          <p style={{ marginBottom: 12 }}>
            Tous les paramètres d’un modèle doivent tenir dans la mémoire vidéo (VRAM) du GPU. En FP16 (2 octets par paramètre) :
          </p>
          <div style={{
            padding: '12px 16px',
            background: 'rgba(248, 95, 0,0.06)',
            border: '1px solid rgba(248, 95, 0,0.25)',
            borderRadius: 8,
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            marginBottom: 12,
          }}>
            <div>0,5 Md de paramètres × 2 octets = <strong style={{ color: 'var(--brand)' }}>1 Go</strong> (tourne sur un Chromebook)</div>
            <div>8 Md de paramètres × 2 octets = <strong style={{ color: '#6ec0e8' }}>16 Go</strong> (il faut une carte graphique de joueur)</div>
            <div>70 Md de paramètres × 2 octets = <strong style={{ color: '#e8956e' }}>140 Go</strong> (il faut 2 A100 de 80 Go)</div>
          </div>
          <p>
            <strong style={{ color: 'var(--text-primary)' }}>La quantification</strong> réduit ce besoin : en quantification 4 bits,
            chaque paramètre occupe 0,5 octet au lieu de 2. Un modèle de 70 milliards de paramètres passe de 140 Go à environ 35 Go, et tient
            sur une seule A100 ou une carte grand public très haut de gamme. La contrepartie : une légère perte de précision.
          </p>
        </div>
      ),
    },
    {
      label: 'Le code',
      color: '#6ec0e8',
      defaultOpen: false,
      content: (
        <pre style={{
          background: 'var(--bg-deep)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '16px',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          lineHeight: 1.6,
          overflowX: 'auto',
          whiteSpace: 'pre',
          color: 'var(--text-secondary)',
        }}>
{`# Inférence dans le cloud (n'importe quelle API compatible OpenAI)
import openai

client = openai.OpenAI(
    api_key="sk-votre-cle-ici"
)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "C'est quoi l'IA ?"}],
    stream=True
)

for chunk in response:
    token = chunk.choices[0].delta.content
    if token:
  print(token, end="", flush=True)

# ── Même interface, autre infrastructure ──────────
# Inférence locale (Ollama, tourne sur votre machine)
client = openai.OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"  # Ollama n'a pas besoin d'une vraie clé
)

response = client.chat.completions.create(
    model="qwen2.5:0.5b",
    messages=[{"role": "user", "content": "C'est quoi l'IA ?"}],
    stream=True
)

for chunk in response:
    token = chunk.choices[0].delta.content
    if token:
  print(token, end="", flush=True)`}
        </pre>
      ),
    },
    {
      label: 'Défi',
      color: '#e8d06e',
      defaultOpen: false,
      content: (
        <div>
          <p style={{ marginBottom: 10 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Réfléchissez :</strong>
          </p>
          <p style={{ marginBottom: 8, paddingLeft: 16 }}>
            <strong style={{ color: '#e8d06e' }}>1.</strong> Si une A100 a 80 Go de VRAM et que chaque paramètre
            en FP16 occupe 2 octets, quel est le plus gros modèle qu’elle peut contenir ? Et en quantification 4 bits ?
          </p>
          <p style={{ marginBottom: 8, paddingLeft: 16 }}>
            <strong style={{ color: '#e8d06e' }}>2.</strong> Certaines stations de travail sont désormais livrées avec 128 Go de
            mémoire unifiée, partagée entre le CPU et le GPU. Qu’est-ce que cela change pour les modèles qu’on peut faire tourner en local ?
          </p>
          <p style={{ paddingLeft: 16 }}>
            <strong style={{ color: '#e8d06e' }}>3.</strong> Pourquoi le cloud met-il plus de temps à produire le premier token,
            mais génère-t-il ensuite plus de tokens par seconde ? Qu’est-ce qui changerait si vous étiez sur le même réseau que la grappe de GPU ?
          </p>
        </div>
      ),
    },
    {
      label: 'Dans la vraie vie',
      color: '#e87a96',
      defaultOpen: false,
      content: (
        <div>
          <p style={{ marginBottom: 14 }}>
            Choisir entre cloud et local n’est pas qu’une question technique : cela façonne des secteurs entiers.
          </p>
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #e87a96' }}>
              <strong style={{ color: '#e87a96' }}>Santé (le local l’emporte)</strong>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                Les hôpitaux utilisent une IA locale pour analyser les dossiers des patients. La réglementation (HIPAA aux États-Unis, RGPD et hébergement de données de santé en France) encadre strictement ces données.
                L’historique médical d’un patient ne devrait jamais traverser internet pour atteindre un GPU dans le cloud.
              </div>
            </div>
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #6ec0e8' }}>
              <strong style={{ color: '#6ec0e8' }}>Startups (le cloud l’emporte)</strong>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                Une startup qui sert un million d’utilisateurs ne peut pas acheter 100 A100 dès le premier jour. Le cloud lui permet d’augmenter
                ou de réduire sa consommation de GPU selon la demande, en ne payant que ce qu’elle utilise.
              </div>
            </div>
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid var(--brand)' }}>
              <strong style={{ color: 'var(--brand)' }}>IA embarquée (combler l’écart)</strong>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                Les téléphones et ordinateurs portables embarquent désormais des processeurs neuronaux et de la mémoire unifiée pensés pour les modèles
                locaux, et des stations de travail dédiées à l’IA font tourner des modèles de plus de 100 milliards de paramètres sur votre bureau. Le matériel
                réduit peu à peu le dilemme entre puissance et confidentialité.
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ],
}
