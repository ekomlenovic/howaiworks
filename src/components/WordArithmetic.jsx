import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Nudge from './Nudge'
import confetti from 'canvas-confetti'
import { useT } from '../i18n'



export default function WordArithmetic({ embeddingData, onShowArithmetic, onAllExplored }) {
  // Experiments (labels, explanations) come from the language files: embeddings.experiments
  const t = useT('embeddings').arithmetic
  const { explored } = useT('common')
  const EXPERIMENTS = t.experiments
  const [activeExperiment, setActiveExperiment] = useState(null)
  const [exploredExperiments, setExploredExperiments] = useState(new Set())
  const [customInputs, setCustomInputs] = useState({ a: '', b: '', c: '' })
  const [customResult, setCustomResult] = useState(null)

  const handleExperiment = (key) => {
    if (activeExperiment === key) {
      setActiveExperiment(null)
      return
    }

    setActiveExperiment(key)

    // Show arithmetic on map for pre-defined experiments
    const exp = EXPERIMENTS.find(e => e.key === key)
    if (exp && !exp.isCustom && exp.arithmeticKey) {
      const arithData = embeddingData?.arithmetic?.[exp.arithmeticKey]
      if (arithData) {
        // Find word positions for the animation
        const words = embeddingData.words
        const aWord = words.find(w => w.word === exp.a)
        const bWord = words.find(w => w.word === exp.b)
        const cWord = words.find(w => w.word === exp.c)
        onShowArithmetic?.({
          a: aWord,
          b: bWord,
          c: cWord,
          result: { word: arithData.result, x: arithData.x, y: arithData.y },
        })
      }
    }

    setExploredExperiments(prev => {
      const next = new Set([...prev, key])
      if (next.size === EXPERIMENTS.length && prev.size < EXPERIMENTS.length) {
        setTimeout(() => {
          confetti({
            particleCount: 60,
            spread: 55,
            origin: { x: 0.15, y: 0.6 },
            colors: ['#f85f00', '#00b4d8', '#e0aaff', '#ffd166', '#ef476f', '#06d6a0'],
          })
          confetti({
            particleCount: 60,
            spread: 55,
            origin: { x: 0.85, y: 0.6 },
            colors: ['#f85f00', '#00b4d8', '#e0aaff', '#ffd166', '#ef476f', '#06d6a0'],
          })
          setTimeout(() => {
            confetti({
              particleCount: 100,
              spread: 100,
              origin: { x: 0.5, y: 0.4 },
              colors: ['#f85f00', '#00b4d8', '#e0aaff', '#ffd166', '#ef476f', '#06d6a0'],
            })
          }, 250)
        }, 400)
        onAllExplored?.()
      }
      return next
    })
  }

  const handleCustomSubmit = () => {
    const { a, b, c } = customInputs
    if (!a || !b || !c) return

    // Find closest match in pre-computed data using simple string matching
    const words = embeddingData?.words || []
    const findWord = (term) => words.find(w => w.word.toLowerCase() === term.toLowerCase())
    const aWord = findWord(a)
    const bWord = findWord(b)
    const cWord = findWord(c)

    if (aWord && bWord && cWord) {
      // Simple vector arithmetic in 2D (approximate)
      const rx = aWord.x - bWord.x + cWord.x
      const ry = aWord.y - bWord.y + cWord.y

      // Find nearest word to result
      let closest = null
      let minDist = Infinity
      for (const w of words) {
        if (w.word === a || w.word === b || w.word === c) continue
        const d = Math.sqrt((w.x - rx) ** 2 + (w.y - ry) ** 2)
        if (d < minDist) {
          minDist = d
          closest = w
        }
      }

      setCustomResult(closest?.word || '???')
      onShowArithmetic?.({
        a: aWord,
        b: bWord,
        c: cWord,
        result: closest ? { word: closest.word, x: closest.x, y: closest.y } : { word: '?', x: rx, y: ry },
      })
    } else {
      setCustomResult(t.notInMap)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: 'var(--text-dim)',
        marginBottom: 4,
      }}>
        {t.title}
      </div>

      {EXPERIMENTS.map((exp) => (
        <Nudge
          key={exp.key}
          icon={exp.icon}
          onClick={() => handleExperiment(exp.key)}
          explored={exploredExperiments.has(exp.key)}
          active={activeExperiment === exp.key}
          insightContent={
            <>
              {/* Result display for pre-defined experiments */}
              {!exp.isCustom && activeExperiment === exp.key && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    textAlign: 'center',
                    padding: '12px 0 16px',
                    fontSize: 24,
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>{exp.a}</span>
                  <span style={{ color: 'var(--text-dim)', margin: '0 6px' }}>−</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{exp.b}</span>
                  <span style={{ color: 'var(--text-dim)', margin: '0 6px' }}>+</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{exp.c}</span>
                  <span style={{ color: 'var(--text-dim)', margin: '0 6px' }}>≈</span>
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    style={{ color: 'var(--brand)' }}
                  >
                    {exp.result}
                  </motion.span>
                </motion.div>
              )}

              {/* Custom equation form */}
              {exp.isCustom && activeExperiment === exp.key && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flexWrap: 'wrap',
                    marginBottom: 12,
                  }}>
                    <WordSelect
                      placeholder={t.pickWord}
                      gloss={t.wordGloss}
                      value={customInputs.a}
                      onChange={(v) => setCustomInputs(p => ({ ...p, a: v }))}
                    />
                    <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: 18 }}>−</span>
                    <WordSelect
                      placeholder={t.pickWord}
                      gloss={t.wordGloss}
                      value={customInputs.b}
                      onChange={(v) => setCustomInputs(p => ({ ...p, b: v }))}
                    />
                    <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: 18 }}>+</span>
                    <WordSelect
                      placeholder={t.pickWord}
                      gloss={t.wordGloss}
                      value={customInputs.c}
                      onChange={(v) => setCustomInputs(p => ({ ...p, c: v }))}
                    />
                    <button
                      onClick={handleCustomSubmit}
                      style={{
                        padding: '6px 14px',
                        background: 'var(--brand)',
                        color: '#0a0a0b',
                        border: 'none',
                        borderRadius: 6,
                        fontFamily: 'var(--font-mono)',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      =
                    </button>
                  </div>
                  {customResult && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        textAlign: 'center',
                        fontSize: 20,
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--brand)',
                        padding: '4px 0',
                      }}
                    >
                      ≈ {customResult}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Insight */}
              <strong style={{ color: 'var(--brand)', fontWeight: 600 }}>
                {exp.insight.headline}
              </strong>{' '}
              {exp.insight.body}
              {exp.insight.nextHint && (
                <div style={{
                  marginTop: 10,
                  paddingTop: 8,
                  borderTop: '1px solid rgba(248, 95, 0, 0.1)',
                  fontSize: 13,
                  color: 'var(--brand)',
                  fontWeight: 500,
                  opacity: 0.85,
                }}>
                  {exp.insight.nextHint}
                </div>
              )}
            </>
          }
        >
          {exp.label}
        </Nudge>
      ))}

      {/* Progress indicator */}
      {exploredExperiments.size > 0 && (
        <motion.div
          key={exploredExperiments.size === EXPERIMENTS.length ? 'complete' : 'progress'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: exploredExperiments.size === EXPERIMENTS.length ? 12 : 11,
            color: exploredExperiments.size === EXPERIMENTS.length ? 'var(--brand)' : 'var(--text-dim)',
            paddingLeft: 4,
            marginTop: 2,
            fontWeight: exploredExperiments.size === EXPERIMENTS.length ? 600 : 400,
          }}
        >
          {exploredExperiments.size === EXPERIMENTS.length
            ? t.allExplored
            : explored(exploredExperiments.size, EXPERIMENTS.length)
          }
        </motion.div>
      )}
    </div>
  )
}

const WORD_OPTIONS = [
  'king', 'queen', 'man', 'woman', 'doctor', 'nurse',
  'cat', 'dog', 'fish', 'bird',
  'Paris', 'France', 'Japan', 'Tokyo',
  'happy', 'sad', 'love', 'fear',
  'computer', 'pizza', 'coffee', 'ocean',
]


function WordSelect({ value, onChange, placeholder, gloss = {} }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: 150,
        padding: '6px 8px',
        background: 'var(--bg-deep)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        color: value ? 'var(--text-primary)' : 'var(--text-dim)',
        fontFamily: 'var(--font-mono)',
        fontSize: 14,
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none',
        WebkitAppearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238a8a96'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 8px center',
        paddingRight: 24,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = 'var(--brand)'
        e.target.style.boxShadow = '0 0 0 2px var(--brand-dim)'
      }}
      onBlur={(e) => {
        e.target.style.borderColor = 'var(--border)'
        e.target.style.boxShadow = 'none'
      }}
    >
      <option value="" disabled>{placeholder}</option>
      {WORD_OPTIONS.map(w => (
        <option key={w} value={w}>{gloss[w] && gloss[w] !== w ? `${w} (${gloss[w]})` : w}</option>
      ))}
    </select>
  )
}
