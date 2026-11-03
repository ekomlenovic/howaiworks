// Lesson 3: embeddings (/understand page)
// Map words stay in English: they are the embedding model's data.
import { Accent, PythonCode } from '../../../components/LessonBits'

export default {
  titleStart: "AI doesn't just see numbers.",
  titleAccent: "It understands meaning.",
  subtitle: "AI organized these words by meaning — no one told it which words are related.",
  placeholder: "Type or click a word from the map to highlight it...",
  search: "Find",
  explainer: <>
    <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
      What is an embedding?
    </h3>
    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
      An embedding is a way of turning a word into a list of numbers that captures its{' '}
      <span style={{ color: 'var(--text-primary)' }}>meaning</span>. The model learns these numbers
      during training so that words with similar meanings end up with similar numbers. Every dot on the
      map above is one word, placed according to its embedding.
    </p>

    <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
      What is a vector?
    </h3>
    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
      A vector is just a list of numbers — like coordinates, but in many dimensions. Each word's
      embedding is a vector with{' '}
      <span style={{ color: 'var(--text-primary)' }}>768 numbers</span>. We can't visualize 768
      dimensions, so the map above compresses them down to 2. Even in this simplified view, you can
      see that related words cluster together — animals near animals, emotions near emotions.
    </p>
  </>,
  depthSections: [
    {
      label: 'The Concept',
      color: 'var(--brand)',
      defaultOpen: true,
      content: (
        <div>
          <p style={{ marginBottom: 20 }}>
            The scatter plot above projects 768 dimensions down to just 2 using{' '}
            <strong style={{ color: 'var(--text-primary)' }}>PCA (Principal Component Analysis)</strong>.
            Even in this crude 2D view, you can see clusters of meaning: animals together, emotions together,
            places together. In the full 768-dimensional space, these relationships are far richer.
          </p>

          <p style={{ marginBottom: 16 }}>
            <strong style={{ color: 'var(--brand)', fontSize: 15 }}>Why 768 numbers?</strong>
          </p>
          <p style={{ marginBottom: 12 }}>
            Each dimension captures some aspect of meaning. No single dimension means "is an animal" or
            "is a color" — instead, meaning is distributed across all dimensions. This is why we call them{' '}
            <strong style={{ color: 'var(--text-primary)' }}>distributed representations.</strong>
          </p>

          <div style={{
            padding: '12px 16px',
            background: 'rgba(248, 95, 0,0.06)',
            border: '1px solid rgba(248, 95, 0,0.25)',
            borderRadius: 8,
            marginBottom: 20,
          }}>
            <strong style={{ color: 'var(--brand)' }}>Cosine similarity</strong>
            <div style={{ marginTop: 4, fontSize: 13 }}>
              We measure how similar two embeddings are using cosine similarity — the angle between two vectors.
              cos(0°) = 1.0 means identical direction (identical meaning). cos(90°) = 0 means unrelated.
              "cat" and "kitten" might have cosine similarity of 0.92. "cat" and "javascript" might be 0.15.
            </div>
          </div>

          <p style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(248, 95, 0,0.06)', borderRadius: 8, borderLeft: '3px solid var(--brand)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Key insight:</strong>{' '}
            Embeddings are the bridge between human language and machine computation. The tokenizer
            converts words to IDs (Page 1). The embedding layer converts those IDs into rich meaning
            vectors. Everything the AI "understands" lives in this geometric space.
          </p>
        </div>
      ),
    },
    {
      label: 'The Code',
      color: '#6ec0e8',
      content: (
        <PythonCode code={`import ollama

# Get embeddings from nomic-embed-text (768 dimensions)
response = ollama.embed(
    model="nomic-embed-text",
    input=["cat", "kitten", "javascript"]
)

cat_vec = response["embeddings"][0]      # 768 numbers
kitten_vec = response["embeddings"][1]
js_vec = response["embeddings"][2]

print(f"Dimensions: {len(cat_vec)}")  # 768

# ── Cosine similarity ─────────────────────────────
import numpy as np

def cosine_sim(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

print(f"cat ↔ kitten:     {cosine_sim(cat_vec, kitten_vec):.3f}")  # ~0.92
print(f"cat ↔ javascript: {cosine_sim(cat_vec, js_vec):.3f}")      # ~0.15

# ── Word arithmetic ───────────────────────────────
king = ollama.embed(model="nomic-embed-text", input=["king"])["embeddings"][0]
man  = ollama.embed(model="nomic-embed-text", input=["man"])["embeddings"][0]
woman = ollama.embed(model="nomic-embed-text", input=["woman"])["embeddings"][0]

result = np.array(king) - np.array(man) + np.array(woman)
# Find nearest word → "queen"`} />
      ),
    },
    {
      label: 'Challenge',
      color: '#e8d06e',
      content: (
        <div>
          <p style={{ marginBottom: 10 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Think about it:</strong>
          </p>
          <p style={{ marginBottom: 12 }}>
            Why might "doctor" be closer to "man" than "woman" in some embedding spaces?
            What does this tell us about training data?
          </p>
          <p style={{ marginBottom: 8, paddingLeft: 16 }}>
            <strong style={{ color: '#e8d06e' }}>1.</strong> Click on "doctor" and "nurse" on the map above.
            Look at their nearest neighbors. Do you notice a gender pattern?
          </p>
          <p style={{ marginBottom: 8, paddingLeft: 16 }}>
            <strong style={{ color: '#e8d06e' }}>2.</strong> If embeddings learn from text data, and the
            training text has biases (e.g., "the doctor... he" vs "the nurse... she"), where do those biases end up?
          </p>
          <p style={{ paddingLeft: 16 }}>
            <strong style={{ color: '#e8d06e' }}>3.</strong> How might you de-bias embeddings? Can you remove
            the "gender direction" without losing other useful information?
          </p>
        </div>
      ),
    },
    {
      label: 'Real World',
      color: '#e87a96',
      content: (
        <div>
          <p style={{ marginBottom: 14 }}>
            Embeddings power most of the AI features you use daily — often invisibly.
          </p>
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #6ec0e8' }}>
              <strong style={{ color: '#6ec0e8' }}>Search engines</strong>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                Google embeds your query and compares it to embedded documents. Searching "how to fix a flat tire"
                finds pages about "changing a punctured tire" — different words, same meaning-space neighborhood.
              </div>
            </div>
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #e8d06e' }}>
              <strong style={{ color: '#e8d06e' }}>RAG (Retrieval-Augmented Generation)</strong>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                When ChatGPT searches the web or reads documents to answer you, it's using embeddings to find
                the most relevant chunks of text. This is how AI "knows" about your company's internal docs.
              </div>
            </div>
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #e87a96' }}>
              <strong style={{ color: '#e87a96' }}>Recommendation systems</strong>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                Netflix, Spotify, and YouTube embed content and users in the same space. If your "user vector"
                is near a movie's embedding, you'll probably like it. Same math, different domain.
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ],
  bridge: <>
    Words have meaning. But how does the model know which meanings matter
    for each prediction? That's where attention comes in.
  </>,
  ctaNext: "See how AI pays attention",

  // Carte du sens (MeaningMap)
  map: {
    categories: { animal: 'Animals', emotion: 'Emotions', technology: 'Technology', food: 'Food', place: 'Places', person: 'People' },
    fullscreen: "Fullscreen",
    exitFullscreen: "Exit fullscreen",
    zoomHint: "scroll to zoom · drag to pan",
    position: "Position:",
  },

  // Arithmétique des mots (WordArithmetic).
  // Dans experiments, ne traduisez que label et insight : a, b, c, result et
  // arithmeticKey sont des mots de la carte (en anglais).
  arithmetic: {
    title: "Word Arithmetic",
    allExplored: "All explored — you now understand meaning-space.",
    notInMap: "(word not in map — try words from the scatter plot)",
    pickWord: "pick a word",
    // Traduction affichée entre parenthèses à côté des mots anglais de la liste
    wordGloss: {},
    experiments: [
      {
        key: 'king_woman',
        icon: '👑',
        label: <><Accent>King</Accent> − <Accent>Man</Accent> + <Accent>Woman</Accent> = ?</>,
        a: 'king',
        b: 'man',
        c: 'woman',
        result: 'queen',
        arithmeticKey: 'king_man_woman',
        insight: {
          headline: 'AI learned gender relationships from text alone.',
          body: <>
            No one told the model that king and queen are related. By reading billions of sentences,
            it discovered that the <strong style={{ color: 'var(--text-primary)' }}>vector difference</strong> between
            "king" and "man" is almost identical to the difference between "queen" and "woman."
            The model encodes abstract relationships as directions in meaning-space.
          </>,
          nextHint: 'Try the next one — AI learned geography without ever seeing a map →',
        },
      },
      {
        key: 'paris_japan',
        icon: '🗼',
        label: <><Accent>Paris</Accent> − <Accent>France</Accent> + <Accent>Japan</Accent> = ?</>,
        a: 'Paris',
        b: 'France',
        c: 'Japan',
        result: 'Tokyo',
        arithmeticKey: 'paris_france_japan',
        insight: {
          headline: 'AI learned geography without ever seeing a map.',
          body: <>
            The direction from "France" to "Paris" encodes the concept of <strong style={{ color: 'var(--text-primary)' }}>"capital city of."</strong>{' '}
            Apply that same direction starting from "Japan" and you land near "Tokyo."
            The model built a geometric map of countries and capitals purely from reading text —
            no atlas, no GPS coordinates, no explicit teaching.
          </>,
          nextHint: 'Now try your own equation — discover what other relationships AI has learned →',
        },
      },
      {
        key: 'custom',
        icon: '🧪',
        label: <>Create your own word equation</>,
        isCustom: true,
        insight: {
          headline: 'These relationships emerge automatically from reading billions of sentences.',
          body: <>
            Nobody hand-codes these relationships. During training, the model learns to predict the next word
            in a sentence. To do that well, it <em>must</em> understand that "king" relates to "queen" the
            way "man" relates to "woman." The geometry of meaning-space is a
            <strong style={{ color: 'var(--text-primary)' }}> side effect of learning to predict text.</strong>
          </>,
          nextHint: null,
        },
      },
    ],
  },
}
