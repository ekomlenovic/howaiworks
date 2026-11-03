import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import Nudge from '../components/Nudge'
import Footer from '../components/Footer'
import DeeperDive from '../components/DeeperDive'
import FunnelCTA from '../components/FunnelCTA'
import { markLessonComplete } from '../components/Navbar'

// ─── Era card wrapper ───────────────────────────────────────────────────
function EraCard({ yearRange, title, explanation, children, index, paper }) {
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
          {yearRange}
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

      {paper && (
        <motion.div variants={fadeUp} style={{ marginTop: 16 }}>
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              background: 'var(--bg-deep)',
              border: '1px solid var(--border)',
              textDecoration: 'none',
              transition: 'border-color 0.2s',
              maxWidth: '100%',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--brand)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <span style={{ fontSize: 12, flexShrink: 0 }}>📄</span>
            <span style={{
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {paper.title}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-dim)', flexShrink: 0 }}>
              ({paper.year})
            </span>
          </a>
        </motion.div>
      )}
    </motion.div>
  )
}

// ─── Era 1: Animated flowchart ──────────────────────────────────────────
function FlowchartAnimation() {
  const [step, setStep] = useState(-1)

  useEffect(() => {
    const steps = [0, 1, 2, 3, 4]
    let i = 0
    const interval = setInterval(() => {
      setStep(steps[i])
      i++
      if (i >= steps.length) {
        setTimeout(() => { setStep(-1); i = 0 }, 1800)
      }
    }, 700)
    return () => clearInterval(interval)
  }, [])

  const nodeStyle = (active) => ({
    padding: '6px 12px',
    borderRadius: 8,
    border: `1.5px solid ${active ? 'var(--brand)' : 'var(--border)'}`,
    background: active ? 'var(--brand-dim)' : 'var(--bg-elevated)',
    color: active ? 'var(--brand)' : 'var(--text-secondary)',
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
    fontWeight: 500,
    textAlign: 'center',
    transition: 'all 0.35s ease',
    whiteSpace: 'nowrap',
  })

  const arrowStyle = (active) => ({
    color: active ? 'var(--brand)' : 'var(--text-dim)',
    fontSize: 14,
    transition: 'color 0.35s ease',
    textAlign: 'center',
  })

  return (
    <div style={{
      background: 'var(--bg-deep)',
      borderRadius: 10,
      padding: '20px 16px',
      border: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div style={nodeStyle(step >= 0)}>C’est rond ?</div>
        <div style={arrowStyle(step >= 1)}>↓ oui</div>
        <div style={nodeStyle(step >= 1)}>C’est orange ?</div>
        <div style={arrowStyle(step >= 2)}>↓ oui</div>
        <div style={nodeStyle(step >= 2)}>Ça s’épluche ?</div>
        <div style={arrowStyle(step >= 3)}>↓ oui</div>
        <div style={{
          ...nodeStyle(step >= 4),
          background: step >= 4 ? 'var(--brand)' : 'var(--bg-elevated)',
          color: step >= 4 ? '#0a0a0b' : 'var(--text-secondary)',
          fontWeight: step >= 4 ? 700 : 500,
        }}>
          C’est une orange !
        </div>
      </div>
    </div>
  )
}

// ─── Era 2: Animated scatter plot ───────────────────────────────────────
function ScatterPlotAnimation() {
  // 0=empty, 1=dots appear (scattered/mixed), 2=classify (move + color), 3=dividing line
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    let timeouts = []
    const run = () => {
      setPhase(0)
      timeouts.push(setTimeout(() => setPhase(1), 400))
      timeouts.push(setTimeout(() => setPhase(2), 2200))
      timeouts.push(setTimeout(() => setPhase(3), 4000))
    }
    run()
    const interval = setInterval(run, 7000)
    return () => { timeouts.forEach(clearTimeout); clearInterval(interval) }
  }, [])

  // Each dot has a random starting position and a final clustered position
  const allDots = [
    // Spam (final positions: left cluster)
    { startX: 62, startY: 18, endX: 18, endY: 25, type: 'spam' },
    { startX: 40, startY: 55, endX: 25, endY: 35, type: 'spam' },
    { startX: 78, startY: 42, endX: 15, endY: 50, type: 'spam' },
    { startX: 52, startY: 12, endX: 30, endY: 20, type: 'spam' },
    { startX: 30, startY: 65, endX: 22, endY: 45, type: 'spam' },
    { startX: 85, startY: 30, endX: 28, endY: 55, type: 'spam' },
    { startX: 48, startY: 48, endX: 12, endY: 38, type: 'spam' },
    { startX: 70, startY: 60, endX: 35, endY: 42, type: 'spam' },
    // Not-spam (final positions: right cluster)
    { startX: 20, startY: 40, endX: 65, endY: 30, type: 'ok' },
    { startX: 55, startY: 22, endX: 72, endY: 45, type: 'ok' },
    { startX: 35, startY: 58, endX: 78, endY: 25, type: 'ok' },
    { startX: 12, startY: 15, endX: 70, endY: 55, type: 'ok' },
    { startX: 75, startY: 50, endX: 82, endY: 40, type: 'ok' },
    { startX: 42, startY: 35, endX: 68, endY: 60, type: 'ok' },
    { startX: 60, startY: 68, endX: 75, endY: 18, type: 'ok' },
    { startX: 25, startY: 28, endX: 85, endY: 50, type: 'ok' },
  ]

  const neutralColor = '#8a8a96'

  return (
    <div style={{
      background: 'var(--bg-deep)',
      borderRadius: 10,
      padding: '20px 16px',
      border: '1px solid var(--border)',
    }}>
      {/* Phase label */}
      <div style={{
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--text-dim)',
        height: 16,
        transition: 'opacity 0.3s ease',
        opacity: phase >= 1 ? 1 : 0,
      }}>
        {phase === 1 && 'collecte des e-mails…'}
        {phase === 2 && 'classement…'}
        {phase >= 3 && 'régularité trouvée !'}
      </div>
      <svg viewBox="0 0 100 80" style={{ width: '100%', height: 'auto' }}>
        {allDots.map((d, i) => {
          const classified = phase >= 2
          const cx = classified ? d.endX : d.startX
          const cy = classified ? d.endY : d.startY
          const color = classified
            ? (d.type === 'spam' ? '#e05252' : 'var(--brand)')
            : neutralColor
          return (
            <circle
              key={i}
              cx={cx} cy={cy} r={3}
              fill={color}
              opacity={phase >= 1 ? 0.9 : 0}
              style={{
                transition: phase >= 1
                  ? `cx 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) ${i * 0.04}s, cy 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) ${i * 0.04}s, fill 0.5s ease ${i * 0.03}s, opacity 0.4s ease ${i * 0.04}s`
                  : 'opacity 0.2s ease',
              }}
            />
          )
        })}
        {/* Dividing line */}
        <line
          x1={48} y1={5} x2={48} y2={75}
          stroke="var(--brand)"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          opacity={phase >= 3 ? 0.8 : 0}
          style={{ transition: 'opacity 0.6s ease' }}
        />
        {/* Labels */}
        <text x={20} y={75} fill="#e05252" fontSize={7} textAnchor="middle"
          opacity={phase >= 3 ? 0.7 : 0} style={{ transition: 'opacity 0.4s ease 0.3s', fontFamily: 'var(--font-mono)' }}>
          spam
        </text>
        <text x={75} y={75} fill="var(--brand)" fontSize={7} textAnchor="middle"
          opacity={phase >= 3 ? 0.7 : 0} style={{ transition: 'opacity 0.4s ease 0.3s', fontFamily: 'var(--font-mono)' }}>
          pas du spam
        </text>
      </svg>
    </div>
  )
}

// ─── Era 3: Animated neural net layers ──────────────────────────────────
function NeuralNetAnimation() {
  const [activeLayer, setActiveLayer] = useState(-1)

  useEffect(() => {
    let layer = 0
    const interval = setInterval(() => {
      setActiveLayer(layer)
      layer++
      if (layer > 4) {
        setTimeout(() => { setActiveLayer(-1); layer = 0 }, 1200)
      }
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const layers = [
    { nodes: 4, label: 'entrée' },
    { nodes: 5, label: '' },
    { nodes: 5, label: '' },
    { nodes: 3, label: '' },
    { nodes: 2, label: 'sortie' },
  ]

  const layerX = (i) => 15 + i * 18
  const nodeY = (layerIdx, nodeIdx) => {
    const count = layers[layerIdx].nodes
    const spacing = 60 / (count + 1)
    return 10 + spacing * (nodeIdx + 1)
  }

  return (
    <div style={{
      background: 'var(--bg-deep)',
      borderRadius: 10,
      padding: '20px 16px',
      border: '1px solid var(--border)',
    }}>
      <svg viewBox="0 0 100 80" style={{ width: '100%', height: 'auto' }}>
        {/* Connections */}
        {layers.map((layer, li) => {
          if (li === 0) return null
          const prevLayer = layers[li - 1]
          return prevLayer.nodes > 0 && Array.from({ length: prevLayer.nodes }).map((_, pi) =>
            Array.from({ length: layer.nodes }).map((_, ni) => (
              <line
                key={`c${li}-${pi}-${ni}`}
                x1={layerX(li - 1)} y1={nodeY(li - 1, pi)}
                x2={layerX(li)} y2={nodeY(li, ni)}
                stroke={activeLayer >= li ? 'var(--brand)' : 'var(--border)'}
                strokeWidth={0.5}
                opacity={activeLayer >= li ? 0.4 : 0.2}
                style={{ transition: 'all 0.3s ease' }}
              />
            ))
          )
        })}
        {/* Nodes */}
        {layers.map((layer, li) =>
          Array.from({ length: layer.nodes }).map((_, ni) => (
            <circle
              key={`n${li}-${ni}`}
              cx={layerX(li)} cy={nodeY(li, ni)}
              r={3}
              fill={activeLayer >= li ? 'var(--brand)' : 'var(--bg-elevated)'}
              stroke={activeLayer >= li ? 'var(--brand)' : 'var(--border)'}
              strokeWidth={1}
              style={{ transition: 'all 0.3s ease' }}
            />
          ))
        )}
        {/* Labels */}
        <text x={layerX(0)} y={78} fill="var(--text-dim)" fontSize={5.5} textAnchor="middle"
          style={{ fontFamily: 'var(--font-mono)' }}>entrée</text>
        <text x={layerX(4)} y={78} fill="var(--text-dim)" fontSize={5.5} textAnchor="middle"
          style={{ fontFamily: 'var(--font-mono)' }}>sortie</text>
      </svg>
    </div>
  )
}

// ─── Era 4: Next-word prediction ────────────────────────────────────────
function NextWordAnimation() {
  const [wordIndex, setWordIndex] = useState(-1)
  const words = ['Le', 'chat', 'dort', 'sur', 'le']
  const prediction = 'canapé'

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setWordIndex(i)
      i++
      if (i > words.length + 1) {
        setTimeout(() => { setWordIndex(-1); i = 0 }, 2400)
      }
    }, 450)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      background: 'var(--bg-deep)',
      borderRadius: 10,
      padding: '24px 16px',
      border: '1px solid var(--border)',
      textAlign: 'center',
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
        alignItems: 'baseline',
        fontFamily: 'var(--font-mono)',
        fontSize: 'clamp(14px, 3.5vw, 18px)',
        minHeight: 60,
      }}>
        {words.map((word, i) => (
          <span
            key={i}
            style={{
              color: wordIndex >= i ? 'var(--text-primary)' : 'transparent',
              transition: 'color 0.3s ease',
            }}
          >
            {word}
          </span>
        ))}
        {/* The blank / prediction */}
        <span style={{ position: 'relative', display: 'inline-block', minWidth: 40 }}>
          {wordIndex > words.length - 1 ? (
            <span style={{
              color: 'var(--brand)',
              fontWeight: 700,
              transition: 'color 0.3s ease',
            }}>
              {prediction}
            </span>
          ) : (
            <span style={{
              color: wordIndex >= words.length - 1 ? 'var(--text-dim)' : 'transparent',
              transition: 'color 0.3s ease',
              borderBottom: wordIndex >= words.length - 1 ? '2px dashed var(--text-dim)' : '2px dashed transparent',
            }}>
              ___
            </span>
          )}
        </span>
      </div>
      {/* Probability label */}
      <div style={{
        marginTop: 12,
        opacity: wordIndex > words.length - 1 ? 1 : 0,
        transition: 'opacity 0.4s ease',
        display: 'flex',
        justifyContent: 'center',
        gap: 6,
      }}>
        <span style={{
          display: 'inline-block',
          padding: '2px 8px',
          borderRadius: 4,
          background: 'var(--brand-dim)',
          color: 'var(--brand)',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          fontWeight: 600,
        }}>
          probabilité de 85 %
        </span>
      </div>
    </div>
  )
}

// ─── Main page ──────────────────────────────────────────────────────────
const NUDGE_ITEMS = [
  {
    key: 'images',
    icon: '🖼',
    label: 'Et pour les images ?',
    insight: 'Même idée, autres données. L’IA voit une image comme une grille de nombres : la luminosité et la couleur de chaque pixel. Elle y repère des régularités de la même façon que dans un texte. Contours → formes → objets → scènes. Des nombres en entrée, des régularités en sortie.',
  },
  {
    key: 'thinking',
    icon: '🧠',
    label: 'L’IA pense-t-elle vraiment ?',
    insight: "C’est la question de la « chambre chinoise ». Imaginez une personne enfermée dans une pièce, qui ne parle pas chinois mais dispose d’un énorme manuel de règles. On lui glisse des caractères chinois sous la porte ; elle cherche la bonne réponse dans le manuel et la renvoie. Vu de l’extérieur, on croirait qu’elle parle chinois. L’IA, c’est un peu pareil : elle associe des régularités de façon brillante, mais savoir si cela compte comme de la « compréhension » fait toujours débat.",
  },
  {
    key: 'learning',
    icon: '🔄',
    label: 'Comment apprend-elle ?',
    insight: 'La boucle d’entraînement : lire une phrase → prédire le mot suivant → vérifier si c’était juste → ajuster légèrement ses poids → recommencer. Répétez cela des milliards de fois sur des téraoctets de texte, et le modèle apprend peu à peu la grammaire, des connaissances, des façons de raisonner, et bien plus. Chaque petit ajustement le rend un tout petit peu meilleur.',
  },
]

export default function WhatIsAIPage() {
  const [activeNudge, setActiveNudge] = useState(null)
  const [exploredNudges, setExploredNudges] = useState(() => new Set())

  const handleNudge = (key) => {
    const wasActive = activeNudge === key
    setActiveNudge(wasActive ? null : key)

    if (!exploredNudges.has(key)) {
      setExploredNudges(prev => {
        const next = new Set(prev)
        next.add(key)

        if (next.size === NUDGE_ITEMS.length && prev.size < NUDGE_ITEMS.length) {
          markLessonComplete('lesson-complete-what-is-ai')
          setTimeout(() => {
            confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 }, colors: ['#f85f00', '#e8e8ed', '#8a8a96'] })
          }, 200)
          setTimeout(() => {
            confetti({ particleCount: 40, spread: 65, origin: { y: 0.65, x: 0.6 }, colors: ['#f85f00', '#e8e8ed'] })
          }, 500)
        }
        return next
      })
    }
  }

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
          fontSize: 'clamp(24px, 5vw, 38px)',
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: 12,
          letterSpacing: -0.5,
        }}>
          C’est quoi{' '}
          <span style={{ color: 'var(--brand)' }}>l’IA ?</span>
        </h1>
        <p style={{
          fontSize: 17,
          color: 'var(--text-secondary)',
          fontWeight: 400,
          maxWidth: 440,
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          Des règles écrites à la main aux machines qui écrivent des poèmes.
          <br />
          Quatre ères en quatre minutes.
        </p>
      </motion.div>

      {/* Era 1: Rules */}
      <EraCard
        index={0}
        yearRange="Années 1950 – 1980"
        title="Les humains écrivaient les règles"
        explanation="Les premières IA n’étaient que de la logique « si… alors… ». Les programmeurs disaient à l’ordinateur exactement quoi faire dans chaque situation."
        paper={{ title: 'Computing Machinery and Intelligence', year: 1950, url: 'https://doi.org/10.1093/mind/LIX.236.433' }}
      >
        <FlowchartAnimation />
      </EraCard>

      {/* Era 2: Learning from Data */}
      <EraCard
        index={1}
        yearRange="Années 1990 – 2000"
        title="Les machines trouvaient les régularités"
        explanation="Au lieu d’écrire des règles, on a donné aux ordinateurs des milliers d’exemples en les laissant trouver eux-mêmes les régularités."
        paper={{ title: 'A Training Algorithm for Optimal Margin Classifiers', year: 1992, url: 'https://doi.org/10.1145/130385.130401' }}
      >
        <ScatterPlotAnimation />
      </EraCard>

      {/* Era 3: Deep Learning */}
      <EraCard
        index={2}
        yearRange="Années 2010"
        title="Des couches de compréhension"
        explanation="On empile de nombreux détecteurs de régularités en couches. La première couche voit des contours, la suivante des formes, la suivante des visages. C’est ainsi que l’IA a appris à voir, entendre et parler."
        paper={{ title: 'ImageNet Classification with Deep Convolutional Neural Networks', year: 2012, url: 'https://doi.org/10.1145/3065386' }}
      >
        <NeuralNetAnimation />
      </EraCard>

      {/* Era 4: Language Models */}
      <EraCard
        index={3}
        yearRange="Années 2020"
        title="Prédire le mot suivant"
        explanation="On l’entraîne sur des milliards de phrases venues d’internet, pour apprendre quel mot vient ensuite, encore et encore. C’est ça, ChatGPT : la meilleure saisie semi-automatique du monde."
        paper={{ title: 'Attention Is All You Need', year: 2017, url: 'https://doi.org/10.48550/arXiv.1706.03762' }}
      >
        <NextWordAnimation />
      </EraCard>

      {/* Bridge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: 'center',
          padding: '32px 20px',
          margin: '12px 0 24px',
          borderRadius: 14,
          border: '1px solid var(--border)',
          background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-deep) 100%)',
        }}
      >
        <p style={{
          fontSize: 15,
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          maxWidth: 460,
          margin: '0 auto 24px',
        }}>
          L’IA d’aujourd’hui lit le texte sous forme de nombres, y repère des régularités et prédit la suite.
          Mais avant tout cela, elle doit <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>découper vos mots en morceaux</span> qu’elle sait traiter.
        </p>
        <Link
          to="/tokenize"
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
          Voir comment l’IA lit un texte
          <span style={{ fontSize: 18 }}>→</span>
        </Link>
      </motion.div>

      {/* Nudges — deeper exploration */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4 }}
        style={{ marginTop: 8 }}
      >
        <p style={{
          fontSize: 13,
          color: 'var(--text-dim)',
          fontFamily: 'var(--font-mono)',
          marginBottom: 12,
          textAlign: 'center',
        }}>
          Creusez un peu : explorez les trois pour terminer cette leçon
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {NUDGE_ITEMS.map((item) => (
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

      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, var(--border), transparent)',
        margin: '40px 0',
      }} />

      <DeeperDive path="/what-is-ai" />

      <FunnelCTA path="/what-is-ai" />

      <Footer />
    </div>
  )
}
