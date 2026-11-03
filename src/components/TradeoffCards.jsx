import { useState } from 'react'
import { motion } from 'framer-motion'
import Nudge from './Nudge'
import confetti from 'canvas-confetti'

const TRADEOFFS = [
  {
    key: 'latency',
    icon: '⚡',
    label: <>Latence : <Accent>le cloud réfléchit plus vite, mais il a plus de trajet à faire</Accent></>,
    insight: {
      headline: 'Temps avant le premier token ou nombre de tokens par seconde ?',
      body: <>
        Le <strong style={{ color: '#6ec0e8' }}>cloud</strong> a un TTFT (temps avant le premier token) élevé : votre message
        voyage sur internet jusqu’à un centre de données, attend son tour dans une file, puis la génération commence.
        Mais une fois lancé, ses puissants GPU A100/H100 produisent 80 à 150 tokens par seconde.
        <br /><br />
        Le <strong style={{ color: 'var(--brand)' }}>local</strong> démarre presque instantanément (pas de trajet réseau),
        mais le matériel grand public ne génère que 10 à 30 tokens par seconde. Pour une réponse courte, le local <em>paraît</em> plus rapide.
        Pour une réponse longue, le cloud prend l’avantage.
      </>,
    },
  },
  {
    key: 'privacy',
    icon: '🔒',
    label: <>Confidentialité : <Accent>l’IA locale garde vos secrets</Accent></>,
    insight: {
      headline: 'Vos données ne quittent jamais votre machine.',
      body: <>
        Quand vous utilisez une IA dans le cloud, vos messages sont envoyés à un serveur distant : ils peuvent être stockés, enregistrés dans des journaux,
        et parfois utilisés pour l’entraînement. Avec une IA locale, le modèle tourne entièrement sur votre matériel.
        <strong style={{ color: 'var(--text-primary)' }}> Rien n’est transmis. Rien n’est stocké. Rien n’est partagé.</strong>
        <br /><br />
        C’est essentiel dans la santé (secret médical), le droit (secret professionnel de l’avocat), la finance (réglementation bancaire),
        et pour toute personne attachée à la maîtrise de ses données (pensez au RGPD). De plus en plus d’hôpitaux font tourner des modèles locaux pour les données des patients,
        et des cabinets d’avocats les utilisent pour leurs documents confidentiels.
      </>,
    },
  },
  {
    key: 'cost',
    icon: '💰',
    label: <>Coût : <Accent>le cloud facture au token, le local est gratuit une fois installé</Accent></>,
    insight: {
      headline: 'Payer à l’usage ou investir au départ ?',
      body: <>
        <strong style={{ color: '#6ec0e8' }}>Tarifs du cloud</strong> (ordre de grandeur) : environ 0,03 $ pour 1 000 tokens en entrée,
        environ 0,06 $ pour 1 000 tokens en sortie. Un chatbot très sollicité, qui gère 10 000 conversations par jour, peut coûter 500 à 2 000 $ par mois.
        <br /><br />
        <strong style={{ color: 'var(--brand)' }}>Coût du local</strong> : on achète le matériel une fois, puis on l’utilise indéfiniment.
        Une carte graphique à 200 $ fait tourner de petits modèles ; une station de travail haut de gamme peut faire tourner des modèles de 70 milliards de paramètres.
        Une fois l’investissement de départ fait, chaque token est gratuit (hors électricité).
        <br /><br />
        <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>
          Le seuil de rentabilité dépend du volume d’utilisation : un usage léger favorise le cloud, un usage intensif favorise le local.
        </span>
      </>,
    },
  },
  {
    key: 'capability',
    icon: '🧠',
    label: <>Capacités : <Accent>plus le modèle est gros, meilleures sont les réponses</Accent></>,
    insight: {
      headline: '500 millions de paramètres contre plus de 8 milliards : la taille compte.',
      body: <>
        Le modèle local que vous avez vu (qwen2.5:0.5b) compte <strong style={{ color: 'var(--brand)' }}>500 millions de paramètres</strong>.
        Des modèles comme Llama 3.1 en ont <strong style={{ color: '#6ec0e8' }}>8 milliards ou plus</strong>, soit 16 fois plus.
        <br /><br />
        Plus de paramètres, c’est plus de « mémoire » pour les connaissances, un meilleur raisonnement et des textes longs plus cohérents.
        Mais il faut aussi plus de mémoire graphique. Un modèle de 70 milliards de paramètres a besoin d’environ 35 Go de VRAM (en quantification 4 bits) :
        c’est le niveau d’une A100 ou d’une carte grand public très haut de gamme.
        <br /><br />
        La tendance va vers des modèles plus petits et plus efficaces (distillation, quantification)
        qui réduisent cet écart, et le nouveau matériel permet de faire tourner des modèles toujours plus gros sur votre bureau.
      </>,
    },
  },
]

function Accent({ children }) {
  return <em style={{ color: 'var(--brand)', fontStyle: 'normal', fontWeight: 500 }}>{children}</em>
}

export default function TradeoffCards({ onAllExplored }) {
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
        Les compromis
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
            ? 'Tout exploré : vous avez une vue claire du match cloud contre local.'
            : `${exploredCards.size}/${TRADEOFFS.length} explorés`
          }
        </motion.div>
      )}
    </div>
  )
}
