// Lesson 5: cloud vs. local (/run page)
import { Accent, StepBox, InlineCode, ExternalLink } from '../../../components/LessonBits'

export default {
  titleStart: "The same AI.",
  titleAccent: "Two very different machines.",
  subtitle: <>
    <span style={{ color: '#6ec0e8' }}>Cloud</span>: a GPU cluster in a data center.{' '}
    <span style={{ color: 'var(--brand)' }}>Local</span>: your own computer. Watch them race.
  </>,

  // Course de latence (LatencyRace)
  race: {
    cloudSublabel: "Simulated · data-center GPU cluster",
    localSublabel: { ollama: "Ollama · Your Machine", webllm: "WebGPU · In-Browser", simulated: "Simulated · qwen2.5:0.5b" },
    placeholder: "Type a prompt and race again...",
    race: "Race",
    racing: "Racing...",
    waiting: "Waiting...",
    idle: "Type a prompt and hit Race",
    // Réponses préenregistrées rejouées quand aucun modèle ne tourne.
    // La course démarre automatiquement avec le premier prompt de `cloud`.
    // Si un prompt tapé correspond exactement à un `prompt`, sa réponse est rejouée.
    demo: {
      cloud: [
        {
          prompt: 'What is artificial intelligence?',
          response: 'Artificial intelligence (AI) refers to computer systems designed to perform tasks that typically require human intelligence. This includes understanding natural language, recognizing patterns in data, making decisions, and generating creative content.\n\nAt its core, modern AI works through neural networks — mathematical models loosely inspired by the human brain. These networks contain billions of parameters (numbers) that are adjusted during training on massive datasets. The model learns statistical patterns: given this input, what output is most likely?\n\nThe transformer architecture, introduced in 2017, revolutionized AI by enabling models to process entire sequences of text simultaneously using "attention mechanisms" — allowing every word to consider every other word when determining meaning. This is the foundation of GPT-4, Claude, Gemini, and other large language models you interact with today.\n\nImportantly, AI doesn\'t "understand" in the way humans do. It\'s an extraordinarily sophisticated pattern matcher that has learned the statistical structure of human language from trillions of words of text.',
        },
        {
          prompt: 'Explain how neural networks learn',
          response: 'Neural networks learn through a process called training, which involves three key steps repeated millions of times:\n\n1. **Forward pass**: Input data flows through layers of neurons. Each neuron multiplies its inputs by weights, adds a bias, and applies an activation function. The network produces a prediction.\n\n2. **Loss calculation**: The prediction is compared to the correct answer using a loss function. This produces a single number measuring how wrong the prediction was.\n\n3. **Backpropagation**: The loss is propagated backwards through the network using calculus (specifically, the chain rule). This computes the gradient — how much each weight contributed to the error. Weights are then nudged in the direction that reduces the loss.\n\nThis process, called gradient descent, is repeated over billions of examples. Over time, the weights converge to values that make accurate predictions across the training data.\n\nThe key insight is that the network discovers its own internal representations. Nobody tells it what features to look for — it learns that certain patterns in the data are useful for making predictions. This is what makes deep learning so powerful and so different from traditional programming.',
        },
      ],
      local: [
        {
          prompt: 'What is a neural network?',
          response: 'A neural network is a computing system inspired by biological brains. It consists of layers of interconnected nodes (neurons) that process information. Each connection has a weight that adjusts during training. Data flows through input layers, gets transformed by hidden layers, and produces output. The network learns by adjusting weights to minimize prediction errors — a process called backpropagation. Even this small 500M parameter model uses the same fundamental architecture as GPT-4, just with fewer layers and neurons.',
        },
        {
          prompt: 'How do you understand my words?',
          response: 'I don\'t read words the way you do. Your text gets broken into tokens — small pieces that are often parts of words, not whole words. Each token maps to a number (an ID), and those numbers get converted into vectors (lists of hundreds of numbers). These vectors capture meaning: similar words have similar vectors. I process these vectors through layers of attention mechanisms, where each token looks at every other token to understand context. The word "bank" means something different in "river bank" vs "bank account" — attention helps me figure that out.',
        },
        {
          prompt: 'Can you run on a Chromebook?',
          response: 'Yes! I\'m qwen2.5:0.5b — a 500 million parameter model that needs only about 1GB of RAM. That\'s small enough to run on most Chromebooks, old laptops, even a Raspberry Pi. No GPU required, no internet needed, no API key, no subscription. Larger models like GPT-4 have over a trillion parameters and need massive server farms. But I can still have conversations, answer questions, and explain concepts. The tradeoff is that I\'m less capable on complex reasoning tasks — but for learning and experimentation, I work great. AI doesn\'t have to be expensive or exclusive.',
        },
      ],
    },
  },

  // Guide d'installation (SetupGuide)
  setup: {
    heading: "Setup Guide",
    description: "The race below is simulated to show typical timing — the cloud lane replays data-center behavior (slower first token, faster streaming). Set up Ollama or WebGPU to run the local side for real.",
    titleWebllmActive: "Local — WebLLM Active (Ollama recommended)",
    titleLoading: "Connect Local — Loading in browser...",
    titleOllama: "Connect Local — Ollama",
    connected: "Connected",
    intro: "Ollama runs AI models directly on your machine — no internet, no API key, no data leaving your computer. The model we use here is Qwen 2.5 with 500 million parameters, small enough to fit in ~1GB of RAM. It won't match cloud quality (500M vs 70B parameters), but inference starts instantly and your prompts stay private. That's the trade-off this page lets you feel.",
    steps: [
      {
        title: "Install Ollama",
        body: <>
          Download from{' '}
          <ExternalLink href="https://ollama.com">ollama.com</ExternalLink>. It's a runtime that manages AI models on your machine — download, load, and serve them through a local API, similar to how Docker manages containers.
        </>,
      },
      {
        title: "Pull a model",
        body: <>
          Run <InlineCode>ollama pull qwen2.5:0.5b</InlineCode>. This downloads the model weights (~400MB) — the learned parameters that encode everything the model knows. "Pulling" is like pulling a Docker image: download once, run many times.
        </>,
      },
      {
        title: "Verify it works",
        body: <>
          Run <InlineCode>ollama run qwen2.5:0.5b</InlineCode> and type a question. If it responds, the model is loaded. Press Ctrl+D to exit.
        </>,
      },
      {
        title: "Install the Python backend",
        body: <>
          Run <InlineCode>pip install fastapi uvicorn httpx tiktoken</InlineCode>. This installs the server that bridges Ollama's local API to this website's frontend.
        </>,
      },
      {
        title: "Start the server",
        body: <>
          Run <InlineCode>uvicorn main:app --port 8000</InlineCode>. This launches the FastAPI backend at localhost:8000. The frontend's dev server proxies <InlineCode>/api</InlineCode> requests there.
        </>,
      },
      {
        title: "Refresh this page",
        body: <>
          The "Simulated" badge disappears from the Local column. You're running real inference on your own hardware.
        </>,
      },
    ],
  },

  // Carte « Ollama » (OllamaLocalCard)
  card: {
    title: "Run locally with Ollama",
    subtitle: 'Run AI on your own machine, no internet needed',
    subtitleConnected: 'Ollama is running — local inference active',
    connected: "Connected",
    intro: <>
    <strong style={{ color: 'var(--brand)' }}>Local inference</strong> runs the AI model directly
    on your computer — no internet, no API key, no data leaving your machine. The tradeoff: your hardware
    limits which models you can run. The 0.5B-parameter model here fits in ~1GB of RAM but is far smaller
    than cloud-scale models.
  </>,
    quickStart: "Quick start",
    getOllama: "Get Ollama",
    copied: "Copied!",
    webgpuLoaded: 'WebGPU model loaded',
    webgpuLoading: 'Loading WebGPU model...',
    webgpuTry: "Can't install? Try WebGPU",
  },

  progress: { loading: "Loading AI in your browser...", preparing: 'Preparing WebGPU...' },

  // Fiches « compromis » (TradeoffCards)
  tradeoffs: {
    title: "The Trade-offs",
    allExplored: "All explored — you understand the cloud vs. local landscape.",
    cards: [
      {
        key: 'latency',
        icon: '⚡',
        label: <>Latency — <Accent>Cloud thinks faster, but has a longer commute</Accent></>,
        insight: {
          headline: 'Time-to-first-token vs. tokens-per-second.',
          body: <>
            <strong style={{ color: '#6ec0e8' }}>Cloud</strong> has high TTFT (time-to-first-token) — your prompt
            travels over the internet to a data center, waits in a queue, then starts generating.
            But once it starts, powerful A100/H100 GPUs produce tokens at 80-150 tok/s.
            <br /><br />
            <strong style={{ color: 'var(--brand)' }}>Local</strong> starts almost instantly (no network hop),
            but consumer hardware generates at 10-30 tok/s. For short responses, local <em>feels</em> faster.
            For long responses, cloud pulls ahead.
          </>,
        },
      },
      {
        key: 'privacy',
        icon: '🔒',
        label: <>Privacy — <Accent>Local AI keeps your secrets</Accent></>,
        insight: {
          headline: 'Your data never leaves your machine.',
          body: <>
            When you use cloud AI, your prompts are sent to a remote server — stored, potentially logged,
            sometimes used for training. With local AI, the model runs entirely on your hardware.
            <strong style={{ color: 'var(--text-primary)' }}> Nothing is transmitted. Nothing is stored. Nothing is shared.</strong>
            <br /><br />
            This matters for healthcare (HIPAA), legal (attorney-client privilege), finance (SEC regulations),
            and anyone who values data sovereignty. Hospitals increasingly run local models for patient data.
            Law firms use them for confidential documents.
          </>,
        },
      },
      {
        key: 'cost',
        icon: '💰',
        label: <>Cost — <Accent>Cloud charges per token. Local is free after setup.</Accent></>,
        insight: {
          headline: 'Pay-per-use vs. upfront investment.',
          body: <>
            <strong style={{ color: '#6ec0e8' }}>Cloud pricing</strong> (typical): ~$0.03 per 1K input tokens,
            ~$0.06 per 1K output tokens. A busy chatbot handling 10,000 conversations/day can cost $500-2,000/month.
            <br /><br />
            <strong style={{ color: 'var(--brand)' }}>Local pricing</strong>: buy the hardware once, run forever.
            A $200 GPU can run small models; a high-end AI workstation can run 70B-parameter models.
            After the initial investment, every token is free.
            <br /><br />
            <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>
              The breakeven depends on usage volume — low usage favors cloud, high usage favors local.
            </span>
          </>,
        },
      },
      {
        key: 'capability',
        icon: '🧠',
        label: <>Capability — <Accent>Bigger models, better answers</Accent></>,
        insight: {
          headline: '500M parameters vs 8B+ parameters — size matters.',
          body: <>
            The local model you saw (qwen2.5:0.5b) has <strong style={{ color: 'var(--brand)' }}>500 million parameters</strong>.
            Cloud models like Llama 3.1 have <strong style={{ color: '#6ec0e8' }}>8 billion+ parameters</strong> — 16x more.
            <br /><br />
            More parameters means more "memory" for facts, better reasoning, and more coherent long-form text.
            But it also means more GPU memory needed. A 70B model needs ~35GB of VRAM (at 4-bit quantization) —
            that's an A100 or a high-end consumer GPU.
            <br /><br />
            The future is trending toward smaller, more efficient models (distillation, quantization)
            that close this gap, and new hardware keeps bringing larger models to your desk.
          </>,
        },
      },
    ],
  },

  // Panneau « L'informatique derrière tout ça »
  depthSections: [
    {
      label: 'The Concept',
      color: 'var(--brand)',
      defaultOpen: true,
      content: (
        <div>
          <p style={{ marginBottom: 16 }}>
            <strong style={{ color: 'var(--brand)', fontSize: 15 }}>The inference pipeline</strong>
          </p>
          <p style={{ marginBottom: 12 }}>
            When you send a prompt to an AI model, here's what happens in the GPU:
          </p>
          <div style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
            <StepBox step={1} title="Tokenize">
              Your text is split into tokens (you saw this on Page 1). This happens on the CPU — fast, no GPU needed.
            </StepBox>
            <StepBox step={2} title="Embed">
              Token IDs are converted to embedding vectors (Page 2). The embedding table lives in GPU memory.
            </StepBox>
            <StepBox step={3} title="Forward pass">
              Embeddings flow through dozens of transformer layers. Each layer has attention heads and feed-forward
              networks — billions of matrix multiplications. This is where the GPU earns its paycheck.
            </StepBox>
            <StepBox step={4} title="Sample next token">
              The model outputs a probability distribution over all ~100K tokens. We sample from it to pick the next token.
              Then repeat from step 2 with the new token appended.
            </StepBox>
          </div>

          <p style={{ marginBottom: 16 }}>
            <strong style={{ color: 'var(--brand)', fontSize: 15 }}>GPU memory is the bottleneck</strong>
          </p>
          <p style={{ marginBottom: 12 }}>
            A model's parameters must all fit in GPU VRAM. At FP16 (2 bytes per parameter):
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
            <div>0.5B params × 2 bytes = <strong style={{ color: 'var(--brand)' }}>1 GB</strong> (runs on a Chromebook)</div>
            <div>8B params × 2 bytes = <strong style={{ color: '#6ec0e8' }}>16 GB</strong> (needs a gaming GPU)</div>
            <div>70B params × 2 bytes = <strong style={{ color: '#e8956e' }}>140 GB</strong> (needs 2× A100 80GB)</div>
          </div>
          <p>
            <strong style={{ color: 'var(--text-primary)' }}>Quantization</strong> reduces this: 4-bit quantization
            means each parameter uses 0.5 bytes instead of 2. A 70B model drops from 140GB to ~35GB — fitting
            on a single A100 or a high-end consumer GPU. The tradeoff: slight accuracy loss.
          </p>
        </div>
      ),
    },
    {
      label: 'The Code',
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
{`# Cloud inference (any OpenAI-compatible API)
import openai

client = openai.OpenAI(
    api_key="sk-your-key-here"
)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "What is AI?"}],
    stream=True
)

for chunk in response:
    token = chunk.choices[0].delta.content
    if token:
  print(token, end="", flush=True)

# ── Same interface, different infrastructure ──────
# Local inference (Ollama — runs on your machine)
client = openai.OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"  # Ollama doesn't need a real key
)

response = client.chat.completions.create(
    model="qwen2.5:0.5b",
    messages=[{"role": "user", "content": "What is AI?"}],
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
      label: 'Challenge',
      color: '#e8d06e',
      defaultOpen: false,
      content: (
        <div>
          <p style={{ marginBottom: 10 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Think about it:</strong>
          </p>
          <p style={{ marginBottom: 8, paddingLeft: 16 }}>
            <strong style={{ color: '#e8d06e' }}>1.</strong> If an A100 has 80GB VRAM and each FP16
            parameter is 2 bytes, what's the largest model it can hold? What about at 4-bit quantization?
          </p>
          <p style={{ marginBottom: 8, paddingLeft: 16 }}>
            <strong style={{ color: '#e8d06e' }}>2.</strong> Some workstations now ship with 128GB of
            unified memory shared between CPU and GPU. How does this change what models can run locally?
          </p>
          <p style={{ paddingLeft: 16 }}>
            <strong style={{ color: '#e8d06e' }}>3.</strong> Why does cloud have higher time-to-first-token
            but faster tokens-per-second? What would change if you were on the same network as the GPU cluster?
          </p>
        </div>
      ),
    },
    {
      label: 'Real World',
      color: '#e87a96',
      defaultOpen: false,
      content: (
        <div>
          <p style={{ marginBottom: 14 }}>
            The cloud vs. local choice isn't just technical — it shapes entire industries.
          </p>
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #e87a96' }}>
              <strong style={{ color: '#e87a96' }}>Healthcare (local wins)</strong>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                Hospitals use local AI to analyze patient records. HIPAA requires data stays on-premises.
                A patient's medical history should never traverse the internet to reach a cloud GPU.
              </div>
            </div>
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #6ec0e8' }}>
              <strong style={{ color: '#6ec0e8' }}>Startups (cloud wins)</strong>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                A startup serving 1M users can't buy 100 A100s on day one. Cloud lets them scale
                GPU usage up and down with demand — paying only for what they use.
              </div>
            </div>
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid var(--brand)' }}>
              <strong style={{ color: 'var(--brand)' }}>On-device AI (bridging the gap)</strong>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                Phones and laptops now ship with neural processors and unified memory built for local
                models, and AI workstations can run 100B+ parameter models at your desk. The hardware
                is steadily collapsing the trade-off between capability and privacy.
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ],
}
