// Lesson 2: tokenization (/tokenize page)
import { Accent, StepBox, PythonCode } from '../../../components/LessonBits'

export default {
  hero: {
    titleStart: "AI doesn't read words. It reads",
    titleAccent: "numbers.",
    subtitle: "Before AI can do anything with your text, it has to break it into smaller pieces called tokens. Type below and see exactly how.",
  },

  // Phrases auto-typed in the demo (the last one is an easter egg)
  demoPhrases: [
    'How does AI work?',
    'Just keep swimming.',
    'Summarize this document for me.',
    'Hello, World!',
    'Fix the bug in my code.',
    'With great power comes great responsibility.',
    'Explain this like I\'m five.',
    "I'm sorry Dave, I'm afraid I can't do that.", // easter egg — last
  ],

  yourText: "Your text",
  typePlaceholder: "Type anything here...",
  loading: "Loading tokenizer...",
  whatAISees: "What AI sees",
  idsPlaceholder: "Token IDs appear here...",

  // Stats bar under the demo (tooltips on hover)
  stats: {
    tokens: { unit: "tokens", text: "AI can't read text. It splits your input into small pieces called tokens — often parts of words, not whole words. \"strawberry\" becomes 3 tokens: \"str\", \"aw\", \"berry\". Everything AI does starts from these fragments.", linkHref: "https://platform.openai.com/tokenizer", linkLabel: "Try OpenAI's Tokenizer" },
    characters: { unit: "characters", text: "The raw letters, spaces, and symbols you typed — what humans read. AI never sees these directly. It converts them into tokens first, which is why the token count is always different from the character count.", linkHref: "https://huggingface.co/learn/llm-course/en/chapter2/4", linkLabel: "How Tokenizers Work" },
    ratio: { unit: "chars/token", text: "How many characters fit in one token on average. English text averages ~4 chars/token. A lower ratio means more tokens for the same text — making AI slower and more expensive. Non-English languages often score worse here.", linkHref: "https://huggingface.co/spaces/Xenova/the-tokenizer-playground", linkLabel: "Tokenizer Playground" },
    cost: { unit: "call", text: "AI APIs charge per token, not per word or message. This estimate uses GPT-4's input rate (~$0.03 per 1K tokens). More tokens = higher cost — which is why inefficient tokenization for non-English text creates real cost inequality.", linkHref: "https://openai.com/api/pricing/", linkLabel: "OpenAI Pricing" },
  },

  whatIsToken: { title: "What is a token?", body: "A token is a small piece of text — it might be a whole word, part of a word, or even a single character. AI doesn't read words the way you do. It breaks everything down into these pieces first. Each colored chunk above is one token." },
  whatIsTokenizer: {
    title: "What is a tokenizer?",
    body: <>A tokenizer is the tool that decides where to split. The one running here is <span style={{ color: 'var(--text-primary)' }}>cl100k_base</span> — the same tokenizer used by ChatGPT and GPT-4. It has a vocabulary of ~100,000 tokens, and every piece of text you type gets mapped to entries in that vocabulary. This is the very first step a language model performs before it can understand anything.</>,
  },

  // "Try…" nudges. `text` is typed into the demo on click.
  nudges: [
  {
    key: 'strawberry',
    icon: '🍓',
    text: 'strawberry',
    label: <>Try <Accent>strawberry</Accent> - Why does AI have such a tough time?</>,
    insight: {
      headline: 'AI can\'t spell - and this is why.',
      body: <>
        "strawberry" becomes 3 tokens: <strong style={{ color: 'var(--text-primary)' }}>"str" + "aw" + "berry"</strong>.
        When you ask AI "how many r's in strawberry?", it never sees the individual letters -
        it sees 3 opaque fragments. The r's are scattered across token boundaries, invisible to the model.
        This is the root cause of AI's famous spelling failures.
      </>,
      nextHint: 'Now try a really long word - see what happens when AI encounters something rare ↓',
    },
  },
  {
    key: 'supercalifragilistic',
    icon: '☂️',
    text: 'supercalifragilisticexpialidocious',
    label: <>Try <Accent>supercalifragilisticexpialidocious</Accent> - 1 word you can say, 11 fragments AI sees</>,
    insight: {
      headline: 'The rarer the word, the harder AI works.',
      body: <>
        You can say this word in one breath. AI needs <strong style={{ color: 'var(--text-primary)' }}>~11 tokens</strong> just
        to represent it. The tokenizer was trained on internet text where "the" appears billions of times
        but "supercalifragilisticexpialidocious" almost never does. Common words get their own token.
        Rare words get shattered into fragments - consuming more of AI's limited context window
        and making the model work harder for the same meaning.
      </>,
      nextHint: 'Now try a different language - discover the hidden cost of not being English ↓',
    },
  },
  {
    key: 'arabic',
    icon: '🌍',
    text: 'مرحبا كيف حالك',
    label: <>Try <Accent>Hello how are you</Accent> in Arabic - same meaning, nearly 3x the tokens</>,
    insight: {
      headline: 'Same meaning. 3x the cost.',
      body: <>
        "Hello how are you" is ~5 tokens. <strong style={{ color: 'var(--text-primary)' }}>The same phrase in Arabic can be 12+ tokens.</strong>{' '}
        Because the tokenizer was trained mostly on English text, it learned efficient representations
        for English words but treats non-Latin scripts almost character-by-character. This means
        Arabic, Hindi, Yoruba, and other languages use more tokens for the same meaning -
        costing more money, filling up the context window faster, and getting worse model performance.
        <span style={{ display: 'block', marginTop: 8, color: 'var(--brand)', fontWeight: 500, fontSize: 14 }}>
          Tokenization is where AI inequity begins.
        </span>
      </>,
      nextHint: null,
    },
  },
],
  allExplored: "All explored — you now see what AI sees.",

  // "Go deeper" panel (DepthPanel)
  depthSections: [
    {
      label: 'The Problem',
      color: 'var(--brand)',
      defaultOpen: true,
      content: (
        <div>
          <p style={{ marginBottom: 16 }}>
            <strong style={{ color: 'var(--brand)', fontSize: 15 }}>The problem: AI can't read.</strong>
          </p>
          <p style={{ marginBottom: 12 }}>
            Neural networks are math machines — they multiply matrices and add numbers.
            They have no concept of "a" or "z" or "strawberry." So before AI can think about
            your text, something has to convert it into numbers. That something is called a{' '}
            <strong style={{ color: 'var(--text-primary)' }}>tokenizer</strong>.
          </p>
          <p style={{ marginBottom: 20 }}>
            But <em>how</em> do you decide what each number represents? You have three options:
          </p>
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border)',
              borderRadius: 8,
            }}>
              <strong style={{ color: '#e87a96' }}>Option A: One number per character</strong>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                "hello" → 5 numbers. Simple, but wildly inefficient.
                A 1,000-word essay becomes ~5,000 tokens. AI's context window fills up fast,
                and the model wastes processing power on individual letters that carry little meaning on their own.
              </div>
            </div>
            <div style={{
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border)',
              borderRadius: 8,
            }}>
              <strong style={{ color: '#e8d06e' }}>Option B: One number per word</strong>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                Efficient for common words, but English alone has 750,000+ words. Add misspellings,
                slang, code, other languages — you'd need millions of entries. And any word not in
                the dictionary? Completely invisible to the model.
              </div>
            </div>
            <div style={{
              padding: '12px 16px',
              background: 'rgba(248, 95, 0,0.06)',
              border: '1px solid rgba(248, 95, 0,0.25)',
              borderRadius: 8,
            }}>
              <strong style={{ color: 'var(--brand)' }}>Option C: Byte Pair Encoding — the sweet spot</strong>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                Learn the most useful pieces from real data. Common words like "the" get their own token.
                Rare words get broken into reusable subword pieces. A fixed vocabulary of ~100K tokens
                can represent <em>any</em> text in <em>any</em> language.
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: 'How BPE Works',
      color: 'var(--brand)',
      content: (
        <div>
          <p style={{ marginBottom: 12 }}>
            Imagine you're inventing a shorthand for writing faster. You'd look at what you write most
            and create abbreviations for the most common patterns. BPE does exactly this, automatically,
            by scanning billions of words of text:
          </p>
          <div style={{ display: 'grid', gap: 12 }}>
            <StepBox step={1} title="Start with individual bytes">
              Break every piece of text into its smallest units — individual bytes (roughly characters).
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, marginTop: 8, color: 'var(--text-primary)', letterSpacing: 1 }}>
                "hello" → [h] [e] [l] [l] [o]
              </div>
            </StepBox>
            <StepBox step={2} title="Count every adjacent pair">
              Scan the entire training dataset (think: all of Wikipedia, Reddit, books, code).
              Count how often each pair of adjacent tokens appears together.
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, marginTop: 8, color: 'var(--text-primary)' }}>
                "th" appears 9.2 billion times{' '}
                <span style={{ color: 'var(--brand)' }}>← winner</span>
              </div>
            </StepBox>
            <StepBox step={3} title="Merge the most frequent pair">
              Combine [t] + [h] → [th] everywhere in the data. This new merged token
              becomes part of the vocabulary.
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, marginTop: 8, color: 'var(--text-primary)' }}>
                Before: [t] [h] [e] → After: [th] [e]
              </div>
            </StepBox>
            <StepBox step={4} title="Repeat ~100,000 times">
              Each round, find and merge the next most frequent pair. Early merges create
              common pairs like "in", "er", "the". Later merges create full words
              like "the", "and", "function". After ~100K merges, you have a complete vocabulary.
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, marginTop: 8, color: 'var(--text-primary)' }}>
                [th] + [e] → [the] — now "the" is a single token
              </div>
            </StepBox>
          </div>
        </div>
      ),
    },
    {
      label: 'The Result',
      color: 'var(--brand)',
      content: (
        <div>
          <p style={{ marginBottom: 12 }}>
            The tokenizer you're using right now is <strong style={{ color: 'var(--text-primary)' }}>cl100k_base</strong> — the
            same one inside GPT-4. It has a vocabulary of exactly <strong style={{ color: 'var(--text-primary)' }}>100,256 tokens</strong>.
          </p>
          <p style={{ marginBottom: 6 }}>
            Common English words like "the", "and", "hello" each get one token.
            Rare words like "supercalifragilisticexpialidocious" get shattered into many small pieces.
            And non-Latin scripts — Arabic, Hindi, Chinese — often get broken into even more
            fragments, because there was less of that text in the training data.
          </p>
          <p style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(248, 95, 0,0.06)', borderRadius: 8, borderLeft: '3px solid var(--brand)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Key insight:</strong>{' '}
            The tokenizer is trained <em>separately</em> from the AI model, <em>before</em> the
            model ever sees any data. It's a preprocessing step. The neural network never sees
            your characters — only the integer IDs the tokenizer produces. Everything the model
            knows about language starts from these numbers.
          </p>
        </div>
      ),
    },
    {
      label: 'See It In Code',
      color: '#6ec0e8',
      content: (
        <PythonCode code={`import tiktoken

# Load the same tokenizer used by GPT-4
enc = tiktoken.get_encoding("cl100k_base")

# ── Tokenize a word ─────────────────────────────────
text = "strawberry"
token_ids = enc.encode(text)
print(f'"{text}" → {token_ids}')
# "strawberry" → [496, 675, 15717]

# ── See what each token ID represents ───────────────
for token_id in token_ids:
    fragment = enc.decode([token_id])
    print(f"  ID {token_id:>6} → '{fragment}'")
# ID    496 → 'str'
# ID    675 → 'aw'
# ID  15717 → 'berry'

# ── The language inequality ─────────────────────────
english = "Hello, how are you?"
arabic  = "مرحبا كيف حالك"

en_tokens = enc.encode(english)
ar_tokens = enc.encode(arabic)

print(f"English: {len(en_tokens)} tokens")  # ~5
print(f"Arabic:  {len(ar_tokens)} tokens")  # ~12
# Same meaning. Different cost.`} />
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
            If BPE merges are based on frequency in training data, and the training data was
            mostly English web text — what happens to languages that weren't well represented?
          </p>
          <p style={{ marginBottom: 8, paddingLeft: 16 }}>
            <strong style={{ color: '#e8d06e' }}>1.</strong> Type "Hello, how are you?" above and note the token count.
            Then try it in Spanish, Arabic, Hindi, or Yoruba. How does the count change?
          </p>
          <p style={{ marginBottom: 8, paddingLeft: 16 }}>
            <strong style={{ color: '#e8d06e' }}>2.</strong> Try typing a common English name ("John") vs. a name from
            another culture. Which one stays in one piece?
          </p>
          <p style={{ paddingLeft: 16 }}>
            <strong style={{ color: '#e8d06e' }}>3.</strong> What would happen if you trained a tokenizer on <em>only</em>{' '}
            Arabic text? Would English words start getting fragmented instead?
          </p>
        </div>
      ),
    },
    {
      label: 'Why This Matters',
      color: '#e87a96',
      content: (
        <div>
          <p style={{ marginBottom: 14 }}>
            Tokenization seems like a small technical detail — but it has real consequences
            for billions of people.
          </p>
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #e8d06e' }}>
              <strong style={{ color: '#e8d06e' }}>Cost inequality</strong>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                AI APIs charge per token. The same message in Yoruba or Bengali can use 2-4x
                more tokens than English — meaning people in those languages literally pay more
                for the same service.
              </div>
            </div>
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #6ec0e8' }}>
              <strong style={{ color: '#6ec0e8' }}>Quality gap</strong>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                AI models have a fixed context window (e.g. 128K tokens). If your language burns
                through tokens 3x faster, you get 3x less room for the AI to reason. Same model,
                worse results — just because of which language you speak.
              </div>
            </div>
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #e87a96' }}>
              <strong style={{ color: '#e87a96' }}>Identity erasure</strong>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                Names like "John" or "Sarah" are single tokens — the model sees them whole.
                Names like "Oluwaseun" or "Bhagyashree" get fragmented into meaningless syllables.
                The model literally cannot see these names the way it sees English ones.
              </div>
            </div>
          </div>
          <p style={{ marginTop: 14, fontSize: 13, color: 'var(--brand)', fontWeight: 500 }}>
            This is where AI inequity begins — not in the model's weights, but in the very first
            step: how text becomes numbers.
          </p>
        </div>
      ),
    },
  ],

  ctaNext: "Explore how AI understands",
}
