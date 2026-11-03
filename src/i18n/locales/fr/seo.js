// Textes SEO (fr) : titres, descriptions, texte « Pour aller plus loin »
// et appels à l'action de fin de leçon. Lu par le site ET par scripts/prerender.mjs :
// gardez ce fichier en JavaScript simple (pas de JSX).

const ROUTES = {
  '/': {
    title: 'Comprendre comment fonctionne l’IA, de façon interactive | howaiworks.io',
    description:
      'Ne vous contentez pas de lire sur l’IA : expérimentez-la. Des leçons interactives et gratuites sur la tokenisation, les embeddings, l’attention et l’inférence. Voyez ce qui se passe à l’intérieur de la machine.',
    proseTitle: 'Ce que vous allez apprendre ici',
    sections: [
      {
        heading: 'Des leçons interactives, pas des cours magistraux',
        paragraphs: [
          'howaiworks.io est une plateforme d’apprentissage gratuite et open source où l’on découvre le fonctionnement réel de l’IA moderne en la manipulant, plutôt qu’en lisant à son sujet. Chaque leçon est une démo à faire soi-même : tapez une phrase et regardez le vrai tokeniseur de GPT la découper en tokens, explorez une carte des embeddings où les mots sont rangés selon leur sens, suivez comment le mécanisme d’attention d’un transformer comprend à quoi renvoie le mot « il », et faites tourner un vrai modèle de langage directement dans votre navigateur.',
          'Les leçons s’enchaînent dans l’ordre même où un système d’IA traite le langage : d’abord un peu d’histoire pour comprendre comment on en est arrivé là, puis la tokenisation (comment le texte devient des nombres), les embeddings (comment ces nombres capturent le sens), l’attention (comment le modèle tient compte du contexte) et enfin l’inférence (où et comment les modèles tournent réellement).',
        ],
      },
      {
        heading: 'À qui s’adresse ce site',
        paragraphs: [
          'Les leçons sont pensées pour les étudiants qui suivent leur premier cours d’IA ou de traitement du langage, les enseignants qui cherchent des démonstrations à projeter en classe, les développeurs autodidactes qui veulent comprendre ce qu’il y a derrière les API qu’ils utilisent, et toutes les personnes curieuses de savoir ce qui se passe vraiment dans ChatGPT, Claude et les autres grands modèles de langage. Aucune connaissance en maths ni en programmation n’est nécessaire pour commencer : chaque notion est quelque chose que vous pouvez voir et manipuler directement.',
        ],
      },
    ],
  },

  '/what-is-ai': {
    title: 'Qu’est-ce que l’IA ? Les quatre grandes ères de son histoire, en animation | howaiworks.io',
    description:
      'De la question posée par Turing en 1950 jusqu’à ChatGPT : un tour animé des quatre ères de l’IA, des règles symboliques à l’IA générative, en passant par l’apprentissage automatique et l’apprentissage profond.',
    proseTitle: 'Les quatre ères de l’IA, en bref',
    sections: [
      {
        heading: 'Des règles écrites à la main aux comportements appris',
        paragraphs: [
          'L’intelligence artificielle n’est pas apparue du jour au lendemain : elle a traversé quatre grandes ères. L’ère symbolique commence avec l’article d’Alan Turing de 1950, « Computing Machinery and Intelligence », et cherche à décrire l’intelligence sous forme de règles écrites à la main : si X, alors Y. Elle a donné des programmes d’échecs et des systèmes experts, mais des règles écrites par des humains ne pouvaient jamais couvrir toute la complexité du monde réel.',
          'L’ère de l’apprentissage automatique (machine learning) renverse la logique : au lieu d’écrire des règles, on laisse l’ordinateur trouver lui-même des régularités dans des exemples. Des algorithmes comme les machines à vecteurs de support (SVM, 1992) apprennent à séparer des catégories à partir de données. Ils font tourner les filtres anti-spam et les systèmes de recommandation, mais ce sont encore des humains qui doivent choisir à la main les caractéristiques (features) que le modèle observe.',
        ],
      },
      {
        heading: 'L’apprentissage profond puis l’explosion de l’IA générative',
        paragraphs: [
          'En 2012, la victoire d’AlexNet au concours ImageNet lance l’ère de l’apprentissage profond (deep learning) : des réseaux de neurones à nombreuses couches qui apprennent eux-mêmes leurs caractéristiques à partir des données brutes, grâce aux cartes graphiques (GPU) et à d’énormes jeux de données. En quelques années, la reconnaissance d’images, la reconnaissance vocale et la traduction passent de « ça marche à peine » à « mieux que les humains ».',
          'L’ère générative actuelle remonte à un seul article de 2017, « Attention Is All You Need », qui présente l’architecture transformer. Entraînés sur des téraoctets de texte avec un objectif d’une simplicité trompeuse (prédire le mot suivant), les transformers se révèlent capables d’absorber la grammaire, des connaissances et des schémas de raisonnement. Ce sont eux qui font tourner les grands modèles de langage derrière ChatGPT, Claude et Gemini. La frise interactive de cette page parcourt les quatre ères, avec l’article fondateur de chacune.',
        ],
      },
    ],
  },

  '/tokenize': {
    title: 'Tokeniseur interactif : voyez le texte comme GPT le voit | howaiworks.io',
    description:
      'Tapez n’importe quoi et regardez le vrai tokeniseur de GPT-4 (cl100k_base) le découper en tokens, en direct. Comprenez pourquoi l’IA se trompe en comptant les lettres et pourquoi certaines langues coûtent plus cher.',
    proseTitle: 'Qu’est-ce que la tokenisation ?',
    sections: [
      {
        heading: 'Comment l’IA lit votre texte',
        paragraphs: [
          'Un modèle de langage ne voit jamais de lettres ni de mots : il voit des tokens. Avant que votre message n’atteigne le modèle, un tokeniseur le découpe en morceaux tirés d’un vocabulaire fixe, puis remplace chaque morceau par un nombre (un identifiant de token). La démo de cette page fait tourner cl100k_base, le véritable tokeniseur à encodage par paires d’octets (BPE, Byte Pair Encoding) utilisé par GPT-4, directement dans votre navigateur : tout ce que vous tapez est découpé en direct, et vous pouvez même modifier les identifiants bruts pour voir le texte qui en ressort.',
          'Les mots courants comme « the » tiennent en un seul token, tandis que les mots plus rares sont découpés en sous-morceaux. C’est pour cela que « strawberry » (fraise, en anglais) est découpé en plusieurs tokens, et que les modèles de langage ont du mal à compter les « r » qu’il contient : le modèle ne voit tout simplement jamais les lettres une par une.',
        ],
      },
      {
        heading: 'Pourquoi les tokens comptent en pratique',
        paragraphs: [
          'Le token est l’unité de mesure de toute l’IA moderne : les API sont facturées au token, la mémoire de travail d’un modèle (sa fenêtre de contexte) se mesure en tokens, et la vitesse de génération s’exprime en tokens par seconde. La tokenisation pose aussi une question d’équité : la même phrase en arabe ou en hindi peut coûter plusieurs fois plus de tokens qu’en anglais, parce que les vocabulaires des tokeniseurs ont surtout été construits à partir de textes anglais. Le français s’en sort un peu moins bien que l’anglais, lui aussi. Essayez de taper مرحبا dans la démo et comparez le nombre de tokens avec « hello ».',
        ],
      },
    ],
  },

  '/understand': {
    title: 'Les embeddings en images : comment l’IA comprend le sens des mots | howaiworks.io',
    description:
      'Explorez une carte interactive où les mots se regroupent selon leur sens, et essayez l’arithmétique des vecteurs, comme roi − homme + femme = reine. Voyez comment l’IA transforme les mots en géométrie.',
    proseTitle: 'Qu’est-ce qu’un embedding (plongement de mots) ?',
    sections: [
      {
        heading: 'Le sens devient de la géométrie',
        paragraphs: [
          'Une fois que la tokenisation a transformé votre texte en nombres, les embeddings (ou « plongements », en français) donnent du sens à ces nombres. Chaque token est associé à un vecteur : une longue liste de nombres qui joue le rôle de coordonnées dans un espace à très grand nombre de dimensions. Les mots employés dans des contextes similaires se retrouvent proches les uns des autres : « cat » (chat) se place près de « dog » (chien), « Paris » près de « London » (Londres). La carte du sens de cette page projette de vrais embeddings sur deux dimensions pour que vous puissiez voir ces voisinages se former.',
        ],
      },
      {
        heading: 'L’arithmétique des vecteurs : roi − homme + femme = reine',
        paragraphs: [
          'La propriété la plus frappante des embeddings, c’est que les directions dans cet espace ont un sens. Prenez le vecteur de « roi », retirez-lui celui d’« homme », ajoutez celui de « femme » : le mot le plus proche du résultat est « reine ». La direction du genre, celle du pluriel, et même celle « capitale de tel pays » émergent uniquement des régularités du texte : personne ne les a programmées. La démo d’arithmétique des mots vous permet d’essayer ces équations vous-même avec de vraies données d’embeddings.',
          'Les embeddings sont aussi la technologie derrière la recherche sémantique et la génération augmentée par récupération (RAG) : quand une application « trouve les documents pertinents », elle compare en réalité des vecteurs d’embeddings. Comprendre cette page, c’est comprendre la moitié du fonctionnement des produits d’IA modernes.',
        ],
      },
    ],
  },

  '/attention': {
    title: 'Comment fonctionne l’attention dans les transformers, de façon interactive | howaiworks.io',
    description:
      'Dans « The animal didn’t cross the street because it was tired », à quoi renvoie « it » ? Regardez l’auto-attention d’un transformer le découvrir, étape par étape.',
    proseTitle: 'Qu’est-ce que l’attention ?',
    sections: [
      {
        heading: 'Comment un modèle décide de ce qui compte',
        paragraphs: [
          'Les embeddings donnent un sens à chaque mot, mais le sens dépend du contexte : le mot « il », tout seul, ne veut rien dire. L’auto-attention (self-attention) est le mécanisme qui permet à chaque token d’une phrase de regarder tous les autres et de décider lesquels comptent pour l’interpréter. Dans l’exemple classique de cette page, « The animal didn’t cross the street because it was tired » (« L’animal n’a pas traversé la rue parce qu’il était fatigué »), c’est grâce à l’attention que le modèle relie « it » à « animal » plutôt qu’à « street » (la rue). Et si vous remplacez « tired » (fatigué) par « wide » (large), le lien bascule.',
        ],
      },
      {
        heading: 'Têtes, couches, et pourquoi ça passe à l’échelle',
        paragraphs: [
          'Les vrais transformers font tourner de nombreuses têtes d’attention en parallèle (l’une peut suivre les liens sujet–verbe pendant qu’une autre suit les pronoms) et empilent des dizaines de couches : les couches supérieures s’appuient sur les précédentes pour saisir des relations de plus en plus abstraites. C’est l’idée centrale de l’article « Attention Is All You Need » de 2017, et c’est le mécanisme qui explique le plus les capacités de GPT-4, de Claude et de tous les grands modèles de langage modernes. La démo interactive vous laisse survoler chaque mot pour voir ses liens d’attention, puis va plus loin avec le concept, le vrai code et un défi.',
        ],
      },
    ],
  },

  '/run': {
    title: 'Faites tourner un LLM dans votre navigateur : IA dans le cloud ou en local | howaiworks.io',
    description:
      'Discutez avec un vrai modèle de langage qui tourne entièrement dans votre navigateur grâce à WebGPU, puis faites-lui faire la course contre le cloud. Comprenez les compromis entre confidentialité, coût et vitesse.',
    proseTitle: 'Où l’IA tourne-t-elle vraiment ?',
    sections: [
      {
        heading: 'Un vrai modèle, sur votre machine, maintenant',
        paragraphs: [
          'Chaque leçon précédente montrait un morceau de la chaîne ; celle-ci fait tourner l’ensemble. Grâce à WebLLM et WebGPU, cette page télécharge un petit modèle de langage compressé (Qwen 2.5, 0,5 milliard de paramètres) et effectue l’inférence entièrement dans l’onglet de votre navigateur. Pas de serveur, pas de clé d’API : les tokens sont générés par votre propre carte graphique. Si votre navigateur ne prend pas en charge WebGPU, un enregistrement vous montre à quoi cela ressemble.',
        ],
      },
      {
        heading: 'Cloud ou local : les vrais compromis',
        paragraphs: [
          'Les modèles dans le cloud, comme GPT-4 et Claude, sont énormes, rapides et toujours à jour, mais vous payez au token et vos données quittent votre machine. Les modèles locaux sont privés, gratuits à utiliser et fonctionnent hors ligne, mais au prix d’un modèle plus petit et plus lent. La course de latence de cette page rend la différence très concrète, et les fiches de comparaison détaillent quand chaque option l’emporte : les données sensibles, les gros volumes à petit budget et l’usage hors ligne favorisent le local ; les capacités les plus avancées favorisent le cloud.',
          'Ce compromis devient central dans la façon dont l’IA est déployée, des téléphones qui embarquent un assistant directement sur l’appareil jusqu’aux stations de travail dotées d’une grande mémoire unifiée, conçues pour faire tourner de très gros modèles sur votre bureau.',
        ],
      },
    ],
  },

  '/about': {
    title: 'À propos de howaiworks.io : apprendre l’IA en la manipulant, par Matt Feroz',
    description:
      'howaiworks.io rend l’apprentissage de l’IA concret : des leçons open source et pratiques où vous expérimentez directement la tokenisation, les embeddings, l’attention et l’inférence.',
    proseTitle: 'À propos de ce projet',
    sections: [
      {
        heading: 'Pourquoi howaiworks.io existe',
        paragraphs: [
          'howaiworks.io est né d’un constat simple : la plupart des gens utilisent l’IA tous les jours, mais presque personne ne sait ce qui se passe réellement à l’intérieur. Lire des articles n’y change pas grand-chose ; l’expérimenter, si. Alors, au lieu de diapositives et de cours, chaque leçon ici est quelque chose que vous faites. Tapez du texte et regardez-le devenir des tokens. Parcourez une carte du sens. Faites tourner un modèle sur votre propre carte graphique.',
          'Toute la plateforme est open source sous licence MIT, utilisable gratuitement en classe, et a été créée par Matt Feroz, coach et ingénieur en IA qui aide les professionnels à mettre l’IA au service de leur travail. Le projet fait partie d’un écosystème d’apprentissage plus large (ateliers en direct, communauté d’apprentissage et coaching individuel) sur matthewferoz.com. Cette version française est une adaptation du projet original.',
        ],
      },
    ],
  },

  '/resources': {
    title: 'Ressources pour apprendre l’IA : articles, outils et visualisations | howaiworks.io',
    description:
      'Une sélection des meilleures ressources gratuites pour comprendre l’IA : articles fondateurs, visualisations interactives, outils de tokenisation et explications, classés par leçon.',
    proseTitle: 'À propos de ces ressources',
    sections: [
      {
        heading: 'Une sélection, pas une liste exhaustive',
        paragraphs: [
          'Les contenus sur l’IA ne manquent pas ; le vrai problème, c’est de savoir ce qui vaut votre temps. Cette page rassemble les ressources qui complètent le mieux chaque leçon interactive de howaiworks.io : les articles fondateurs derrière chaque idée (de l’article original sur la tokenisation BPE jusqu’à « Attention Is All You Need »), les meilleures visualisations indépendantes comme la visualisation de LLM de Brendan Bycroft, et les bibliothèques sur lesquelles reposent les démos de ce site, comme js-tiktoken et WebLLM. Tout ce qui est listé est gratuit. La plupart de ces ressources sont en anglais.',
        ],
      },
    ],
  },
}

// Appels à l'action affichés à la fin de chaque leçon.
const utm = (path) => `utm_source=howaiworks.io&utm_medium=lesson-cta&utm_campaign=${path.slice(1)}`

const FUNNEL_CTAS = {
  '/what-is-ai': {
    headline: 'Vous venez d’avoir la vue d’ensemble.',
    body: 'Envie de savoir où l’IA trouve sa place dans votre travail ? Faites le quiz gratuit « 100 Hours Back AI Roadmap » : deux minutes, et vous obtenez un plan personnalisé de ce qu’il faut apprendre et automatiser en premier (en anglais).',
    buttonText: 'Obtenir ma feuille de route IA',
    buttonUrl: `https://matthewferoz.com/roadmap/?${utm('/what-is-ai')}`,
    secondaryText: 'ou rejoignez la communauté How AI Works, où l’on discute de ces leçons (en anglais)',
    secondaryUrl: 'https://www.skool.com/feroz-academy-1644',
  },
  '/tokenize': {
    headline: 'Vous savez maintenant ce que l’IA voit vraiment.',
    body: 'La plupart des professionnels n’apprennent jamais cela, et c’est pour ça que leurs prompts donnent des résultats décevants. Continuez sur votre lancée : rejoignez la communauté How AI Works pour des sessions en direct, des analyses de prompts et des gens qui apprennent comme vous venez de le faire (en anglais).',
    buttonText: 'Rejoindre la communauté',
    buttonUrl: 'https://www.skool.com/feroz-academy-1644',
    secondaryText: 'ou obtenez un plan personnalisé avec le quiz gratuit AI Roadmap',
    secondaryUrl: `https://matthewferoz.com/roadmap/?${utm('/tokenize')}`,
  },
  '/understand': {
    headline: 'Les embeddings font tourner la moitié des outils d’IA que vous utilisez.',
    body: 'Recherche sémantique, RAG, recommandations : vous comprenez maintenant le moteur qui se cache derrière. Le quiz gratuit « 100 Hours Back AI Roadmap » transforme cette compréhension en plan concret pour votre propre travail (en anglais).',
    buttonText: 'Obtenir ma feuille de route IA',
    buttonUrl: `https://matthewferoz.com/roadmap/?${utm('/understand')}`,
    secondaryText: 'ou rejoignez la communauté How AI Works',
    secondaryUrl: 'https://www.skool.com/feroz-academy-1644',
  },
  '/attention': {
    headline: 'Vous comprenez les transformers mieux que la plupart des gens qui les utilisent.',
    body: 'C’est exactement le genre de sujet que l’on approfondit dans la communauté How AI Works : ateliers en direct, projets concrets et réponses franches sur ce qui fonctionne vraiment (en anglais).',
    buttonText: 'Rejoindre la communauté',
    buttonUrl: 'https://www.skool.com/feroz-academy-1644',
    secondaryText: 'ou voir les prochains ateliers en direct',
    secondaryUrl: `https://matthewferoz.com/events/?${utm('/attention')}`,
  },
  '/run': {
    headline: 'Vous avez maintenant vu toute la chaîne.',
    body: 'Tokens, sens, attention, inférence : voilà comment fonctionne l’IA. La question suivante, c’est comment elle peut fonctionner pour vous. Matt accompagne des professionnels en coaching individuel pour mettre l’IA au travail : réservez un appel gratuit pour découvrir ce qui est possible (en anglais).',
    buttonText: 'Réserver un appel gratuit',
    buttonUrl: `https://matthewferoz.com/coaching/?${utm('/run')}`,
    secondaryText: 'pas encore prêt ? Commencez par le quiz gratuit AI Roadmap',
    secondaryUrl: `https://matthewferoz.com/roadmap/?${utm('/run')}`,
  },
}

const NAV_LABELS = {
  '/': 'Accueil',
  '/what-is-ai': 'C’est quoi l’IA ?',
  '/tokenize': 'Tokeniser',
  '/understand': 'Comprendre',
  '/attention': 'Attention',
  '/run': 'Exécuter',
  '/about': 'À propos',
  '/resources': 'Ressources',
}

// Phrase de bas de page du HTML pré-rendu (pour les robots) ; {name}, {github} et {author} sont remplacés.
const STATIC_FOOTER = '{name} est gratuit et open source ({github}), créé par {author}.'

export default { ROUTES, FUNNEL_CTAS, NAV_LABELS, STATIC_FOOTER }
