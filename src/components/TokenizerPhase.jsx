import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import Nudge from './Nudge'
import DepthPanel from './DepthPanel'
import { useT } from '../i18n'
import { markLessonComplete } from './Navbar'

const CHAR_LIMIT = 280
const TYPE_SPEED = 60 // ms per character
const PAUSE_BETWEEN_PHRASES = 2000 // ms to hold each phrase before clearing

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

  // Texts (demo phrases, nudges, explanations) come from the language files
  const t = useT('tokenizer')
  const { explored } = useT('common')
  const DEMO_PHRASES = t.demoPhrases
  const NUDGES = t.nudges


  // Auto-type animation — cycles through DEMO_PHRASES
  useEffect(() => {
    if (!isReady || !isAutoTyping) return

    const currentPhrase = DEMO_PHRASES[demoPhraseIdx % DEMO_PHRASES.length]

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
        <span>{t.yourText}</span>
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
          placeholder={!isAutoTyping ? t.typePlaceholder : ""}
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
            {t.loading}
          </div>
        )}
      </div>

      {/* === Connector (spacer only) === */}
      <div style={{ padding: '12px 0' }} />

      {/* === BAR 2: What AI sees (IDs) === */}
      <div style={{ ...labelStyle, color: 'var(--brand)' }}>
        {t.whatAISees}
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
          placeholder={t.idsPlaceholder}
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
          tooltip={<>{t.stats.tokens.text}{' '}<StatLink href={t.stats.tokens.linkHref}>{t.stats.tokens.linkLabel}</StatLink></>}
        >
          <span style={{ color: 'var(--brand)', fontWeight: 600, fontSize: 15 }}>
            {tokenCount}
          </span> {t.stats.tokens.unit}
        </StatItem>
        <span style={{ color: 'var(--text-dim)' }}>·</span>
        <StatItem
          active={hoveredStat === 'characters'}
          onEnter={() => { clearTimeout(hoverTimeoutRef.current); setHoveredStat('characters') }}
          tooltip={<>{t.stats.characters.text}{' '}<StatLink href={t.stats.characters.linkHref}>{t.stats.characters.linkLabel}</StatLink></>}
        >
          {charCount} {t.stats.characters.unit}
        </StatItem>
        <span style={{ color: 'var(--text-dim)' }}>·</span>
        <StatItem
          active={hoveredStat === 'ratio'}
          onEnter={() => { clearTimeout(hoverTimeoutRef.current); setHoveredStat('ratio') }}
          tooltip={<>{t.stats.ratio.text}{' '}<StatLink href={t.stats.ratio.linkHref}>{t.stats.ratio.linkLabel}</StatLink></>}
        >
          {charsPerToken} {t.stats.ratio.unit}
        </StatItem>
        <span style={{ color: 'var(--text-dim)' }}>·</span>
        <StatItem
          active={hoveredStat === 'cost'}
          onEnter={() => { clearTimeout(hoverTimeoutRef.current); setHoveredStat('cost') }}
          tooltip={<>{t.stats.cost.text}{' '}<StatLink href={t.stats.cost.linkHref}>{t.stats.cost.linkLabel}</StatLink></>}
        >
          ~${tokenCount > 0 ? (tokenCount * 0.00003).toFixed(5) : '0.00000'}/{t.stats.cost.unit}
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
            {t.whatIsToken.title}
          </div>
          <div style={{
            fontSize: 14,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
          }}>
            {t.whatIsToken.body}
          </div>
        </div>
        <div>
          <div style={{
            fontSize: 17,
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 12,
          }}>
            {t.whatIsTokenizer.title}
          </div>
          <div style={{
            fontSize: 14,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
          }}>
            {t.whatIsTokenizer.body}
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
              ? t.allExplored
              : explored(exploredNudges.size, NUDGES.length)
            }
          </motion.div>
        )}
      </div>

      {/* Go Deeper panel — always visible */}
      <DepthPanel
        visible={true}
        delay={0.5}
        onOpen={onDepthOpened}
        sections={t.depthSections}
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
