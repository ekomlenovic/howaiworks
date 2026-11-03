// Small presentational components shared by lessons AND by the
// locale files (src/i18n/locales/*). This file must not import
// '../i18n' (to avoid a circular import).
import { useMemo } from 'react'

export function Accent({ children }) {
  return <em style={{ color: 'var(--brand)', fontStyle: 'normal', fontWeight: 500 }}>{children}</em>
}

export function StepBox({ step, title, children }) {
  return (
    <div style={{
      display: 'flex',
      gap: 14,
      padding: '12px 16px',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid var(--border)',
      borderRadius: 8,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: 'var(--brand-dim)',
        color: 'var(--brand)',
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        fontWeight: 700,
        flexShrink: 0,
        marginTop: 2,
      }}>
        {step}
      </div>
      <div style={{ flex: 1 }}>
        <strong style={{ color: 'var(--text-primary)', fontSize: 14 }}>{title}</strong>
        <div style={{ marginTop: 4, fontSize: 13, lineHeight: 1.6 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ── Lightweight Python syntax highlighter ──────────────────────────────
// No external dependency — tokenizes Python code into colored spans.

const PY_KEYWORDS = new Set([
  'import', 'from', 'as', 'def', 'return', 'class', 'if', 'elif', 'else',
  'for', 'in', 'while', 'break', 'continue', 'pass', 'with', 'yield',
  'try', 'except', 'finally', 'raise', 'and', 'or', 'not', 'is', 'None',
  'True', 'False', 'lambda', 'del', 'global', 'nonlocal', 'assert',
])

const PY_BUILTINS = new Set([
  'print', 'len', 'range', 'str', 'int', 'float', 'list', 'dict', 'set',
  'tuple', 'type', 'isinstance', 'enumerate', 'zip', 'map', 'filter',
  'sorted', 'reversed', 'open', 'input', 'abs', 'max', 'min', 'sum',
])

const THEME = {
  keyword:  '#c58ee8', // purple
  builtin:  '#6ec0e8', // blue
  string:   '#e8d06e', // amber
  comment:  '#55555f', // dim
  number:   '#a8d86e', // green
  fstring:  '#e8956e', // orange — f-string braces
  decorator:'#e87a96', // pink
  default:  '#8a8a96', // text-secondary
}

function highlightPython(code) {
  const tokens = []
  let i = 0
  const src = code

  while (i < src.length) {
    // Comments
    if (src[i] === '#') {
      const end = src.indexOf('\n', i)
      const slice = end === -1 ? src.slice(i) : src.slice(i, end)
      tokens.push({ text: slice, color: THEME.comment })
      i += slice.length
      continue
    }

    // Strings (f-strings, regular strings, triple-quoted)
    if (
      (src[i] === '"' || src[i] === "'") ||
      ((src[i] === 'f' || src[i] === 'r' || src[i] === 'b') && (src[i + 1] === '"' || src[i + 1] === "'"))
    ) {
      let prefix = ''
      if (src[i] === 'f' || src[i] === 'r' || src[i] === 'b') {
        prefix = src[i]
        i++
      }
      const quote = src.slice(i, i + 3) === '"""' || src.slice(i, i + 3) === "'''"
        ? src.slice(i, i + 3)
        : src[i]
      const endQuote = quote
      let j = i + quote.length
      while (j < src.length) {
        if (src[j] === '\\') { j += 2; continue }
        if (src.slice(j, j + endQuote.length) === endQuote) { j += endQuote.length; break }
        j++
      }
      const full = prefix + src.slice(i, j)

      // For f-strings, highlight {expressions} in a different color
      if (prefix === 'f') {
        let pos = 0
        const fTokens = []
        const inner = full
        let k = 0
        while (k < inner.length) {
          if (inner[k] === '{' && inner[k + 1] !== '{') {
            // find matching close brace
            const braceStart = k
            let depth = 1
            k++
            while (k < inner.length && depth > 0) {
              if (inner[k] === '{') depth++
              if (inner[k] === '}') depth--
              k++
            }
            fTokens.push({ text: inner.slice(braceStart, k), color: THEME.fstring })
          } else {
            const start = k
            while (k < inner.length && !(inner[k] === '{' && inner[k + 1] !== '{')) k++
            fTokens.push({ text: inner.slice(start, k), color: THEME.string })
          }
        }
        tokens.push(...fTokens)
      } else {
        tokens.push({ text: full, color: THEME.string })
      }
      i = j
      continue
    }

    // Decorators
    if (src[i] === '@' && (i === 0 || src[i - 1] === '\n')) {
      const end = src.indexOf('\n', i)
      const slice = end === -1 ? src.slice(i) : src.slice(i, end)
      tokens.push({ text: slice, color: THEME.decorator })
      i += slice.length
      continue
    }

    // Numbers
    if (/\d/.test(src[i]) && (i === 0 || /[\s\W]/.test(src[i - 1]))) {
      let j = i
      while (j < src.length && /[\d._xXoObBeE]/.test(src[j])) j++
      tokens.push({ text: src.slice(i, j), color: THEME.number })
      i = j
      continue
    }

    // Identifiers / keywords
    if (/[a-zA-Z_]/.test(src[i])) {
      let j = i
      while (j < src.length && /[a-zA-Z0-9_]/.test(src[j])) j++
      const word = src.slice(i, j)
      if (PY_KEYWORDS.has(word)) {
        tokens.push({ text: word, color: THEME.keyword })
      } else if (PY_BUILTINS.has(word) && src[j] === '(') {
        tokens.push({ text: word, color: THEME.builtin })
      } else {
        tokens.push({ text: word, color: THEME.default })
      }
      i = j
      continue
    }

    // Whitespace and operators — pass through
    tokens.push({ text: src[i], color: THEME.default })
    i++
  }

  return tokens
}

export function PythonCode({ code }) {
  const highlighted = useMemo(() => highlightPython(code), [code])

  return (
    <div style={{ position: 'relative' }}>
      {/* Language badge */}
      <div style={{
        position: 'absolute',
        top: 10,
        right: 12,
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: 'var(--text-dim)',
        background: 'rgba(42, 42, 48, 0.8)',
        padding: '2px 8px',
        borderRadius: 4,
        userSelect: 'none',
      }}>
        python
      </div>
      <pre style={{
        background: 'var(--bg-deep)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '16px 20px',
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        lineHeight: 1.7,
        overflowX: 'auto',
        whiteSpace: 'pre',
        margin: 0,
        tabSize: 4,
      }}>
        {highlighted.map((tok, i) => (
          <span key={i} style={{ color: tok.color }}>{tok.text}</span>
        ))}
      </pre>
    </div>
  )
}

export function InlineCode({ children }) {
  return (
    <code style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      background: 'rgba(248, 95, 0, 0.12)',
      padding: '1px 5px',
      borderRadius: 4,
    }}>
      {children}
    </code>
  )
}

export function ExternalLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{ color: 'var(--brand)', textDecoration: 'underline' }}>
      {children}
    </a>
  )
}

// ─── QKV Diagram ────────────────────────────────────────────────────────
export function QKVDiagram({ inputLabel = 'Input', outputLabel = 'Output' }) {
  return (
    <div style={{ margin: '16px 0', overflowX: 'auto' }}>
      <svg viewBox="0 0 300 180" style={{ width: '100%', maxWidth: 300, display: 'block', margin: '0 auto' }}>
        {/* Input box */}
        <rect x={115} y={6} width={70} height={28} rx={6} fill="#141416" stroke="#2a2a30" strokeWidth={1} />
        <text x={150} y={24} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize={11} fill="#e8e8ed">{inputLabel}</text>

        {/* Branching lines to Q, K, V */}
        <line x1={150} y1={34} x2={50} y2={62} stroke="#6ec0e8" strokeWidth={1.5} />
        <line x1={150} y1={34} x2={150} y2={62} stroke="#e8956e" strokeWidth={1.5} />
        <line x1={150} y1={34} x2={250} y2={62} stroke="#f85f00" strokeWidth={1.5} />

        {/* Q box */}
        <rect x={22} y={62} width={56} height={26} rx={6} fill="#6ec0e822" stroke="#6ec0e8" strokeWidth={1} />
        <text x={50} y={79} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize={12} fontWeight={600} fill="#6ec0e8">Q</text>

        {/* K box */}
        <rect x={122} y={62} width={56} height={26} rx={6} fill="#e8956e22" stroke="#e8956e" strokeWidth={1} />
        <text x={150} y={79} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize={12} fontWeight={600} fill="#e8956e">K</text>

        {/* V box */}
        <rect x={222} y={62} width={56} height={26} rx={6} fill="#f85f0022" stroke="#f85f00" strokeWidth={1} />
        <text x={250} y={79} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize={12} fontWeight={600} fill="#f85f00">V</text>

        {/* Q and K converge to dot product box */}
        <line x1={50} y1={88} x2={110} y2={112} stroke="#6ec0e8" strokeWidth={1.5} />
        <line x1={150} y1={88} x2={140} y2={112} stroke="#e8956e" strokeWidth={1.5} />

        {/* Dot product box */}
        <rect x={88} y={108} width={74} height={26} rx={6} fill="#141416" stroke="#2a2a30" strokeWidth={1} />
        <text x={125} y={125} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize={10} fill="#e8e8ed">Q·K&#7488;/√d</text>

        {/* Softmax label */}
        <line x1={125} y1={134} x2={125} y2={148} stroke="#55555f" strokeWidth={1} />
        <text x={125} y={156} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize={10} fill="#8a8a96">softmax</text>

        {/* × V = Output */}
        <line x1={125} y1={159} x2={125} y2={169} stroke="#55555f" strokeWidth={1} />
        <line x1={250} y1={88} x2={170} y2={172} stroke="#f85f00" strokeWidth={1.5} strokeDasharray="3 2" />
        <text x={150} y={176} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize={10} fill="#f85f00">× V = {outputLabel}</text>
      </svg>
    </div>
  )
}
