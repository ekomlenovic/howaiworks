// Lesson 4: attention (/attention page)
import { QKVDiagram } from '../../../components/LessonBits'

export default {
  titleStart: "How AI",
  titleAccent: "pays attention.",
  subtitle: <>
    Every word looks at every other word. The model decides what matters.
    This is the mechanism that made modern AI possible.
  </>,

  // The page's 4 cards (badge, title, explanation)
  cards: [
    {
      badge: "THE PROBLEM",
      title: "Words change meaning based on context",
      explanation: `"Bank" means something different in "river bank" vs "bank account." Earlier AI models processed words one at a time, left to right — by the time they reached the end of a sentence, they'd already forgotten the beginning. Attention solved this by letting every word look at every other word, all at once.`,
    },
    {
      badge: "SELF-ATTENTION",
      title: "Every word asks: 'Who should I pay attention to?'",
      explanation: "For each word, the model computes a score against every other word in the sentence. High scores mean strong relevance. This happens in parallel for all words simultaneously.",
    },
    {
      badge: "MULTI-HEAD",
      title: "Multiple perspectives at once",
      explanation: "A single attention pattern can only capture one type of relationship. Real transformers run many attention heads in parallel — each one learns to focus on a different pattern.",
    },
    {
      badge: "THE FULL PICTURE",
      title: "The transformer block",
      explanation: "Attention is just one part. A complete transformer block combines self-attention with feed-forward layers, residual connections, and normalization. Then the whole block repeats.",
    },
  ],

  // "Before / after attention" demo. Keep 10 words: the arcs link
  // word #8 to #2, #10 to #6, etc. (see RNNvsTransformerInner).
  rnnWords: ['The', 'cat', 'sat', 'on', 'the', 'mat', 'because', 'it', 'was', 'soft'],
  rnn: {
    before: "Before attention (RNNs):",
    forgot: "it = ??? (forgot 'cat')",
    after: "With attention (Transformers):",
    every: "Every word directly accesses every other word",
    replay: "↻ replay",
  },

  // Clickable attention map (the sentence stays in English)
  heatmap: {
    watch: 'Watch...',
    click: 'Click any word to see what it pays attention to',
    // Explanation shown for the clicked word
    insight: (selectedWord) => (
    selectedWord === 'it' ? (
        <>
          <strong style={{ color: 'var(--brand)' }}>"it"</strong> pays 55% attention to{' '}
          <strong style={{ color: 'var(--brand)' }}>"animal"</strong> — the model figured out
          that "it" refers to the animal, not the street. No one programmed this rule.
        </>
      ) : selectedWord === 'cross' ? (
        <>
          <strong style={{ color: 'var(--brand)' }}>"cross"</strong> attends most to{' '}
          <strong style={{ color: 'var(--brand)' }}>"street"</strong> (35%) — it's looking
          at what it's crossing.
        </>
      ) : selectedWord === 'tired' ? (
        <>
          <strong style={{ color: 'var(--brand)' }}>"tired"</strong> attends to{' '}
          <strong style={{ color: 'var(--brand)' }}>"animal"</strong> (25%) and{' '}
          <strong style={{ color: 'var(--brand)' }}>"it"</strong> (20%) — connecting
          the tiredness back to the subject.
        </>
      ) : (
        <>
          <strong style={{ color: 'var(--brand)' }}>"{selectedWord}"</strong> distributes
          attention across the sentence. The brightest words are what the model considers most
          relevant for understanding this word in context.
        </>
      )
    ),
  },

  // Attention heads. Don't change `from` / `to`: they are words of the English sentence.
  heads: [
    {
      name: 'Grammar',
      color: '#6ec0e8',
      description: 'Tracks subject-verb agreement and sentence structure',
      connections: [
        { from: 'animal', to: 'didn\'t', label: 'subject → verb' },
        { from: 'it', to: 'was', label: 'subject → verb' },
        { from: 'The', to: 'animal', label: 'determiner → noun' },
      ],
    },
    {
      name: 'Coreference',
      color: '#f85f00',
      description: 'Resolves what pronouns refer to',
      connections: [
        { from: 'it', to: 'animal', label: 'pronoun → referent' },
        { from: 'tired', to: 'animal', label: 'adjective → subject' },
      ],
    },
    {
      name: 'Semantics',
      color: '#e8956e',
      description: 'Links related meanings across the sentence',
      connections: [
        { from: 'cross', to: 'street', label: 'action → object' },
        { from: 'tired', to: 'didn\'t', label: 'cause → effect' },
        { from: 'because', to: 'tired', label: 'reason → cause' },
      ],
    },
  ],
  toggleHeads: "Toggle multiple heads to compare",

  // Transformer block
  layers: [
    { name: 'Input Embeddings', desc: 'Convert tokens to vectors (you learned this in Understand)', color: '#6ec0e8' },
    { name: 'Self-Attention', desc: 'Each word looks at every other word to gather context', color: '#f85f00' },
    { name: 'Add & Normalize', desc: 'Add the original input back (residual connection) and normalize', color: '#8a8a96' },
    { name: 'Feed-Forward', desc: 'Two matrix multiplications with an activation — where knowledge is stored', color: '#e8956e' },
    { name: 'Add & Normalize', desc: 'Another residual connection and normalization', color: '#8a8a96' },
  ],
  layersLabel: "×N layers",


  explore: (n, total) => `Explore to continue (${n}/${total})`,
  nudges: [
    {
      key: 'pronoun-resolution',
      icon: '🔍',
      label: <>What does <strong>"it"</strong> refer to?</>,
      insight: (
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <p style={{ margin: '0 0 12px' }}>
            In the sentence "The animal didn't cross the street because <strong>it</strong> was too tired,"
            humans instantly know "it" = the animal. But how does a model figure this out?
          </p>
          <p style={{ margin: '0 0 12px' }}>
            <strong style={{ color: 'var(--brand)' }}>Before attention:</strong> Models like RNNs
            processed words left-to-right. By the time they reached "it," the information about "animal"
            had faded — like trying to remember the start of a long sentence.
          </p>
          <p style={{ margin: 0 }}>
            <strong style={{ color: 'var(--brand)' }}>With attention:</strong> The model can look
            directly back at "animal" when processing "it." No forgetting, no fading. It computes a
            relevance score between every pair of words simultaneously.
          </p>
        </div>
      ),
    },
    {
      key: 'why-multiple-heads',
      icon: '🧠',
      label: <>Why <strong>multiple</strong> attention heads?</>,
      insight: (
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <p style={{ margin: '0 0 12px' }}>
            Language encodes many relationships at once. In "The cat sat on the mat,"
            you simultaneously understand grammar (cat = subject), position (cat is before sat),
            and meaning (cats sit on things).
          </p>
          <p style={{ margin: '0 0 12px' }}>
            A single attention pattern can only capture one type of relationship. Multiple heads
            let the model track all of them in parallel — typically <strong style={{ color: 'var(--brand)' }}>12-96 heads</strong> per
            layer, each learning a different pattern.
          </p>
          <p style={{ margin: 0 }}>
            This wasn't designed by linguists. The heads <strong>emerge from training</strong> — the model
            discovers that specialization helps it predict the next word better.
          </p>
        </div>
      ),
    },
    {
      key: 'how-deep',
      icon: '📚',
      label: <>How <strong>deep</strong> does it go?</>,
      insight: (
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <p style={{ margin: '0 0 12px' }}>
            A transformer isn't just one attention step — it's the same block repeated many times.
            Each layer refines the representation:
          </p>
          <div style={{ margin: '0 0 12px', paddingLeft: 12, borderLeft: '2px solid var(--border)' }}>
            <div style={{ marginBottom: 6 }}><strong style={{ color: '#6ec0e8' }}>Early layers</strong> — basic syntax, word boundaries, part-of-speech</div>
            <div style={{ marginBottom: 6 }}><strong style={{ color: 'var(--brand)' }}>Middle layers</strong> — semantic relationships, coreference, facts</div>
            <div><strong style={{ color: '#e8956e' }}>Late layers</strong> — task-specific reasoning, output formatting</div>
          </div>
          <p style={{ margin: 0 }}>
            GPT-2 has 12 layers. GPT-3 has 96. More layers = more refined understanding, but also
            more compute per token. This is why bigger models are slower but smarter.
          </p>
        </div>
      ),
    },
  ],

  // "Go deeper" panel (DepthPanel)
  depthSections: [
    {
      label: 'The Concept',
      color: 'var(--brand)',
      defaultOpen: true,
      content: (
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <p style={{ margin: '0 0 16px' }}>
            Self-attention computes three vectors for each token: <strong>Query</strong> (what am I looking for?),{' '}
            <strong>Key</strong> (what do I contain?), and <strong>Value</strong> (what information do I carry?).
          </p>
          <QKVDiagram inputLabel="Input" outputLabel="Output" />
          <div style={{
            padding: '16px',
            background: 'var(--bg-deep)',
            borderRadius: 10,
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            lineHeight: 1.8,
            marginBottom: 16,
          }}>
            <div style={{ color: 'var(--text-dim)', marginBottom: 8 }}>For each word:</div>
            <div><span style={{ color: '#6ec0e8' }}>Q</span> = word × W_query    <span style={{ color: 'var(--text-dim)' }}>// "what am I looking for?"</span></div>
            <div><span style={{ color: '#e8956e' }}>K</span> = word × W_key      <span style={{ color: 'var(--text-dim)' }}>// "what do I contain?"</span></div>
            <div><span style={{ color: '#f85f00' }}>V</span> = word × W_value    <span style={{ color: 'var(--text-dim)' }}>// "what info do I carry?"</span></div>
            <div style={{ marginTop: 12, color: 'var(--text-dim)' }}>Attention score:</div>
            <div>score = softmax(<span style={{ color: '#6ec0e8' }}>Q</span> · <span style={{ color: '#e8956e' }}>K</span>ᵀ / √d) × <span style={{ color: '#f85f00' }}>V</span></div>
          </div>
          <p style={{ margin: 0 }}>
            The dot product Q·K measures how relevant each key is to each query. Dividing by √d
            (the dimension size) prevents the values from getting too large. Softmax converts
            raw scores into a probability distribution. The result is a weighted sum of Values.
          </p>
        </div>
      ),
    },
    {
      label: 'The Code',
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
          <div style={{ color: 'var(--text-dim)', marginBottom: 12 }}>// Simplified self-attention in Python</div>
          <pre style={{ margin: 0, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{`import numpy as np

def self_attention(X, W_q, W_k, W_v):
    """
    X:   input embeddings  (seq_len, d_model)
    W_q: query weights     (d_model, d_k)
    W_k: key weights       (d_model, d_k)
    W_v: value weights     (d_model, d_v)
    """
    Q = X @ W_q    # queries
    K = X @ W_k    # keys
    V = X @ W_v    # values

    d_k = K.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)
    weights = softmax(scores)  # (seq_len, seq_len)

    return weights @ V  # weighted sum of values

def softmax(x):
    e = np.exp(x - x.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)`}</pre>
        </div>
      ),
    },
    {
      label: 'Challenge',
      color: '#e8d06e',
      content: (
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <p style={{ margin: '0 0 12px' }}>
            Self-attention compares every word to every other word. If a sentence has <em>n</em> words,
            that's <em>n × n</em> comparisons.
          </p>
          <div style={{
            padding: '12px 16px',
            background: 'var(--bg-deep)',
            borderRadius: 10,
            border: '1px solid var(--border)',
            marginBottom: 12,
          }}>
            <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 13 }}>
              A 1,000-token prompt = 1,000,000 attention scores.{' '}
              <br />A 100,000-token prompt = 10,000,000,000 scores.
            </p>
          </div>
          <p style={{ margin: 0 }}>
            This O(n²) scaling is why context windows are limited, and why researchers are
            working on alternatives like Flash Attention, sparse attention, and linear attention.
            Can you think of ways to reduce the number of comparisons without losing important relationships?
          </p>
        </div>
      ),
    },
    {
      label: 'Real World',
      color: '#e87a96',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #6ec0e8' }}>
            <strong style={{ color: '#6ec0e8', fontSize: 14 }}>Machine Translation</strong>
            <div style={{ marginTop: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
              Attention was originally invented for translation. It lets the model align source and target words
              ("le chat" → "the cat") without rigid word-by-word mapping.
            </div>
          </div>
          <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid var(--brand)' }}>
            <strong style={{ color: 'var(--brand)', fontSize: 14 }}>Code Completion</strong>
            <div style={{ marginTop: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
              When Copilot suggests code, attention lets it look back at your function signatures,
              variable names, and imports — all at once — to write contextually correct code.
            </div>
          </div>
          <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #e8956e' }}>
            <strong style={{ color: '#e8956e', fontSize: 14 }}>Vision Transformers</strong>
            <div style={{ marginTop: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
              The same attention mechanism works on images. Split an image into patches, treat each
              patch like a "word," and let patches attend to each other. This is how DALL-E and
              modern image classifiers work.
            </div>
          </div>
        </div>
      ),
    },
  ],

  bridge: <>
    You've seen how AI reads text, maps meaning, and focuses attention.
    Now see where all of this actually runs.
  </>,
  ctaNext: "See where AI runs",
}
