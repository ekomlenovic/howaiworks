import { useState } from 'react'
import { motion } from 'framer-motion'
import Nudge from './Nudge'
import confetti from 'canvas-confetti'
import { useT } from '../i18n'

// The cards (labels, explanations) live in the language files: run.tradeoffs


export default function TradeoffCards({ onAllExplored }) {
  const t = useT('run').tradeoffs
  const { explored } = useT('common')
  const TRADEOFFS = t.cards
  const [activeCard, setActiveCard] = useState(null)
  const [exploredCards, setExploredCards] = useState(new Set())

  const handleCard = (key) => {
    if (activeCard === key) {
      setActiveCard(null)
      return
    }
    setActiveCard(key)
    setExploredCards(prev => {
      const next = new Set([...prev, key])
      if (next.size === TRADEOFFS.length && prev.size < TRADEOFFS.length) {
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

      {TRADEOFFS.map((card) => (
        <Nudge
          key={card.key}
          icon={card.icon}
          onClick={() => handleCard(card.key)}
          explored={exploredCards.has(card.key)}
          active={activeCard === card.key}
          insightContent={
            <>
              <strong style={{ color: 'var(--brand)', fontWeight: 600 }}>
                {card.insight.headline}
              </strong>{' '}
              {card.insight.body}
            </>
          }
        >
          {card.label}
        </Nudge>
      ))}

      {exploredCards.size > 0 && (
        <motion.div
          key={exploredCards.size === TRADEOFFS.length ? 'complete' : 'progress'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: exploredCards.size === TRADEOFFS.length ? 12 : 11,
            color: exploredCards.size === TRADEOFFS.length ? 'var(--brand)' : 'var(--text-dim)',
            paddingLeft: 4,
            marginTop: 2,
            fontWeight: exploredCards.size === TRADEOFFS.length ? 600 : 400,
          }}
        >
          {exploredCards.size === TRADEOFFS.length
            ? t.allExplored
            : explored(exploredCards.size, TRADEOFFS.length)
          }
        </motion.div>
      )}
    </div>
  )
}
