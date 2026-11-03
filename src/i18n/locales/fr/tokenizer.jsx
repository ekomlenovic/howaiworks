// Lesson 2: tokenization (/tokenize page)
import { Accent, StepBox, PythonCode } from '../../../components/LessonBits'

export default {
  hero: {
    titleStart: "L’IA ne lit pas des mots. Elle lit des",
    titleAccent: "nombres.",
    subtitle: "Avant de pouvoir faire quoi que ce soit de votre texte, l’IA doit le découper en petits morceaux appelés tokens. Tapez ci-dessous et voyez exactement comment.",
  },

  // Phrases auto-typed in the demo (the last one is an easter egg)
  demoPhrases: [
    'Comment fonctionne l’IA ?',
    'Continue à nager.',
    'Résume ce document pour moi.',
    'Bonjour le monde !',
    'Corrige le bug dans mon code.',
    'Un grand pouvoir implique de grandes responsabilités.',
    'Explique-moi comme si j’avais cinq ans.',
    "Je suis désolé, Dave. J’ai bien peur de ne pas pouvoir faire ça.", // easter egg — last
  ],

  yourText: "Votre texte",
  typePlaceholder: "Tapez ce que vous voulez ici…",
  loading: "Chargement du tokeniseur…",
  whatAISees: "Ce que voit l’IA",
  idsPlaceholder: "Les identifiants des tokens apparaissent ici…",

  // Stats bar under the demo (tooltips on hover)
  stats: {
    tokens: { unit: "tokens", text: "L’IA ne sait pas lire du texte. Elle découpe ce que vous écrivez en petits morceaux appelés tokens, souvent des bouts de mots plutôt que des mots entiers. « strawberry » devient 3 tokens : « str », « aw », « berry ». Tout ce que fait l’IA part de ces fragments.", linkHref: "https://platform.openai.com/tokenizer", linkLabel: "Essayer le tokeniseur d’OpenAI" },
    characters: { unit: "caractères", text: "Les lettres, espaces et symboles bruts que vous avez tapés : ce que lisent les humains. L’IA ne les voit jamais directement. Elle les convertit d’abord en tokens, c’est pourquoi le nombre de tokens est toujours différent du nombre de caractères.", linkHref: "https://huggingface.co/learn/llm-course/en/chapter2/4", linkLabel: "Comment fonctionnent les tokeniseurs (en anglais)" },
    ratio: { unit: "car./token", text: "Le nombre moyen de caractères par token. En anglais, on tourne autour de 4 caractères par token. Un ratio plus faible signifie plus de tokens pour le même texte, donc une IA plus lente et plus chère. Les langues autres que l’anglais (dont le français) ont souvent un ratio moins bon.", linkHref: "https://huggingface.co/spaces/Xenova/the-tokenizer-playground", linkLabel: "Bac à sable des tokeniseurs" },
    cost: { unit: "appel", text: "Les API d’IA facturent au token, pas au mot ni au message. Cette estimation utilise le tarif d’entrée de GPT-4 (~0,03 $ pour 1 000 tokens). Plus de tokens = plus cher : c’est pourquoi une tokenisation moins efficace pour les textes non anglais crée une vraie inégalité de coût.", linkHref: "https://openai.com/api/pricing/", linkLabel: "Tarifs d’OpenAI" },
  },

  whatIsToken: { title: "Qu’est-ce qu’un token ?", body: "Un token est un petit morceau de texte : un mot entier, un bout de mot, voire un seul caractère. L’IA ne lit pas les mots comme vous. Elle commence par tout découper en morceaux de ce genre. Chaque bloc coloré ci-dessus est un token." },
  whatIsTokenizer: {
    title: "Qu’est-ce qu’un tokeniseur ?",
    body: <>Le tokeniseur est l’outil qui décide où couper. Celui qui tourne ici est <span style={{ color: 'var(--text-primary)' }}>cl100k_base</span>, le même que celui de ChatGPT et GPT-4. Il possède un vocabulaire d’environ 100 000 tokens, et chaque morceau de texte que vous tapez est associé à des entrées de ce vocabulaire. C’est la toute première étape qu’effectue un modèle de langage avant de pouvoir comprendre quoi que ce soit.</>,
  },

  // "Try…" nudges. `text` is typed into the demo on click.
  nudges: [
  {
    key: 'strawberry',
    icon: '🍓',
    text: 'strawberry',
    label: <>Essayez <Accent>strawberry</Accent> (fraise) : pourquoi l’IA a-t-elle autant de mal ?</>,
    insight: {
      headline: 'L’IA ne sait pas épeler, et voici pourquoi.',
      body: <>
        « strawberry » devient 3 tokens : <strong style={{ color: 'var(--text-primary)' }}>« str » + « aw » + « berry »</strong>.
        Quand vous demandez à une IA « combien de r dans strawberry ? », elle ne voit jamais les lettres une par une :
        elle voit 3 fragments opaques. Les « r » sont éparpillés entre les frontières des tokens, invisibles pour le modèle.
        C’est la cause profonde des célèbres erreurs d’orthographe de l’IA. (Et en français ? « fraise » devient « f » + « raise ».)
      </>,
      nextHint: 'Essayez maintenant un mot très long : voyez ce qui se passe quand l’IA rencontre un mot rare ↓',
    },
  },
  {
    key: 'supercalifragilistic',
    icon: '☂️',
    text: 'supercalifragilisticexpialidocious',
    label: <>Essayez <Accent>supercalifragilisticexpialidocious</Accent> : 1 mot pour vous, 11 fragments pour l’IA</>,
    insight: {
      headline: 'Plus le mot est rare, plus l’IA travaille.',
      body: <>
        Vous prononcez ce mot d’une seule traite. L’IA a besoin d’<strong style={{ color: 'var(--text-primary)' }}>environ 11 tokens</strong> rien
        que pour le représenter. Le tokeniseur a été construit à partir de textes d’internet où « the » apparaît des milliards de fois,
        mais « supercalifragilisticexpialidocious » presque jamais. Les mots courants ont leur propre token.
        Les mots rares sont réduits en miettes, ce qui consomme davantage la fenêtre de contexte limitée de l’IA
        et oblige le modèle à travailler plus pour le même sens. Essayez aussi « anticonstitutionnellement » !
      </>,
      nextHint: 'Essayez maintenant une autre langue : découvrez le coût caché de ne pas parler anglais ↓',
    },
  },
  {
    key: 'arabic',
    icon: '🌍',
    text: 'مرحبا كيف حالك',
    label: <>Essayez <Accent>Bonjour, comment ça va</Accent> en arabe : même sens, presque 3 fois plus de tokens</>,
    insight: {
      headline: 'Même sens. Trois fois le prix.',
      body: <>
        « Hello how are you » tient en 4 tokens. <strong style={{ color: 'var(--text-primary)' }}>La même phrase en arabe en demande 11.</strong>{' '}
        Comme le tokeniseur a surtout été construit à partir de textes anglais, il a appris des représentations efficaces
        pour les mots anglais, mais traite les écritures non latines presque caractère par caractère. Résultat :
        l’arabe, l’hindi, le yoruba et d’autres langues utilisent plus de tokens pour le même sens.
        Cela coûte plus cher, remplit plus vite la fenêtre de contexte et donne de moins bons résultats.
        Même le français paie un petit supplément : « Bonjour, comment ça va ? » prend 6 tokens.
        <span style={{ display: 'block', marginTop: 8, color: 'var(--brand)', fontWeight: 500, fontSize: 14 }}>
          C’est dans la tokenisation que commencent les inégalités de l’IA.
        </span>
      </>,
      nextHint: null,
    },
  },
],
  allExplored: "Tout exploré : vous voyez maintenant ce que voit l’IA.",

  // "Go deeper" panel (DepthPanel)
  depthSections: [
    {
      label: 'Le problème',
      color: 'var(--brand)',
      defaultOpen: true,
      content: (
        <div>
          <p style={{ marginBottom: 16 }}>
            <strong style={{ color: 'var(--brand)', fontSize: 15 }}>Le problème : l’IA ne sait pas lire.</strong>
          </p>
          <p style={{ marginBottom: 12 }}>
            Les réseaux de neurones sont des machines à calculer : ils multiplient des matrices et additionnent des nombres.
            Ils n’ont aucune idée de ce qu’est un « a », un « z » ou une « fraise ». Donc, avant que l’IA puisse réfléchir à
            votre texte, quelque chose doit le convertir en nombres. Ce quelque chose s’appelle un{' '}
            <strong style={{ color: 'var(--text-primary)' }}>tokeniseur</strong>.
          </p>
          <p style={{ marginBottom: 20 }}>
            Mais <em>comment</em> décider de ce que représente chaque nombre ? Il y a trois options :
          </p>
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border)',
              borderRadius: 8,
            }}>
              <strong style={{ color: '#e87a96' }}>Option A : un nombre par caractère</strong>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                « hello » → 5 nombres. Simple, mais terriblement inefficace.
                Une dissertation de 1 000 mots devient environ 5 000 tokens. La fenêtre de contexte de l’IA se remplit vite,
                et le modèle gaspille sa puissance de calcul sur des lettres isolées qui, seules, n’ont presque pas de sens.
              </div>
            </div>
            <div style={{
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border)',
              borderRadius: 8,
            }}>
              <strong style={{ color: '#e8d06e' }}>Option B : un nombre par mot</strong>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                Efficace pour les mots courants, mais l’anglais compte à lui seul plus de 750 000 mots. Ajoutez les fautes de frappe,
                l’argot, le code, les autres langues (et les conjugaisons du français !) : il faudrait des millions d’entrées. Et un mot absent
                du dictionnaire ? Totalement invisible pour le modèle.
              </div>
            </div>
            <div style={{
              padding: '12px 16px',
              background: 'rgba(248, 95, 0,0.06)',
              border: '1px solid rgba(248, 95, 0,0.25)',
              borderRadius: 8,
            }}>
              <strong style={{ color: 'var(--brand)' }}>Option C : l’encodage par paires d’octets (BPE), le juste milieu</strong>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                On apprend les morceaux les plus utiles à partir de vraies données. Les mots courants comme « the » ont leur propre token.
                Les mots rares sont découpés en sous-morceaux réutilisables. Un vocabulaire fixe d’environ 100 000 tokens
                peut représenter <em>n’importe quel</em> texte dans <em>n’importe quelle</em> langue.
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: 'Comment marche le BPE',
      color: 'var(--brand)',
      content: (
        <div>
          <p style={{ marginBottom: 12 }}>
            Imaginez que vous inventez une sténo pour écrire plus vite. Vous regarderiez ce que vous écrivez le plus souvent
            et créeriez des abréviations pour les combinaisons les plus fréquentes. Le BPE fait exactement cela, automatiquement,
            en parcourant des milliards de mots :
          </p>
          <div style={{ display: 'grid', gap: 12 }}>
            <StepBox step={1} title="Partir des octets individuels">
              On découpe chaque texte en ses plus petites unités : les octets (en gros, les caractères).
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, marginTop: 8, color: 'var(--text-primary)', letterSpacing: 1 }}>
                "hello" → [h] [e] [l] [l] [o]
              </div>
            </StepBox>
            <StepBox step={2} title="Compter chaque paire voisine">
              On parcourt toutes les données d’entraînement (imaginez : tout Wikipédia, Reddit, des livres, du code).
              On compte combien de fois chaque paire de tokens voisins apparaît.
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, marginTop: 8, color: 'var(--text-primary)' }}>
                « th » apparaît 9,2 milliards de fois{' '}
                <span style={{ color: 'var(--brand)' }}>← gagnant</span>
              </div>
            </StepBox>
            <StepBox step={3} title="Fusionner la paire la plus fréquente">
              On remplace [t] + [h] par [th] partout dans les données. Ce nouveau token fusionné
              entre dans le vocabulaire.
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, marginTop: 8, color: 'var(--text-primary)' }}>
                Avant : [t] [h] [e] → Après : [th] [e]
              </div>
            </StepBox>
            <StepBox step={4} title="Recommencer ~100 000 fois">
              À chaque tour, on cherche et on fusionne la paire suivante la plus fréquente. Les premières fusions créent
              des paires courantes comme « in », « er », « th ». Les suivantes créent des mots entiers
              comme « the », « and », « function ». Après environ 100 000 fusions, on obtient un vocabulaire complet.
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, marginTop: 8, color: 'var(--text-primary)' }}>
                [th] + [e] → [the] : « the » est maintenant un seul token
              </div>
            </StepBox>
          </div>
        </div>
      ),
    },
    {
      label: 'Le résultat',
      color: 'var(--brand)',
      content: (
        <div>
          <p style={{ marginBottom: 12 }}>
            Le tokeniseur que vous utilisez en ce moment est <strong style={{ color: 'var(--text-primary)' }}>cl100k_base</strong>, le
            même que celui de GPT-4. Son vocabulaire compte exactement <strong style={{ color: 'var(--text-primary)' }}>100 256 tokens</strong>.
          </p>
          <p style={{ marginBottom: 6 }}>
            Les mots anglais courants comme « the », « and », « hello » ont chacun un seul token.
            Les mots rares comme « supercalifragilisticexpialidocious » sont découpés en plein de petits morceaux.
            Et les écritures non latines (arabe, hindi, chinois) sont souvent découpées en encore plus de
            fragments, parce qu’il y avait moins de textes dans ces langues parmi les données d’entraînement.
          </p>
          <p style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(248, 95, 0,0.06)', borderRadius: 8, borderLeft: '3px solid var(--brand)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>À retenir :</strong>{' '}
            le tokeniseur est construit <em>séparément</em> du modèle d’IA, <em>avant</em> que le
            modèle ne voie la moindre donnée. C’est une étape de prétraitement. Le réseau de neurones ne voit jamais
            vos caractères, seulement les identifiants entiers produits par le tokeniseur. Tout ce que le modèle
            sait du langage part de ces nombres.
          </p>
        </div>
      ),
    },
    {
      label: 'Le voir en code',
      color: '#6ec0e8',
      content: (
        <PythonCode code={`import tiktoken

# Charger le même tokeniseur que GPT-4
enc = tiktoken.get_encoding("cl100k_base")

# ── Tokeniser un mot ────────────────────────────────
text = "strawberry"
token_ids = enc.encode(text)
print(f'"{text}" → {token_ids}')
# "strawberry" → [496, 675, 15717]

# ── Voir ce que représente chaque identifiant ───────
for token_id in token_ids:
    fragment = enc.decode([token_id])
    print(f"  ID {token_id:>6} → '{fragment}'")
# ID    496 → 'str'
# ID    675 → 'aw'
# ID  15717 → 'berry'

# ── L'inégalité entre les langues ───────────────────
english = "Hello, how are you?"
french  = "Bonjour, comment ça va ?"
arabic  = "مرحبا كيف حالك"

en_tokens = enc.encode(english)
fr_tokens = enc.encode(french)
ar_tokens = enc.encode(arabic)

print(f"Anglais :  {len(en_tokens)} tokens")  # 6
print(f"Français : {len(fr_tokens)} tokens")  # 6
print(f"Arabe :    {len(ar_tokens)} tokens")  # 11
# Même sens. Coût différent.`} />
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
            Si les fusions du BPE reposent sur la fréquence dans les données d’entraînement, et que ces données étaient
            surtout des textes web en anglais, que se passe-t-il pour les langues peu représentées ?
          </p>
          <p style={{ marginBottom: 8, paddingLeft: 16 }}>
            <strong style={{ color: '#e8d06e' }}>1.</strong> Tapez « Hello, how are you? » ci-dessus et notez le nombre de tokens.
            Essayez ensuite en français, en espagnol, en arabe, en hindi ou en yoruba. Comment le nombre évolue-t-il ?
          </p>
          <p style={{ marginBottom: 8, paddingLeft: 16 }}>
            <strong style={{ color: '#e8d06e' }}>2.</strong> Tapez un prénom anglais courant (« John ») puis un prénom d’une
            autre culture. Lequel reste en un seul morceau ?
          </p>
          <p style={{ paddingLeft: 16 }}>
            <strong style={{ color: '#e8d06e' }}>3.</strong> Que se passerait-il si on construisait un tokeniseur <em>uniquement</em>{' '}
            à partir de textes arabes ? Est-ce que ce seraient les mots anglais qui seraient fragmentés, cette fois ?
          </p>
        </div>
      ),
    },
    {
      label: 'Pourquoi c’est important',
      color: '#e87a96',
      content: (
        <div>
          <p style={{ marginBottom: 14 }}>
            La tokenisation ressemble à un petit détail technique, mais elle a des conséquences bien réelles
            pour des milliards de personnes.
          </p>
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #e8d06e' }}>
              <strong style={{ color: '#e8d06e' }}>Inégalité de coût</strong>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                Les API d’IA facturent au token. Le même message en yoruba ou en bengali peut utiliser 2 à 4 fois
                plus de tokens qu’en anglais : les personnes qui parlent ces langues paient littéralement plus cher
                pour le même service.
              </div>
            </div>
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #6ec0e8' }}>
              <strong style={{ color: '#6ec0e8' }}>Écart de qualité</strong>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                Les modèles d’IA ont une fenêtre de contexte fixe (par exemple 128 000 tokens). Si votre langue consomme
                les tokens 3 fois plus vite, l’IA a 3 fois moins de place pour raisonner. Même modèle,
                moins bons résultats, simplement à cause de la langue que vous parlez.
              </div>
            </div>
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #e87a96' }}>
              <strong style={{ color: '#e87a96' }}>Effacement des identités</strong>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                Des prénoms comme « John » ou « Sarah » tiennent en un seul token : le modèle les voit en entier.
                Des prénoms comme « Oluwaseun » ou « Bhagyashree » sont fragmentés en syllabes sans signification.
                Le modèle ne peut littéralement pas voir ces prénoms comme il voit les prénoms anglais.
              </div>
            </div>
          </div>
          <p style={{ marginTop: 14, fontSize: 13, color: 'var(--brand)', fontWeight: 500 }}>
            C’est là que commencent les inégalités de l’IA : pas dans les poids du modèle, mais dès la toute première
            étape, quand le texte devient des nombres.
          </p>
        </div>
      ),
    },
  ],

  ctaNext: "Découvrir comment l’IA comprend",
}
