// Lesson 3: embeddings (/understand page)
// Map words stay in English: they are the embedding model's data.
import { Accent, PythonCode } from '../../../components/LessonBits'

export default {
  titleStart: "L’IA ne voit pas que des nombres.",
  titleAccent: "Elle saisit le sens.",
  subtitle: "L’IA a rangé ces mots selon leur sens, sans que personne ne lui dise lesquels étaient liés. (Les mots sont en anglais, la langue du modèle utilisé.)",
  placeholder: "Tapez un mot (en anglais) ou cliquez sur la carte pour le mettre en valeur…",
  search: "Chercher",
  explainer: <>
    <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
      Qu’est-ce qu’un embedding ?
    </h3>
    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
      Un embedding (ou « plongement » en français) est une façon de transformer un mot en une liste de nombres qui capture son{' '}
      <span style={{ color: 'var(--text-primary)' }}>sens</span>. Le modèle apprend ces nombres
      pendant l’entraînement, de sorte que les mots de sens proche se retrouvent avec des nombres proches. Chaque point de la
      carte ci-dessus est un mot, placé en fonction de son embedding.
    </p>

    <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
      Qu’est-ce qu’un vecteur ?
    </h3>
    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
      Un vecteur, c’est simplement une liste de nombres : comme des coordonnées GPS, mais avec beaucoup plus de dimensions. L’embedding
      de chaque mot est un vecteur de{' '}
      <span style={{ color: 'var(--text-primary)' }}>768 nombres</span>. Impossible de se représenter 768
      dimensions : la carte ci-dessus les compresse donc en 2. Même dans cette vue simplifiée, on voit
      que les mots liés se regroupent : les animaux près des animaux, les émotions près des émotions.
    </p>
  </>,
  depthSections: [
    {
      label: 'Le concept',
      color: 'var(--brand)',
      defaultOpen: true,
      content: (
        <div>
          <p style={{ marginBottom: 20 }}>
            Le nuage de points ci-dessus projette 768 dimensions sur seulement 2 grâce à{' '}
            <strong style={{ color: 'var(--text-primary)' }}>l’ACP (analyse en composantes principales, ou PCA en anglais)</strong>.
            Même dans cette vue 2D grossière, on distingue des groupes de sens : les animaux ensemble, les émotions ensemble,
            les lieux ensemble. Dans l’espace complet à 768 dimensions, ces relations sont bien plus riches.
          </p>

          <p style={{ marginBottom: 16 }}>
            <strong style={{ color: 'var(--brand)', fontSize: 15 }}>Pourquoi 768 nombres ?</strong>
          </p>
          <p style={{ marginBottom: 12 }}>
            Chaque dimension capture un aspect du sens. Aucune dimension ne veut dire à elle seule « est un animal » ou
            « est une couleur » : le sens est réparti sur l’ensemble des dimensions. C’est pour cela qu’on parle de{' '}
            <strong style={{ color: 'var(--text-primary)' }}>représentations distribuées.</strong>
          </p>

          <div style={{
            padding: '12px 16px',
            background: 'rgba(248, 95, 0,0.06)',
            border: '1px solid rgba(248, 95, 0,0.25)',
            borderRadius: 8,
            marginBottom: 20,
          }}>
            <strong style={{ color: 'var(--brand)' }}>Similarité cosinus</strong>
            <div style={{ marginTop: 4, fontSize: 13 }}>
              On mesure la ressemblance entre deux embeddings avec la similarité cosinus, qui dépend de l’angle entre les deux vecteurs.
              cos(0°) = 1,0 signifie la même direction (sens identique). cos(90°) = 0 signifie aucun rapport.
              « cat » (chat) et « kitten » (chaton) peuvent avoir une similarité de 0,92 ; « cat » et « javascript », plutôt 0,15.
            </div>
          </div>

          <p style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(248, 95, 0,0.06)', borderRadius: 8, borderLeft: '3px solid var(--brand)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>À retenir :</strong>{' '}
            les embeddings font le pont entre le langage humain et le calcul de la machine. Le tokeniseur
            convertit les mots en identifiants (leçon précédente). La couche d’embeddings convertit ces identifiants en vecteurs
            riches de sens. Tout ce que l’IA « comprend » vit dans cet espace géométrique.
          </p>
        </div>
      ),
    },
    {
      label: 'Le code',
      color: '#6ec0e8',
      content: (
        <PythonCode code={`import ollama

# Obtenir des embeddings avec nomic-embed-text (768 dimensions)
response = ollama.embed(
    model="nomic-embed-text",
    input=["cat", "kitten", "javascript"]
)

cat_vec = response["embeddings"][0]      # 768 nombres
kitten_vec = response["embeddings"][1]
js_vec = response["embeddings"][2]

print(f"Dimensions : {len(cat_vec)}")  # 768

# ── Similarité cosinus ────────────────────────────
import numpy as np

def cosine_sim(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

print(f"cat ↔ kitten:     {cosine_sim(cat_vec, kitten_vec):.3f}")  # ~0.92
print(f"cat ↔ javascript: {cosine_sim(cat_vec, js_vec):.3f}")      # ~0.15

# ── Arithmétique des mots ─────────────────────────
king = ollama.embed(model="nomic-embed-text", input=["king"])["embeddings"][0]
man  = ollama.embed(model="nomic-embed-text", input=["man"])["embeddings"][0]
woman = ollama.embed(model="nomic-embed-text", input=["woman"])["embeddings"][0]

result = np.array(king) - np.array(man) + np.array(woman)
# Chercher le mot le plus proche → "queen" (reine)`} />
      ),
    },
    {
      label: 'Défi',
      color: '#e8d06e',
      content: (
        <div>
          <p style={{ marginBottom: 10 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Réfléchissez :</strong>
          </p>
          <p style={{ marginBottom: 12 }}>
            Pourquoi « doctor » (médecin) pourrait-il être plus proche de « man » (homme) que de « woman » (femme) dans certains espaces d’embeddings ?
            Qu’est-ce que cela nous apprend sur les données d’entraînement ?
          </p>
          <p style={{ marginBottom: 8, paddingLeft: 16 }}>
            <strong style={{ color: '#e8d06e' }}>1.</strong> Cliquez sur « doctor » et « nurse » (infirmière) sur la carte ci-dessus.
            Regardez leurs plus proches voisins. Remarquez-vous un schéma lié au genre ?
          </p>
          <p style={{ marginBottom: 8, paddingLeft: 16 }}>
            <strong style={{ color: '#e8d06e' }}>2.</strong> Si les embeddings apprennent à partir de textes, et que ces
            textes contiennent des biais (par exemple « le médecin… il » contre « l’infirmière… elle »), où finissent ces biais ?
          </p>
          <p style={{ paddingLeft: 16 }}>
            <strong style={{ color: '#e8d06e' }}>3.</strong> Comment pourrait-on corriger les biais des embeddings ? Peut-on supprimer
            la « direction du genre » sans perdre d’autres informations utiles ?
          </p>
        </div>
      ),
    },
    {
      label: 'Dans la vraie vie',
      color: '#e87a96',
      content: (
        <div>
          <p style={{ marginBottom: 14 }}>
            Les embeddings font tourner la plupart des fonctionnalités d’IA que vous utilisez au quotidien, souvent sans que vous le voyiez.
          </p>
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #6ec0e8' }}>
              <strong style={{ color: '#6ec0e8' }}>Moteurs de recherche</strong>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                Google transforme votre requête en embedding et la compare aux embeddings des documents. Chercher « réparer un pneu à plat »
                trouve des pages sur « changer une roue crevée » : des mots différents, mais le même voisinage dans l’espace du sens.
              </div>
            </div>
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #e8d06e' }}>
              <strong style={{ color: '#e8d06e' }}>RAG (génération augmentée par récupération)</strong>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                Quand ChatGPT cherche sur le web ou lit des documents pour vous répondre, il utilise des embeddings pour trouver
                les passages les plus pertinents. C’est ainsi qu’une IA « connaît » les documents internes de votre entreprise.
              </div>
            </div>
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #e87a96' }}>
              <strong style={{ color: '#e87a96' }}>Systèmes de recommandation</strong>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                Netflix, Spotify et YouTube placent les contenus et les utilisateurs dans le même espace. Si votre « vecteur utilisateur »
                est proche de l’embedding d’un film, il vous plaira probablement. Mêmes maths, autre domaine.
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ],
  bridge: <>
    Les mots ont un sens. Mais comment le modèle sait-il quels sens comptent
    pour chaque prédiction ? C’est là qu’intervient l’attention.
  </>,
  ctaNext: "Voir comment l’IA fait attention",

  // Meaning map (MeaningMap)
  map: {
    categories: { animal: 'Animaux', emotion: 'Émotions', technology: 'Technologie', food: 'Nourriture', place: 'Lieux', person: 'Personnes' },
    fullscreen: "Plein écran",
    exitFullscreen: "Quitter le plein écran",
    zoomHint: "molette pour zoomer · glisser pour se déplacer",
    position: "Position :",
  },

  // Word arithmetic (WordArithmetic).
  // In experiments, only translate label and insight: a, b, c, result and
  // arithmeticKey are map words (in English).
  arithmetic: {
    title: "Arithmétique des mots",
    allExplored: "Tout exploré : vous comprenez maintenant l’espace du sens.",
    notInMap: "(mot absent de la carte : essayez des mots du nuage de points)",
    pickWord: "choisir un mot",
    // Translation shown in parentheses next to the English words in the list
    wordGloss: {
      king: 'roi', queen: 'reine', man: 'homme', woman: 'femme', doctor: 'médecin', nurse: 'infirmière',
      cat: 'chat', dog: 'chien', fish: 'poisson', bird: 'oiseau',
      Paris: 'Paris', France: 'France', Japan: 'Japon', Tokyo: 'Tokyo',
      happy: 'heureux', sad: 'triste', love: 'amour', fear: 'peur',
      computer: 'ordinateur', pizza: 'pizza', coffee: 'café', ocean: 'océan',
    },
    experiments: [
      {
        key: 'king_woman',
        icon: '👑',
        label: <><Accent>King</Accent> (roi) − <Accent>Man</Accent> (homme) + <Accent>Woman</Accent> (femme) = ?</>,
        a: 'king',
        b: 'man',
        c: 'woman',
        result: 'queen',
        arithmeticKey: 'king_man_woman',
        insight: {
          headline: 'L’IA a appris la notion de genre à partir du seul texte.',
          body: <>
            Personne n’a dit au modèle que « king » (roi) et « queen » (reine) étaient liés. En lisant des milliards de phrases,
            il a découvert que la <strong style={{ color: 'var(--text-primary)' }}>différence entre les vecteurs</strong> de
            « king » et de « man » (homme) est presque identique à celle entre « queen » et « woman » (femme).
            Le modèle encode des relations abstraites sous forme de directions dans l’espace du sens.
          </>,
          nextHint: 'Essayez la suivante : l’IA a appris la géographie sans jamais voir de carte →',
        },
      },
      {
        key: 'paris_japan',
        icon: '🗼',
        label: <><Accent>Paris</Accent> − <Accent>France</Accent> + <Accent>Japan</Accent> (Japon) = ?</>,
        a: 'Paris',
        b: 'France',
        c: 'Japan',
        result: 'Tokyo',
        arithmeticKey: 'paris_france_japan',
        insight: {
          headline: 'L’IA a appris la géographie sans jamais voir de carte.',
          body: <>
            La direction qui va de « France » à « Paris » encode la notion de <strong style={{ color: 'var(--text-primary)' }}>« capitale de »</strong>.{' '}
            Appliquez cette même direction en partant de « Japan » (Japon) et vous arrivez près de « Tokyo ».
            Le modèle a construit une carte géométrique des pays et de leurs capitales uniquement en lisant du texte :
            pas d’atlas, pas de coordonnées GPS, aucun enseignement explicite.
          </>,
          nextHint: 'Maintenant, essayez votre propre équation et découvrez quelles autres relations l’IA a apprises →',
        },
      },
      {
        key: 'custom',
        icon: '🧪',
        label: <>Créez votre propre équation de mots</>,
        isCustom: true,
        insight: {
          headline: 'Ces relations émergent toutes seules à force de lire des milliards de phrases.',
          body: <>
            Personne ne programme ces relations à la main. Pendant l’entraînement, le modèle apprend à prédire le mot suivant
            d’une phrase. Pour bien y arriver, il <em>doit</em> comprendre que « king » est à « queen » ce que
            « man » est à « woman ». La géométrie de l’espace du sens est un
            <strong style={{ color: 'var(--text-primary)' }}> effet secondaire de l’apprentissage de la prédiction de texte.</strong>
          </>,
          nextHint: null,
        },
      },
    ],
  },
}
