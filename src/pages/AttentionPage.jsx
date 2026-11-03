import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import Nudge from '../components/Nudge'
import DepthPanel from '../components/DepthPanel'
import Footer from '../components/Footer'
import DeeperDive from '../components/DeeperDive'
import FunnelCTA from '../components/FunnelCTA'
import { markLessonComplete } from '../components/Navbar'
import { useT } from '../i18n'

// ─── Section card wrapper ──────────────────────────────────────────────
function SectionCard({ badge, title, explanation, children }) {
  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  }
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: '28px 24px',
        marginBottom: 20,
      }}
    >
      <motion.div variants={fadeUp} style={{ marginBottom: 16 }}>
        <span style={{
          display: 'inline-block',
          padding: '3px 10px',
          borderRadius: 6,
          background: 'var(--brand-dim)',
          color: 'var(--brand)',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 0.5,
        }}>
          {badge}
        </span>
      </motion.div>

      <motion.h2 variants={fadeUp} style={{
        fontSize: 'clamp(18px, 4vw, 24px)',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: 8,
        lineHeight: 1.3,
      }}>
        {title}
      </motion.h2>

      <motion.p variants={fadeUp} style={{
        fontSize: 15,
        color: 'var(--text-secondary)',
        lineHeight: 1.6,
        marginBottom: 24,
      }}>
        {explanation}
      </motion.p>

      <motion.div variants={fadeUp}>
        {children}
      </motion.div>
    </motion.div>
  )
}

// ─── Attention heatmap: click a word to see what it attends to ─────────
const SENTENCE_WORDS = ['The', 'animal', 'didn\'t', 'cross', 'the', 'street', 'because', 'it', 'was', 'too', 'tired']

// Simplified attention weights — what each word attends to most
// Each row = source word, values = attention weight to each target word
const ATTENTION_WEIGHTS = {
  'The':     [0.1, 0.6, 0.05, 0.05, 0.05, 0.05, 0.02, 0.03, 0.02, 0.02, 0.02],
  'animal':  [0.15, 0.3, 0.05, 0.1, 0.05, 0.1, 0.05, 0.1, 0.03, 0.03, 0.04],
  'didn\'t': [0.05, 0.15, 0.15, 0.35, 0.05, 0.05, 0.05, 0.05, 0.03, 0.03, 0.04],
  'cross':   [0.03, 0.1, 0.15, 0.15, 0.05, 0.35, 0.02, 0.05, 0.03, 0.03, 0.04],
  'the':     [0.05, 0.05, 0.03, 0.05, 0.1, 0.55, 0.02, 0.05, 0.03, 0.03, 0.04],
  'street':  [0.03, 0.05, 0.05, 0.2, 0.15, 0.3, 0.05, 0.05, 0.03, 0.03, 0.06],
  'because': [0.02, 0.1, 0.15, 0.05, 0.02, 0.05, 0.15, 0.2, 0.1, 0.06, 0.1],
  'it':      [0.05, 0.55, 0.05, 0.03, 0.02, 0.05, 0.05, 0.1, 0.03, 0.03, 0.04],
  'was':     [0.03, 0.1, 0.05, 0.03, 0.02, 0.03, 0.05, 0.3, 0.2, 0.05, 0.14],
  'too':     [0.02, 0.05, 0.03, 0.02, 0.02, 0.03, 0.03, 0.1, 0.1, 0.2, 0.4],
  'tired':   [0.03, 0.25, 0.05, 0.03, 0.02, 0.03, 0.05, 0.2, 0.1, 0.1, 0.14],
}

function AttentionHeatmap() {
  const t = useT('attention')
  const [selectedWord, setSelectedWord] = useState(null)
  const [autoPhase, setAutoPhase] = useState(0)

  // Auto-demo: highlight "it" after a delay to show the key insight
  useEffect(() => {
    const t1 = setTimeout(() => setAutoPhase(1), 1200)
    const t2 = setTimeout(() => {
      setSelectedWord('it')
      setAutoPhase(2)
    }, 2000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const weights = selectedWord ? ATTENTION_WEIGHTS[selectedWord] : null

  return (
    <div>
      {/* Instruction */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          fontSize: 13,
          color: 'var(--text-dim)',
          marginBottom: 16,
          fontFamily: 'var(--font-mono)',
        }}
      >
        {autoPhase < 2 ? t.heatmap.watch : t.heatmap.click}
      </motion.div>

      {/* Sentence with clickable words */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 20,
      }}>
        {SENTENCE_WORDS.map((word, i) => {
          const isSelected = selectedWord === word
          const weight = weights ? weights[i] : 0
          const bgOpacity = isSelected ? 0.3 : weight * 0.8
          const borderColor = isSelected
            ? 'var(--brand)'
            : weight > 0.2
              ? `rgba(248, 95, 0, ${weight})`
              : 'var(--border)'

          return (
            <motion.button
              key={`${word}-${i}`}
              onClick={() => setSelectedWord(isSelected ? null : word)}
              animate={{
                scale: weight > 0.3 ? 1.08 : 1,
                borderColor,
              }}
              transition={{ duration: 0.3 }}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                background: `rgba(248, 95, 0, ${bgOpacity})`,
                border: `2px solid ${borderColor}`,
                color: isSelected ? 'var(--brand)' : 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: 15,
                fontWeight: isSelected ? 700 : 400,
                cursor: 'pointer',
                transition: 'background 0.3s',
                position: 'relative',
              }}
            >
              {word}
              {/* Weight label */}
              <AnimatePresence>
                {weights && weight > 0 && !isSelected && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'absolute',
                      bottom: -18,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: 10,
                      fontFamily: 'var(--font-mono)',
                      color: weight > 0.2 ? 'var(--brand)' : 'var(--text-dim)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {(weight * 100).toFixed(0)}%
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>

      {/* Insight text */}
      <AnimatePresence mode="wait">
        {selectedWord && (
          <motion.div
            key={selectedWord}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            style={{
              padding: '12px 16px',
              background: 'var(--bg-deep)',
              borderRadius: 10,
              border: '1px solid var(--border)',
              marginTop: 12,
            }}
          >
            <span style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {t.heatmap.insight(selectedWord)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Multi-head visualization ──────────────────────────────────────────
// Attention heads (names, descriptions, links) live in the language files: attention.heads

function MultiHeadViz() {
  const t = useT('attention')
  const HEADS = t.heads
  const [activeHeads, setActiveHeads] = useState(() => new Set())

  // Build word → index lookup
  const wordIndexMap = {}
  SENTENCE_WORDS.forEach((w, i) => {
    if (!(w in wordIndexMap)) wordIndexMap[w] = i
  })

  const svgWidth = 680
  const svgHeight = 140
  const wordY = 110
  const wordSpacing = 62
  const startX = 10

  const toggleHead = (name) => {
    setActiveHeads(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  // Gather all active connections
  const activeConnections = []
  HEADS.forEach(head => {
    if (activeHeads.has(head.name)) {
      head.connections.forEach(conn => {
        activeConnections.push({ ...conn, color: head.color })
      })
    }
  })

  // Compute involved words
  const involvedWords = new Set()
  activeConnections.forEach(c => { involvedWords.add(c.from); involvedWords.add(c.to) })

  return (
    <div>
      {/* Head selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {HEADS.map((head) => {
          const isActive = activeHeads.has(head.name)
          return (
            <button
              key={head.name}
              onClick={() => toggleHead(head.name)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                background: isActive ? head.color + '22' : 'var(--bg-deep)',
                border: `1px solid ${isActive ? head.color : 'var(--border)'}`,
                color: isActive ? head.color : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {head.name}
            </button>
          )
        })}
      </div>

      {/* SVG arc visualization */}
      <div style={{ overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', maxWidth: svgWidth, display: 'block' }}
        >
          {/* Words */}
          {SENTENCE_WORDS.map((word, i) => {
            const x = startX + i * wordSpacing
            const isInvolved = involvedWords.has(word)
            return (
              <motion.text
                key={`word-${i}`}
                x={x}
                y={wordY}
                textAnchor="middle"
                fontFamily="IBM Plex Mono, monospace"
                fontSize={12}
                fontWeight={isInvolved ? 700 : 400}
                fill={isInvolved ? '#e8e8ed' : '#8a8a96'}
                animate={{ fill: isInvolved ? '#e8e8ed' : '#8a8a96' }}
                transition={{ duration: 0.3 }}
              >
                {word}
              </motion.text>
            )
          })}

          {/* Arcs */}
          <AnimatePresence>
            {activeConnections.map((conn, ci) => {
              const fromIdx = wordIndexMap[conn.from]
              const toIdx = wordIndexMap[conn.to]
              if (fromIdx === undefined || toIdx === undefined) return null
              const x1 = startX + fromIdx * wordSpacing
              const x2 = startX + toIdx * wordSpacing
              const midX = (x1 + x2) / 2
              const dist = Math.abs(x2 - x1)
              const arcHeight = Math.min(dist * 0.55, 70)
              const cy = wordY - 20 - arcHeight
              const d = `M ${x1} ${wordY - 14} Q ${midX} ${cy} ${x2} ${wordY - 14}`
              const labelY = cy + (wordY - 14 - cy) * 0.25

              return (
                <g key={`arc-${conn.from}-${conn.to}-${conn.color}-${ci}`}>
                  <motion.path
                    d={d}
                    fill="none"
                    stroke={conn.color}
                    strokeWidth={2}
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.85 }}
                    exit={{ pathLength: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                  {/* Arrowhead dot */}
                  <motion.circle
                    cx={x2}
                    cy={wordY - 14}
                    r={3}
                    fill={conn.color}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.3, delay: 0.35 }}
                  />
                  {/* Label at arc midpoint */}
                  <motion.text
                    x={midX}
                    y={labelY}
                    textAnchor="middle"
                    fontFamily="IBM Plex Mono, monospace"
                    fontSize={9}
                    fill={conn.color}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.9 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    {conn.label}
                  </motion.text>
                </g>
              )
            })}
          </AnimatePresence>
        </svg>
      </div>

      {/* Head descriptions */}
      {activeHeads.size > 0 && (
        <div style={{ marginTop: 10 }}>
          {HEADS.filter(h => activeHeads.has(h.name)).map(head => (
            <div
              key={head.name}
              style={{
                fontSize: 13,
                color: head.color,
                lineHeight: 1.5,
                fontStyle: 'italic',
                marginBottom: 4,
              }}
            >
              {head.name}: {head.description}
            </div>
          ))}
        </div>
      )}

      {activeHeads.size === 0 && (
        <div style={{
          marginTop: 8,
          fontSize: 13,
          color: 'var(--text-dim)',
          fontFamily: 'var(--font-mono)',
        }}>
          {t.toggleHeads}
        </div>
      )}
    </div>
  )
}

// ─── Transformer stack visualization ───────────────────────────────────
function TransformerStack() {
  const t = useT('attention')
  const [activeLayer, setActiveLayer] = useState(null)
  const LAYERS = t.layers

  const svgW = 430
  const blockW = 260
  const blockH = 40
  const gap = 8
  const leftPad = 60
  const topPad = 20
  const totalH = topPad + LAYERS.length * (blockH + gap) + 60
  const arrowX = leftPad + blockW / 2

  // Residual connection anchors
  // skip 1: from before Self-Attention (layer 1 top) to after Add&Norm (layer 2 bottom)
  // skip 2: from before Feed-Forward (layer 3 top) to after Add&Norm (layer 4 bottom)
  const residuals = [
    { fromLayer: 1, toLayer: 2 },
    { fromLayer: 3, toLayer: 4 },
  ]

  const layerY = (i) => topPad + i * (blockH + gap)

  // Total pulse path length (top to bottom of all blocks)
  const pulseStartY = layerY(0)
  const pulseEndY = layerY(LAYERS.length - 1) + blockH

  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${svgW} ${totalH}`} style={{ width: '100%', maxWidth: svgW, display: 'block' }}>
          {/* Dashed residual connection curves on left side */}
          {residuals.map((r, ri) => {
            const y1 = layerY(r.fromLayer) + blockH / 2
            const y2 = layerY(r.toLayer) + blockH / 2
            const cx = leftPad - 28
            return (
              <path
                key={`res-${ri}`}
                d={`M ${leftPad} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${leftPad} ${y2}`}
                fill="none"
                stroke="#55555f"
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
            )
          })}

          {/* Layer blocks */}
          {LAYERS.map((layer, i) => {
            const y = layerY(i)
            const isActive = activeLayer === i
            return (
              <g key={i} onClick={() => setActiveLayer(isActive ? null : i)} style={{ cursor: 'pointer' }}>
                {/* Block background */}
                <motion.rect
                  x={leftPad}
                  y={y}
                  width={blockW}
                  height={blockH}
                  rx={8}
                  fill={isActive ? layer.color + '20' : '#141416'}
                  stroke={isActive ? layer.color : '#2a2a30'}
                  strokeWidth={1}
                  whileHover={{ fill: layer.color + '15' }}
                />
                {/* Colored left edge */}
                <rect
                  x={leftPad}
                  y={y}
                  width={4}
                  height={blockH}
                  rx={2}
                  fill={layer.color}
                />
                {/* Label */}
                <text
                  x={leftPad + 16}
                  y={y + blockH / 2 + 1}
                  dominantBaseline="middle"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize={12}
                  fontWeight={600}
                  fill={isActive ? layer.color : '#e8e8ed'}
                >
                  {layer.name}
                </text>

                {/* Down arrow between blocks */}
                {i < LAYERS.length - 1 && (
                  <line
                    x1={arrowX}
                    y1={y + blockH}
                    x2={arrowX}
                    y2={y + blockH + gap}
                    stroke="#55555f"
                    strokeWidth={1}
                    markerEnd="url(#arrowhead)"
                  />
                )}
              </g>
            )
          })}

          {/* Arrow marker def */}
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="3" refY="2" orient="auto">
              <polygon points="0 0, 6 2, 0 4" fill="#55555f" />
            </marker>
          </defs>

          {/* Dashed xN bracket on right side */}
          {(() => {
            const bracketX = leftPad + blockW + 16
            const y1 = layerY(0) + blockH / 2
            const y2 = layerY(LAYERS.length - 1) + blockH / 2
            const midY = (y1 + y2) / 2
            return (
              <g>
                <line x1={bracketX} y1={y1} x2={bracketX} y2={y2} stroke="#55555f" strokeWidth={1.5} strokeDasharray="4 3" />
                <line x1={bracketX - 5} y1={y1} x2={bracketX + 5} y2={y1} stroke="#55555f" strokeWidth={1.5} />
                <line x1={bracketX - 5} y1={y2} x2={bracketX + 5} y2={y2} stroke="#55555f" strokeWidth={1.5} />
                <text
                  x={bracketX + 14}
                  y={midY + 1}
                  dominantBaseline="middle"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize={11}
                  fill="#8a8a96"
                >
                  {t.layersLabel}
                </text>
              </g>
            )
          })()}

          {/* Animated green data pulse */}
          <motion.circle
            cx={arrowX}
            r={5}
            fill="#f85f00"
            opacity={0.9}
            filter="url(#glow)"
            animate={{ cy: [pulseStartY, pulseEndY] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 }}
          />
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      {/* Layer description */}
      <AnimatePresence mode="wait">
        {activeLayer !== null && (
          <motion.div
            key={activeLayer}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              marginTop: 12,
              padding: '10px 14px',
              background: 'var(--bg-deep)',
              borderRadius: 8,
              border: `1px solid ${LAYERS[activeLayer].color}44`,
              fontSize: 13,
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            <strong style={{ color: LAYERS[activeLayer].color }}>{LAYERS[activeLayer].name}:</strong>{' '}
            {LAYERS[activeLayer].desc}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div style={{
        marginTop: 14,
        fontSize: 12,
        color: 'var(--text-dim)',
        fontFamily: 'var(--font-mono)',
        textAlign: 'center',
      }}>
        GPT-2: 12 blocks · GPT-3: 96 · GPT-4: ~120
      </div>
    </div>
  )
}

// ─── RNN vs Transformer animated visualization ──────────────────────────
// The RNN demo sentence lives in the language files: attention.rnnWords

function RNNvsTransformerInner() {
  const t = useT('attention')
  const RNN_WORDS = t.rnnWords
  const [phase, setPhase] = useState(0) // 0=idle, 1=rnn scanning, 2=rnn done, 3=transformer
  const [cursor, setCursor] = useState(-1)
  const timers = useRef([])

  const clearTimers = () => {
    timers.current.forEach(t => clearTimeout(t))
    timers.current = []
  }

  useEffect(() => {
    clearTimers()
    // Phase 0: wait, then start RNN scan
    const t0 = setTimeout(() => {
      setPhase(1)
      setCursor(0)
    }, 600)
    timers.current.push(t0)

    return clearTimers
  }, [])

  // RNN scanning animation
  useEffect(() => {
    if (phase !== 1) return
    if (cursor < 0) return
    if (cursor >= RNN_WORDS.length) {
      // Scan done
      setPhase(2)
      const t = setTimeout(() => setPhase(3), 1200)
      timers.current.push(t)
      return
    }
    const t = setTimeout(() => setCursor(c => c + 1), 250)
    timers.current.push(t)
    return () => clearTimeout(t)
  }, [phase, cursor])

  // Transformer arc connections
  const transformerArcs = [
    { from: 7, to: 1, weight: 3, label: '' },   // it -> cat (thick)
    { from: 9, to: 5, weight: 2, label: '' },   // soft -> mat (medium)
    { from: 7, to: 5, weight: 1, label: '' },   // it -> mat (light)
    { from: 9, to: 1, weight: 1, label: '' },   // soft -> cat (light)
    { from: 6, to: 9, weight: 1, label: '' },   // because -> soft (light)
  ]

  const wordSpacing = 56
  const svgWidth = RNN_WORDS.length * wordSpacing + 20
  const startX = 28

  return (
    <div style={{
      padding: '16px',
      background: 'var(--bg-deep)',
      borderRadius: 10,
      border: '1px solid var(--border)',
    }}>
      {/* RNN panel */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginBottom: 10 }}>
          {t.rnn.before}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', minHeight: 36 }}>
          {RNN_WORDS.map((w, i) => {
            const scanned = phase >= 1 && i < cursor
            const isCursor = phase === 1 && i === cursor
            const fadeFactor = scanned ? Math.max(0.15, 1 - (cursor - i) * 0.12) : 1
            const done = phase >= 2

            return (
              <motion.span
                key={i}
                animate={{
                  opacity: done ? Math.max(0.12, 1 - i * 0.1) : (scanned ? fadeFactor : (isCursor ? 1 : 0.5)),
                  scale: isCursor ? 1.12 : 1,
                  color: isCursor ? '#e8e8ed' : (scanned ? '#8a8a96' : '#55555f'),
                }}
                transition={{ duration: 0.2 }}
                style={{
                  padding: '4px 6px',
                  borderRadius: 4,
                  fontSize: 13,
                  fontFamily: 'var(--font-mono)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                {w}
                {i < RNN_WORDS.length - 1 && (
                  <span style={{ color: 'var(--text-dim)', fontSize: 11 }}>→</span>
                )}
              </motion.span>
            )
          })}
        </div>
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: 12, color: '#e87a96', fontFamily: 'var(--font-mono)', marginTop: 8 }}
            >
              {t.rnn.forgot}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />

      {/* Transformer panel */}
      <div>
        <div style={{ fontSize: 13, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginBottom: 10 }}>
          {t.rnn.after}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${svgWidth} 110`} style={{ width: '100%', maxWidth: svgWidth, display: 'block' }}>
            {/* Arcs */}
            <AnimatePresence>
              {phase >= 3 && transformerArcs.map((arc, ai) => {
                const x1 = startX + arc.from * wordSpacing
                const x2 = startX + arc.to * wordSpacing
                const midX = (x1 + x2) / 2
                const dist = Math.abs(x2 - x1)
                const arcH = Math.min(dist * 0.4, 50)
                const cy = 80 - 10 - arcH
                const d = `M ${x1} ${68} Q ${midX} ${cy} ${x2} ${68}`
                const sw = arc.weight === 3 ? 3 : arc.weight === 2 ? 2 : 1
                const op = arc.weight === 3 ? 0.9 : arc.weight === 2 ? 0.65 : 0.35

                return (
                  <motion.path
                    key={`tarc-${ai}`}
                    d={d}
                    fill="none"
                    stroke="#f85f00"
                    strokeWidth={sw}
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: op }}
                    exit={{ pathLength: 0, opacity: 0 }}
                    transition={{ duration: 0.6, delay: ai * 0.1, ease: 'easeOut' }}
                  />
                )
              })}
            </AnimatePresence>

            {/* Words */}
            {RNN_WORDS.map((w, i) => (
              <motion.text
                key={`tw-${i}`}
                x={startX + i * wordSpacing}
                y={85}
                textAnchor="middle"
                fontFamily="IBM Plex Mono, monospace"
                fontSize={12}
                fontWeight={phase >= 3 ? 600 : 400}
                animate={{
                  fill: phase >= 3 ? '#f85f00' : '#55555f',
                }}
                transition={{ duration: 0.4, delay: phase >= 3 ? i * 0.04 : 0 }}
              >
                {w}
              </motion.text>
            ))}
          </svg>
        </div>
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ fontSize: 12, color: '#f85f00', fontFamily: 'var(--font-mono)', marginTop: 4 }}
            >
              {t.rnn.every}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function RNNvsTransformerViz() {
  const t = useT('attention')
  const [key, setKey] = useState(0)
  return (
    <div>
      <RNNvsTransformerInner key={key} />
      <button
        onClick={() => setKey(k => k + 1)}
        style={{
          marginTop: 10,
          padding: '4px 12px',
          borderRadius: 6,
          background: 'transparent',
          border: '1px solid var(--border)',
          color: 'var(--text-dim)',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          cursor: 'pointer',
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
      >
        {t.rnn.replay}
      </button>
    </div>
  )
}


// ─── Nudge definitions ─────────────────────────────────────────────────
// Nudges live in the language files: attention.nudges

// ─── Main page ─────────────────────────────────────────────────────────
export default function AttentionPage() {
  const t = useT('attention')
  const NUDGE_ITEMS = t.nudges
  const [activeNudge, setActiveNudge] = useState(null)
  const [exploredNudges, setExploredNudges] = useState(() => new Set())

  const handleNudge = useCallback((key) => {
    const wasActive = activeNudge === key
    setActiveNudge(wasActive ? null : key)

    if (!exploredNudges.has(key)) {
      setExploredNudges(prev => {
        const next = new Set(prev)
        next.add(key)
        if (next.size === NUDGE_ITEMS.length && prev.size < NUDGE_ITEMS.length) {
          markLessonComplete('lesson-complete-attention')
          setTimeout(() => {
            confetti({
              particleCount: 60,
              spread: 55,
              origin: { y: 0.7 },
              colors: ['#f85f00', '#e8e8ed', '#8a8a96'],
            })
          }, 200)
        }
        return next
      })
    }
  }, [activeNudge, exploredNudges])

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px' }}>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', padding: '48px 0 40px' }}
      >
        <h1 style={{
          fontSize: 'clamp(28px, 6vw, 44px)',
          fontWeight: 700,
          lineHeight: 1.15,
          marginBottom: 16,
          letterSpacing: -0.5,
        }}>
          {t.titleStart}{' '}
          <span style={{ color: 'var(--brand)' }}>{t.titleAccent}</span>
        </h1>
        <p style={{
          fontSize: 17,
          color: 'var(--text-secondary)',
          fontWeight: 400,
          maxWidth: 420,
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          {t.subtitle}
        </p>
      </motion.div>

      {/* Section 1: The Problem */}
      <SectionCard
        {...t.cards[0]}
      >
        <RNNvsTransformerViz />
      </SectionCard>

      {/* Section 2: Interactive attention heatmap */}
      <SectionCard
        {...t.cards[1]}
      >
        <AttentionHeatmap />
      </SectionCard>

      {/* Section 3: Multi-head attention */}
      <SectionCard
        {...t.cards[2]}
      >
        <MultiHeadViz />
      </SectionCard>

      {/* Section 4: Transformer stack */}
      <SectionCard
        {...t.cards[3]}
      >
        <TransformerStack />
      </SectionCard>

      {/* Paper link */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: 28 }}
      >
        <a
          href="https://arxiv.org/abs/1706.03762"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 8,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            textDecoration: 'none',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--brand)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <span style={{ fontSize: 12 }}>📄</span>
          <span style={{
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
          }}>
            "Attention Is All You Need" (Vaswani et al., 2017)
          </span>
        </a>
      </motion.div>

      {/* Nudges */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: 24 }}
      >
        <div style={{
          fontSize: 13,
          color: 'var(--text-dim)',
          fontFamily: 'var(--font-mono)',
          marginBottom: 12,
        }}>
          {t.explore(exploredNudges.size, NUDGE_ITEMS.length)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {NUDGE_ITEMS.map(item => (
            <Nudge
              key={item.key}
              icon={item.icon}
              explored={exploredNudges.has(item.key)}
              active={activeNudge === item.key}
              onClick={() => handleNudge(item.key)}
              insightContent={item.insight}
            >
              {item.label}
            </Nudge>
          ))}
        </div>
      </motion.div>

      {/* DepthPanel */}
      <DepthPanel
        visible={true}
        delay={0.5}
        sections={t.depthSections}
      />

      {/* CTA to Run */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        style={{ padding: '32px 0 16px', textAlign: 'center' }}
      >
        <p style={{
          fontSize: 15,
          color: 'var(--text-secondary)',
          marginBottom: 20,
          lineHeight: 1.6,
        }}>
          {t.bridge}
        </p>
        <Link
          to="/run"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '14px 28px',
            background: 'var(--brand)',
            color: '#0a0a0b',
            fontSize: 15,
            fontWeight: 600,
            fontFamily: 'var(--font-body)',
            borderRadius: 999,
            textDecoration: 'none',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 0 20px rgba(248, 95, 0, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 30px rgba(248, 95, 0, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(248, 95, 0, 0.3)'
          }}
        >
          {t.ctaNext}
          <span style={{ fontSize: 18 }}>→</span>
        </Link>
      </motion.div>

      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, var(--border), transparent)',
        margin: '24px 0 40px',
      }} />

      <DeeperDive path="/attention" />

      <FunnelCTA path="/attention" />

      <Footer />
    </div>
  )
}
