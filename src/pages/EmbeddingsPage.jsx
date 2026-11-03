import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import MeaningMap from '../components/MeaningMap'
import WordArithmetic from '../components/WordArithmetic'
import DepthPanel from '../components/DepthPanel'
import { useT } from '../i18n'
import Footer from '../components/Footer'
import DeeperDive from '../components/DeeperDive'
import FunnelCTA from '../components/FunnelCTA'
import { markLessonComplete } from '../components/Navbar'
import embeddingData from '../data/embeddingMap.json'

export default function EmbeddingsPage() {
  const t = useT('embeddings')
  const [selectedWord, setSelectedWord] = useState(null)
  const [neighborLines, setNeighborLines] = useState([])
  const [liveWord, setLiveWord] = useState(null)
  const [wordInput, setWordInput] = useState('')
  const [ollamaAvailable, setOllamaAvailable] = useState(false)
  const [allExperimentsExplored, setAllExperimentsExplored] = useState(false)
  const [arithmeticDisplay, setArithmeticDisplay] = useState(null)
  const [mapPhase, setMapPhase] = useState('scrambled')
  const [isAutoTyping, setIsAutoTyping] = useState(true)
  const [autoTypeIndex, setAutoTypeIndex] = useState(0)
  const [demoPhraseIdx, setDemoPhraseIdx] = useState(0)
  const inputRef = useRef(null)

  const demoPhrases = ['python', 'butterfly', 'fear', 'ocean', 'queen', 'GPU', 'chocolate', 'Tokyo', 'pride', 'algorithm']

  // Auto-type demo words and highlight them on the map
  useEffect(() => {
    if (!isAutoTyping) return

    const currentPhrase = demoPhrases[demoPhraseIdx]
    if (autoTypeIndex < currentPhrase.length) {
      const timer = setTimeout(() => {
        const newText = currentPhrase.slice(0, autoTypeIndex + 1)
        setWordInput(newText)
        setAutoTypeIndex(autoTypeIndex + 1)
      }, 70)
      return () => clearTimeout(timer)
    } else {
      // Finished typing — highlight the word on the map, then pause before next
      const match = embeddingData.words.find(w => w.word.toLowerCase() === currentPhrase.toLowerCase())
      if (match && selectedWord !== match.word) {
        handleWordClick(match.word)
      }
      const timer = setTimeout(() => {
        setAutoTypeIndex(0)
        setDemoPhraseIdx((demoPhraseIdx + 1) % demoPhrases.length)
        setWordInput('')
        setSelectedWord(null)
        setNeighborLines([])
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [isAutoTyping, autoTypeIndex, demoPhraseIdx])

  // Check Ollama availability
  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(data => setOllamaAvailable(data.ollama === true))
      .catch(() => setOllamaAvailable(false))
  }, [])

  // Handle clicking a word on the map — show 3 nearest neighbors
  const handleWordClick = useCallback((word) => {
    if (selectedWord === word) {
      setSelectedWord(null)
      setNeighborLines([])
      return
    }

    setSelectedWord(word)
    const target = embeddingData.words.find(w => w.word === word)
    if (!target) return

    // Find 3 nearest neighbors
    const distances = embeddingData.words
      .filter(w => w.word !== word)
      .map(w => ({
        word: w.word,
        dist: Math.sqrt((w.x - target.x) ** 2 + (w.y - target.y) ** 2),
        x: w.x,
        y: w.y,
      }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 3)

    setNeighborLines(distances.map(d => ({
      x1: target.x,
      y1: target.y,
      x2: d.x,
      y2: d.y,
      target: d.word,
    })))
  }, [selectedWord])

  // Handle word arithmetic visualization
  const handleShowArithmetic = useCallback((data) => {
    setArithmeticDisplay(data)
    setSelectedWord(null)

    // Show lines from operands to result
    if (data.result && data.a && data.c) {
      setNeighborLines([
        { x1: data.a.x, y1: data.a.y, x2: data.result.x, y2: data.result.y, target: data.result.word },
        { x1: data.c.x, y1: data.c.y, x2: data.result.x, y2: data.result.y, target: data.result.word },
      ])
      setLiveWord({ word: data.result.word, x: data.result.x, y: data.result.y })

      // Clear after viewing
      setTimeout(() => {
        setLiveWord(null)
      }, 5000)
    }
  }, [])

  // Handle live word embedding (when Ollama available)
  const handleEmbedWord = useCallback(async () => {
    if (!wordInput.trim()) return
    if (!ollamaAvailable) return

    try {
      const res = await fetch('/api/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: [wordInput.trim()] }),
      })
      const data = await res.json()
      if (data.embeddings?.length > 0 && embeddingData.pca.mean.length > 0) {
        const embedding = data.embeddings[0]
        const mean = embeddingData.pca.mean
        const pc1 = embeddingData.pca.pc1
        const pc2 = embeddingData.pca.pc2

        // Project to 2D: subtract mean, dot with pc1 and pc2
        let x = 0, y = 0
        for (let i = 0; i < embedding.length && i < mean.length; i++) {
          const centered = embedding[i] - mean[i]
          x += centered * pc1[i]
          y += centered * pc2[i]
        }

        // Normalize
        x = x / (embeddingData.pca.xScale || 1)
        y = y / (embeddingData.pca.yScale || 1)

        // Clamp to [-1, 1]
        x = Math.max(-1, Math.min(1, x))
        y = Math.max(-1, Math.min(1, y))

        setLiveWord({ word: wordInput.trim(), x, y })

        // Find nearest neighbors
        const distances = embeddingData.words
          .map(w => ({
            word: w.word,
            dist: Math.sqrt((w.x - x) ** 2 + (w.y - y) ** 2),
            x: w.x,
            y: w.y,
          }))
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 3)

        setNeighborLines(distances.map(d => ({
          x1: x,
          y1: y,
          x2: d.x,
          y2: d.y,
          target: d.word,
        })))

        setWordInput('')
      }
    } catch (err) {
      console.error('Embed error:', err)
    }
  }, [wordInput, ollamaAvailable])

  // Handle finding the closest pre-computed word (fallback without Ollama)
  const handleFallbackWord = useCallback(() => {
    if (!wordInput.trim()) return

    // Check if word exists in pre-computed data
    const word = wordInput.trim().toLowerCase()
    const match = embeddingData.words.find(w => w.word.toLowerCase() === word)
    if (match) {
      handleWordClick(match.word)
      setWordInput('')
    }
  }, [wordInput, handleWordClick])

  const handleInputSubmit = (e) => {
    e.preventDefault()
    if (isAutoTyping) {
      setIsAutoTyping(false)
    }
    if (ollamaAvailable) {
      handleEmbedWord()
    } else {
      handleFallbackWord()
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px' }}>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', padding: '48px 0 32px' }}
      >
        <h1 style={{
          fontSize: 'clamp(24px, 5vw, 38px)',
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: 12,
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
          lineHeight: 1.5,
        }}>
          {t.subtitle}
        </p>
      </motion.div>

      {/* Meaning Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <MeaningMap
          words={embeddingData.words}
          onWordClick={handleWordClick}
          selectedWord={selectedWord}
          neighborLines={neighborLines}
          liveWord={liveWord}
          onPhaseChange={setMapPhase}
        />
      </motion.div>

      {/* Word input bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{ marginTop: 16, marginBottom: 8 }}
      >
        <form onSubmit={handleInputSubmit} style={{ display: 'flex', gap: 8 }}>
          <input
            ref={inputRef}
            type="text"
            value={wordInput}
            onChange={(e) => {
              if (isAutoTyping) {
                setIsAutoTyping(false)
                setSelectedWord(null)
                setNeighborLines([])
              }
              setWordInput(e.target.value)
            }}
            placeholder={t.placeholder}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 15,
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={(e) => {
              if (isAutoTyping) {
                setIsAutoTyping(false)
                setWordInput('')
                setSelectedWord(null)
                setNeighborLines([])
              }
              e.target.style.borderColor = 'var(--brand)'
              e.target.style.boxShadow = '0 0 0 3px var(--brand-dim)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)'
              e.target.style.boxShadow = 'none'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '12px 20px',
              background: 'var(--brand)',
              color: '#0a0a0b',
              border: 'none',
              borderRadius: 10,
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(248, 95, 0, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {t.search}
          </button>
        </form>
      </motion.div>

      {/* What is an embedding / vector explainer card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 24,
          marginTop: 12,
          marginBottom: 8,
        }}
      >
        {t.explainer}
      </motion.div>

      {/* Spacer */}
      <div style={{ height: 32 }} />

      {/* Word Arithmetic Nudges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        <WordArithmetic
          embeddingData={embeddingData}
          onShowArithmetic={handleShowArithmetic}
          onAllExplored={() => setAllExperimentsExplored(true)}
        />
      </motion.div>

      {/* DepthPanel — always visible */}
      <DepthPanel
        visible={true}
        delay={0.5}
        onOpen={() => markLessonComplete('lesson-complete-understand')}
        sections={t.depthSections}
      />

      {/* CTA to Attention */}
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
          to="/attention"
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

      <DeeperDive path="/understand" />

      <FunnelCTA path="/understand" />

      <Footer />
    </div>
  )
}
