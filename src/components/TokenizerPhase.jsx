import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import Nudge from './Nudge'
import DepthPanel, { PythonCode } from './DepthPanel'
import { markLessonComplete } from './Navbar'

const CHAR_LIMIT = 280
const TYPE_SPEED = 60 // ms per character
const PAUSE_BETWEEN_PHRASES = 2000 // ms to hold each phrase before clearing

const DEMO_PHRASES = [
  'Comment fonctionne l’IA ?',
  'Continue à nager.',
  'Résume ce document pour moi.',
  'Bonjour le monde !',
  'Corrige le bug dans mon code.',
  'Un grand pouvoir implique de grandes responsabilités.',
  'Explique-moi comme si j’avais cinq ans.',
  "Je suis désolé, Dave. J’ai bien peur de ne pas pouvoir faire ça.", // easter egg — last
]

// Token color palette - matches globals.css .token-color-*
const TOKEN_COLORS = [
  '#a8d86e', '#6ec0e8', '#e8956e', '#c58ee8', '#e8d06e', '#6ee8cc',
  '#e87a96', '#94a0e8', '#e8a0d6', '#b0d87a', '#e8a07a', '#7ac0e8',
]

export default function TokenizerPhase({
  inputText,
  onInputChange,
  tokens,
  decode,
  isLoading,
  isReady,
  onUserTyped,
  onDepthOpened,
}) {
  const [isAutoTyping, setIsAutoTyping] = useState(true)
  const [autoTypeIndex, setAutoTypeIndex] = useState(0)
  const [demoPhraseIdx, setDemoPhraseIdx] = useState(0) // which phrase in DEMO_PHRASES
  const [userHasTyped, setUserHasTyped] = useState(false)
  const [textFocused, setTextFocused] = useState(false)
  const [textHovered, setTextHovered] = useState(false)
  const [idsFocused, setIdsFocused] = useState(false)
  const [hoveredStat, setHoveredStat] = useState(null)
  const [activeNudge, setActiveNudge] = useState(null) // key of the clicked nudge
  const [exploredNudges, setExploredNudges] = useState(new Set()) // nudges user has clicked
  const [nudgeTyping, setNudgeTyping] = useState(null) // { text, index } for nudge type animation
  const hoverTimeoutRef = useRef(null)
  const textInputRef = useRef(null)
  const idsInputRef = useRef(null)

  // Which bar the user is actively editing
  const [editingBar, setEditingBar] = useState(null) // 'text' | 'ids' | null
  // Raw user input in the IDs bar during editing
  const [idsInputText, setIdsInputText] = useState('')

  // Nudge definitions with unique insights
  const NUDGES = [
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
  ]

  // Auto-type animation — cycles through DEMO_PHRASES
  useEffect(() => {
    if (!isReady || !isAutoTyping) return

    const currentPhrase = DEMO_PHRASES[demoPhraseIdx]

    if (autoTypeIndex < currentPhrase.length) {
      // Still typing the current phrase
      const timer = setTimeout(() => {
        const newText = currentPhrase.slice(0, autoTypeIndex + 1)
        onInputChange(newText)
        setAutoTypeIndex(autoTypeIndex + 1)
      }, TYPE_SPEED)
      return () => clearTimeout(timer)
    } else {
      // Phrase fully typed — pause then move to next
      const timer = setTimeout(() => {
        const nextIdx = (demoPhraseIdx + 1) % DEMO_PHRASES.length
        setDemoPhraseIdx(nextIdx)
        setAutoTypeIndex(0)
        onInputChange('')
      }, PAUSE_BETWEEN_PHRASES)
      return () => clearTimeout(timer)
    }
  }, [isReady, isAutoTyping, autoTypeIndex, demoPhraseIdx, onInputChange])

  // Nudge typing animation (character-by-character, same as initial auto-type)
  useEffect(() => {
    if (!nudgeTyping) return

    const { text, index } = nudgeTyping
    if (index < text.length) {
      const timer = setTimeout(() => {
        const newText = text.slice(0, index + 1)
        onInputChange(newText)
        setNudgeTyping({ text, index: index + 1 })
      }, TYPE_SPEED)
      return () => clearTimeout(timer)
    } else {
      // Typing complete
      setNudgeTyping(null)
    }
  }, [nudgeTyping, onInputChange])

  // Handle user text input (bar 1)
  const handleTextInput = useCallback((e) => {
    let text = e.target.value
    // Enforce character limit
    if (text.length > CHAR_LIMIT) {
      text = text.slice(0, CHAR_LIMIT)
    }
    // Cancel any in-progress nudge typing animation
    setNudgeTyping(null)
    if (!userHasTyped) {
      setUserHasTyped(true)
      setIsAutoTyping(false)
      onUserTyped?.()
    }
    onInputChange(text)
  }, [onInputChange, userHasTyped, onUserTyped])

  // Handle IDs input (bar 2)
  const handleIdsInput = useCallback((e) => {
    const raw = e.target.value
    setNudgeTyping(null) // Cancel any in-progress nudge typing
    setIdsInputText(raw)

    // Parse space-separated numbers
    const parts = raw.trim().split(/\s+/)
    const ids = parts
      .map(p => parseInt(p, 10))
      .filter(n => !isNaN(n) && n >= 0)

    if (ids.length > 0 && decode) {
      const { text } = decode(ids)
      onInputChange(text)
      if (!userHasTyped) {
        setUserHasTyped(true)
        onUserTyped?.()
      }
    } else if (raw.trim() === '') {
      onInputChange('')
    }
  }, [decode, onInputChange, userHasTyped, onUserTyped])

  // Auto-resize text textarea when text changes programmatically (auto-type, nudges)
  useEffect(() => {
    const el = textInputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [inputText])

  // Derived IDs text from tokens
  const derivedIdsText = useMemo(() => {
    return tokens.map(t => t.id).join('  ')
  }, [tokens])

  // Auto-resize IDs textarea when derived IDs change (not during editing)
  useEffect(() => {
    if (editingBar === 'ids') return
    const el = idsInputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [derivedIdsText, editingBar])

  // Handle nudge clicks
  const handleNudge = (nudgeKey, text) => {
    // If this nudge is already open, just close it
    if (activeNudge === nudgeKey) {
      setActiveNudge(null)
      return
    }
    // Clear current text and start typing animation
    onInputChange('')
    setNudgeTyping({ text, index: 0 })
    if (textInputRef.current) {
      textInputRef.current.focus({ preventScroll: true })
    }
    setEditingBar('text')
    setActiveNudge(nudgeKey)
    setExploredNudges(prev => {
      const next = new Set([...prev, nudgeKey])
      // Fire confetti when all nudges explored for the first time
      if (next.size === NUDGES.length && prev.size < NUDGES.length) {
        markLessonComplete('lesson-complete-tokenizer')
        setTimeout(() => {
          // Left burst
          confetti({
            particleCount: 60,
            spread: 55,
            origin: { x: 0.15, y: 0.6 },
            colors: ['#f85f00', '#00b4d8', '#e0aaff', '#ffd166', '#ef476f', '#06d6a0'],
          })
          // Right burst
          confetti({
            particleCount: 60,
            spread: 55,
            origin: { x: 0.85, y: 0.6 },
            colors: ['#f85f00', '#00b4d8', '#e0aaff', '#ffd166', '#ef476f', '#06d6a0'],
          })
          // Center shower after a beat
          setTimeout(() => {
            confetti({
              particleCount: 100,
              spread: 100,
              origin: { x: 0.5, y: 0.4 },
              colors: ['#f85f00', '#00b4d8', '#e0aaff', '#ffd166', '#ef476f', '#06d6a0'],
            })
          }, 250)
        }, 400)
      }
      return next
    })
    if (!userHasTyped) {
      setUserHasTyped(true)
      onUserTyped?.()
    }
  }

  // Build token-colored segments for text bar overlay
  const coloredSegments = useMemo(() => {
    if (!tokens.length) return null

    let offset = 0
    return tokens.map((token, i) => {
      const color = TOKEN_COLORS[i % TOKEN_COLORS.length]
      const segment = {
        text: token.text,
        color,
        id: token.id,
        index: i,
        start: offset,
      }
      offset += token.text.length
      return segment
    })
  }, [tokens])

  // Build colored segments for IDs bar overlay
  const idsColoredSegments = useMemo(() => {
    if (editingBar === 'ids') {
      // During editing: colorize the parsed numbers from user input
      const parts = idsInputText.trim().split(/\s+/)
      let colorIdx = 0
      const segments = []
      let pos = 0
      for (const part of parts) {
        const idx = idsInputText.indexOf(part, pos)
        if (idx > pos) {
          segments.push({ text: idsInputText.slice(pos, idx), color: 'var(--text-dim)', isSpace: true })
        }
        const num = parseInt(part, 10)
        const isValid = !isNaN(num) && num >= 0
        segments.push({
          text: part,
          color: isValid ? TOKEN_COLORS[colorIdx % TOKEN_COLORS.length] : '#ef476f',
          isSpace: false,
        })
        if (isValid) colorIdx++
        pos = idx + part.length
      }
      if (pos < idsInputText.length) {
        segments.push({ text: idsInputText.slice(pos), color: 'var(--text-dim)', isSpace: true })
      }
      return segments
    }

    // Not editing: derive from tokens
    if (!tokens.length) return null
    const segments = []
    tokens.forEach((token, i) => {
      if (i > 0) {
        segments.push({ text: '  ', color: 'var(--text-dim)', isSpace: true })
      }
      segments.push({
        text: String(token.id),
        color: TOKEN_COLORS[i % TOKEN_COLORS.length],
        isSpace: false,
      })
    })
    return segments
  }, [tokens, editingBar, idsInputText])

  // IDs bar value when not editing
  const idsDisplayValue = editingBar === 'ids' ? idsInputText : derivedIdsText

  const tokenCount = tokens.length
  const charCount = inputText.length
  const charsPerToken = tokenCount > 0 ? (charCount / tokenCount).toFixed(1) : 0

  // Whether bar 1 should breathe (after auto-type, before user types)
  const isBreathing = !isAutoTyping && !userHasTyped && !textFocused

  // Shared bar styles
  const barStyle = (focused, { breathing = false, hovered = false } = {}) => ({
    width: '100%',
    minHeight: 59,
    padding: '16px 20px',
    background: 'var(--bg-surface)',
    border: `1px solid ${
      focused ? 'var(--brand)'
      : hovered ? 'rgba(248, 95, 0,0.45)'
      : 'var(--border)'
    }`,
    borderRadius: 12,
    color: 'transparent',
    caretColor: 'transparent',
    fontFamily: 'var(--font-mono)',
    fontSize: 18,
    lineHeight: 1.5,
    resize: 'none',
    overflow: 'hidden',
    outline: 'none',
    transition: breathing && !hovered ? 'none' : 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused ? '0 0 0 3px var(--brand-dim)'
      : hovered ? '0 0 0 3px rgba(248, 95, 0,0.15)'
      : 'none',
    animation: (breathing && !hovered) ? 'breathe 2.5s ease-in-out infinite' : 'none',
  })

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: '16px 20px',
    fontFamily: 'var(--font-mono)',
    fontSize: 18,
    lineHeight: 1.5,
    pointerEvents: 'none',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    borderRadius: 12,
    overflow: 'hidden',
  }

  const labelStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      style={{ padding: '20px 0 20px' }}
    >
      {/* === BAR 1: Your text === */}
      <div style={{ ...labelStyle, color: 'var(--brand)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Votre texte</span>
        {userHasTyped && (
          <span style={{
            color: charCount >= CHAR_LIMIT ? '#e87a96' : charCount >= CHAR_LIMIT * 0.85 ? '#e8d06e' : 'var(--text-dim)',
            fontWeight: charCount >= CHAR_LIMIT ? 600 : 400,
            fontSize: 11,
            transition: 'color 0.2s',
          }}>
            {charCount}/{CHAR_LIMIT}
          </span>
        )}
      </div>
      <div
        style={{ position: 'relative', marginBottom: 0, cursor: textFocused ? undefined : 'pointer' }}
        onMouseEnter={() => setTextHovered(true)}
        onMouseLeave={() => setTextHovered(false)}
      >
        {/* Colored overlay */}
        <div style={overlayStyle}>
          {coloredSegments?.map((seg, i) => (
            <span key={i} style={{ color: seg.color }}>
              {seg.text}
            </span>
          ))}
          {(textFocused || (!userHasTyped && !isAutoTyping)) && (
            <span
              style={{
                display: 'inline-block',
                width: 2,
                height: '1.2em',
                background: 'var(--brand)',
                marginLeft: 1,
                verticalAlign: 'text-bottom',
                animation: 'blink 1s step-end infinite',
              }}
            />
          )}
        </div>

        {/* Actual textarea */}
        <textarea
          ref={textInputRef}
          value={inputText}
          placeholder={!isAutoTyping ? "Tapez ce que vous voulez ici…" : ""}
          rows={1}
          onChange={(e) => {
            handleTextInput(e)
            e.target.style.height = 'auto'
            e.target.style.height = e.target.scrollHeight + 'px'
          }}
          onFocus={() => {
            setTextFocused(true)
            setEditingBar('text')
            // On first focus, stop auto-typing and clear so user can type
            if (!userHasTyped) {
              setIsAutoTyping(false)
              setNudgeTyping(null)
              setUserHasTyped(true)
              onInputChange('')
              onUserTyped?.()
            }
          }}
          onBlur={() => { setTextFocused(false); setEditingBar(null) }}
          maxLength={CHAR_LIMIT}
          style={barStyle(textFocused, { breathing: isBreathing, hovered: textHovered && !textFocused })}
        />

        {isLoading && (
          <div style={{
            position: 'absolute',
            top: 12,
            right: 16,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-dim)',
          }}>
            Chargement du tokeniseur…
          </div>
        )}
      </div>

      {/* === Connector (spacer only) === */}
      <div style={{ padding: '12px 0' }} />

      {/* === BAR 2: What AI sees (IDs) === */}
      <div style={{ ...labelStyle, color: 'var(--brand)' }}>
        Ce que voit l’IA
      </div>
      <div style={{ position: 'relative', marginBottom: 24 }}>
        {/* Colored overlay for IDs */}
        <div style={overlayStyle}>
          {idsColoredSegments?.map((seg, i) => (
            <span key={i} style={{ color: seg.color }}>
              {seg.text}
            </span>
          ))}
          {idsFocused && (
            <span
              style={{
                display: 'inline-block',
                width: 2,
                height: '1.2em',
                background: 'var(--brand)',
                marginLeft: 1,
                verticalAlign: 'text-bottom',
                animation: 'blink 1s step-end infinite',
              }}
            />
          )}
        </div>

        {/* Actual textarea for IDs */}
        <textarea
          ref={idsInputRef}
          value={idsDisplayValue}
          placeholder="Les identifiants des tokens apparaissent ici…"
          rows={1}
          onChange={(e) => {
            handleIdsInput(e)
            e.target.style.height = 'auto'
            e.target.style.height = e.target.scrollHeight + 'px'
          }}
          onFocus={() => {
            setIdsFocused(true)
            setEditingBar('ids')
            setIdsInputText(derivedIdsText)
          }}
          onBlur={() => {
            setIdsFocused(false)
            setEditingBar(null)
          }}
          style={barStyle(idsFocused)}
        />
      </div>

      {/* Stats bar */}
      <div
        onMouseLeave={() => {
          hoverTimeoutRef.current = setTimeout(() => setHoveredStat(null), 150)
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '12px 0',
          borderTop: '1px solid var(--border)',
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          color: 'var(--text-secondary)',
          flexWrap: 'wrap',
          position: 'relative',
        }}
      >
        <StatItem
          active={hoveredStat === 'tokens'}
          onEnter={() => { clearTimeout(hoverTimeoutRef.current); setHoveredStat('tokens') }}
          tooltip={<>
            L’IA ne sait pas lire du texte. Elle découpe ce que vous écrivez en petits morceaux appelés tokens, souvent des bouts de mots plutôt que des mots entiers. « strawberry » devient 3 tokens : « str », « aw », « berry ». Tout ce que fait l’IA part de ces fragments.{' '}
            <StatLink href="https://platform.openai.com/tokenizer">Essayer le tokeniseur d’OpenAI</StatLink>
          </>}
        >
          <span style={{ color: 'var(--brand)', fontWeight: 600, fontSize: 15 }}>
            {tokenCount}
          </span> tokens
        </StatItem>
        <span style={{ color: 'var(--text-dim)' }}>·</span>
        <StatItem
          active={hoveredStat === 'characters'}
          onEnter={() => { clearTimeout(hoverTimeoutRef.current); setHoveredStat('characters') }}
          tooltip={<>
            Les lettres, espaces et symboles bruts que vous avez tapés : ce que lisent les humains. L’IA ne les voit jamais directement. Elle les convertit d’abord en tokens, c’est pourquoi le nombre de tokens est toujours différent du nombre de caractères.{' '}
            <StatLink href="https://huggingface.co/learn/llm-course/en/chapter2/4">Comment fonctionnent les tokeniseurs (en anglais)</StatLink>
          </>}
        >
          {charCount} caractères
        </StatItem>
        <span style={{ color: 'var(--text-dim)' }}>·</span>
        <StatItem
          active={hoveredStat === 'ratio'}
          onEnter={() => { clearTimeout(hoverTimeoutRef.current); setHoveredStat('ratio') }}
          tooltip={<>
            Le nombre moyen de caractères par token. En anglais, on tourne autour de 4 caractères par token. Un ratio plus faible signifie plus de tokens pour le même texte, donc une IA plus lente et plus chère. Les langues autres que l’anglais (dont le français) ont souvent un ratio moins bon.{' '}
            <StatLink href="https://huggingface.co/spaces/Xenova/the-tokenizer-playground">Bac à sable des tokeniseurs</StatLink>
          </>}
        >
          {charsPerToken} car./token
        </StatItem>
        <span style={{ color: 'var(--text-dim)' }}>·</span>
        <StatItem
          active={hoveredStat === 'cost'}
          onEnter={() => { clearTimeout(hoverTimeoutRef.current); setHoveredStat('cost') }}
          tooltip={<>
            Les API d’IA facturent au token, pas au mot ni au message. Cette estimation utilise le tarif d’entrée de GPT-4 (~0,03 $ pour 1 000 tokens). Plus de tokens = plus cher : c’est pourquoi une tokenisation moins efficace pour les textes non anglais crée une vraie inégalité de coût.{' '}
            <StatLink href="https://openai.com/api/pricing/">Tarifs d’OpenAI</StatLink>
          </>}
        >
          ~${tokenCount > 0 ? (tokenCount * 0.00003).toFixed(5) : '0.00000'}/appel
        </StatItem>
      </div>

      <div style={{
        marginTop: 24,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}>
        <div>
          <div style={{
            fontSize: 17,
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 12,
          }}>
            Qu’est-ce qu’un token ?
          </div>
          <div style={{
            fontSize: 14,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
          }}>
            Un token est un petit morceau de texte : un mot entier, un bout de mot, voire un seul caractère. L’IA ne lit pas les mots comme vous. Elle commence par tout découper en morceaux de ce genre. Chaque bloc coloré ci-dessus est un token.
          </div>
        </div>
        <div>
          <div style={{
            fontSize: 17,
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 12,
          }}>
            Qu’est-ce qu’un tokeniseur ?
          </div>
          <div style={{
            fontSize: 14,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
          }}>
            Le tokeniseur est l’outil qui décide où couper. Celui qui tourne ici est <span style={{ color: 'var(--text-primary)' }}>cl100k_base</span>, le même que celui de ChatGPT et GPT-4. Il possède un vocabulaire d’environ 100 000 tokens, et chaque morceau de texte que vous tapez est associé à des entrées de ce vocabulaire. C’est la toute première étape qu’effectue un modèle de langage avant de pouvoir comprendre quoi que ce soit.
          </div>
        </div>
      </div>

      {/* Nudges - accordion style, each expands to reveal insight */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
        {NUDGES.map((nudge, i) => (
          <Nudge
            key={nudge.key}
            icon={nudge.icon}
            onClick={() => handleNudge(nudge.key, nudge.text)}
            delay={0}
            explored={exploredNudges.has(nudge.key)}
            active={activeNudge === nudge.key}
            insightContent={
              <>
                <strong style={{ color: 'var(--brand)', fontWeight: 600 }}>
                  {nudge.insight.headline}
                </strong>{' '}
                {nudge.insight.body}
                {nudge.insight.nextHint && (
                  <div style={{
                    marginTop: 10,
                    paddingTop: 8,
                    borderTop: '1px solid rgba(248, 95, 0, 0.1)',
                    fontSize: 13,
                    color: 'var(--brand)',
                    fontWeight: 500,
                    opacity: 0.85,
                  }}>
                    {nudge.insight.nextHint}
                  </div>
                )}
              </>
            }
          >
            {nudge.label}
          </Nudge>
        ))}
        {exploredNudges.size > 0 && (
          <motion.div
            key={exploredNudges.size === NUDGES.length ? 'complete' : 'progress'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: exploredNudges.size === NUDGES.length ? 12 : 11,
              color: exploredNudges.size === NUDGES.length ? 'var(--brand)' : 'var(--text-dim)',
              paddingLeft: 4,
              marginTop: 2,
              fontWeight: exploredNudges.size === NUDGES.length ? 600 : 400,
            }}
          >
            {exploredNudges.size === NUDGES.length
              ? 'Tout exploré : vous voyez maintenant ce que voit l’IA.'
              : `${exploredNudges.size}/${NUDGES.length} explorés`
            }
          </motion.div>
        )}
      </div>

      {/* Go Deeper panel — always visible */}
      <DepthPanel
        visible={true}
        delay={0.5}
        onOpen={onDepthOpened}
        sections={[
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
        ]}
      />

      {/* CSS for cursor blink and breathing border animations */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes breathe {
          0%, 100% {
            box-shadow: 0 0 0 2px rgba(248, 95, 0,0.08);
            border-color: rgba(248, 95, 0,0.25);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(248, 95, 0,0.2);
            border-color: rgba(248, 95, 0,0.45);
          }
        }
      `}</style>
    </motion.div>
  )
}

function Accent({ children }) {
  return <em style={{ color: 'var(--brand)', fontStyle: 'normal', fontWeight: 500 }}>{children}</em>
}

function StatItem({ children, active, onEnter, tooltip }) {
  return (
    <span
      onMouseEnter={onEnter}
      style={{
        cursor: 'default',
        borderBottom: `1px dashed ${active ? 'var(--brand)' : 'var(--text-dim)'}`,
        paddingBottom: 2,
        color: active ? 'var(--brand)' : undefined,
        transition: 'color 0.2s, border-color 0.2s',
        position: 'relative',
      }}
    >
      {children}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 260,
              padding: '10px 14px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              lineHeight: 1.5,
              color: 'var(--text-secondary)',
              zIndex: 10,
              pointerEvents: 'auto',
              whiteSpace: 'normal',
            }}
          >
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}

function StatLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: 'var(--brand)',
        textDecoration: 'underline',
        textUnderlineOffset: 2,
      }}
    >
      {children} ↗
    </a>
  )
}

function StepBox({ step, title, children }) {
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
