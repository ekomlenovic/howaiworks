import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import MeaningMap from '../components/MeaningMap'
import WordArithmetic from '../components/WordArithmetic'
import DepthPanel, { PythonCode } from '../components/DepthPanel'
import Footer from '../components/Footer'
import DeeperDive from '../components/DeeperDive'
import FunnelCTA from '../components/FunnelCTA'
import { markLessonComplete } from '../components/Navbar'
import embeddingData from '../data/embeddingMap.json'

export default function EmbeddingsPage() {
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
          L’IA ne voit pas que des nombres.{' '}
          <span style={{ color: 'var(--brand)' }}>Elle saisit le sens.</span>
        </h1>
        <p style={{
          fontSize: 17,
          color: 'var(--text-secondary)',
          fontWeight: 400,
          maxWidth: 420,
          margin: '0 auto',
          lineHeight: 1.5,
        }}>
          L’IA a rangé ces mots selon leur sens, sans que personne ne lui dise lesquels étaient liés. (Les mots sont en anglais, la langue du modèle utilisé.)
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
            placeholder="Tapez un mot (en anglais) ou cliquez sur la carte pour le mettre en valeur…"
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
            Chercher
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
        <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
          Qu’est-ce qu’un embedding ?
        </h3>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
          Un embedding (ou « plongement » en français) est une façon de transformer un mot en une liste de nombres qui capture son{' '}
          <span style={{ color: 'var(--text-primary)' }}>sens</span>. Le modèle apprend ces nombres
          pendant l’entraînement, de sorte que les mots de sens proche se retrouvent avec des nombres proches. Chaque point de la
          carte ci-dessus est un mot, placé en fonction de son embedding.
        </p>

        <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
          Qu’est-ce qu’un vecteur ?
        </h3>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Un vecteur, c’est simplement une liste de nombres : comme des coordonnées GPS, mais avec beaucoup plus de dimensions. L’embedding
          de chaque mot est un vecteur de{' '}
          <span style={{ color: 'var(--text-primary)' }}>768 nombres</span>. Impossible de se représenter 768
          dimensions : la carte ci-dessus les compresse donc en 2. Même dans cette vue simplifiée, on voit
          que les mots liés se regroupent : les animaux près des animaux, les émotions près des émotions.
        </p>
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
        sections={[
          {
            label: 'Le concept',
            color: 'var(--brand)',
            defaultOpen: true,
            content: (
              <div>
                <p style={{ marginBottom: 20 }}>
                  Le nuage de points ci-dessus projette 768 dimensions sur seulement 2 grâce à{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>l’ACP (analyse en composantes principales, ou PCA en anglais)</strong>.
                  Même dans cette vue 2D grossière, on distingue des groupes de sens : les animaux ensemble, les émotions ensemble,
                  les lieux ensemble. Dans l’espace complet à 768 dimensions, ces relations sont bien plus riches.
                </p>

                <p style={{ marginBottom: 16 }}>
                  <strong style={{ color: 'var(--brand)', fontSize: 15 }}>Pourquoi 768 nombres ?</strong>
                </p>
                <p style={{ marginBottom: 12 }}>
                  Chaque dimension capture un aspect du sens. Aucune dimension ne veut dire à elle seule « est un animal » ou
                  « est une couleur » : le sens est réparti sur l’ensemble des dimensions. C’est pour cela qu’on parle de{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>représentations distribuées.</strong>
                </p>

                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(248, 95, 0,0.06)',
                  border: '1px solid rgba(248, 95, 0,0.25)',
                  borderRadius: 8,
                  marginBottom: 20,
                }}>
                  <strong style={{ color: 'var(--brand)' }}>Similarité cosinus</strong>
                  <div style={{ marginTop: 4, fontSize: 13 }}>
                    On mesure la ressemblance entre deux embeddings avec la similarité cosinus, qui dépend de l’angle entre les deux vecteurs.
                    cos(0°) = 1,0 signifie la même direction (sens identique). cos(90°) = 0 signifie aucun rapport.
                    « cat » (chat) et « kitten » (chaton) peuvent avoir une similarité de 0,92 ; « cat » et « javascript », plutôt 0,15.
                  </div>
                </div>

                <p style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(248, 95, 0,0.06)', borderRadius: 8, borderLeft: '3px solid var(--brand)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>À retenir :</strong>{' '}
                  les embeddings font le pont entre le langage humain et le calcul de la machine. Le tokeniseur
                  convertit les mots en identifiants (leçon précédente). La couche d’embeddings convertit ces identifiants en vecteurs
                  riches de sens. Tout ce que l’IA « comprend » vit dans cet espace géométrique.
                </p>
              </div>
            ),
          },
          {
            label: 'Le code',
            color: '#6ec0e8',
            content: (
              <PythonCode code={`import ollama

# Obtenir des embeddings avec nomic-embed-text (768 dimensions)
response = ollama.embed(
    model="nomic-embed-text",
    input=["cat", "kitten", "javascript"]
)

cat_vec = response["embeddings"][0]      # 768 nombres
kitten_vec = response["embeddings"][1]
js_vec = response["embeddings"][2]

print(f"Dimensions : {len(cat_vec)}")  # 768

# ── Similarité cosinus ────────────────────────────
import numpy as np

def cosine_sim(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

print(f"cat ↔ kitten:     {cosine_sim(cat_vec, kitten_vec):.3f}")  # ~0.92
print(f"cat ↔ javascript: {cosine_sim(cat_vec, js_vec):.3f}")      # ~0.15

# ── Arithmétique des mots ─────────────────────────
king = ollama.embed(model="nomic-embed-text", input=["king"])["embeddings"][0]
man  = ollama.embed(model="nomic-embed-text", input=["man"])["embeddings"][0]
woman = ollama.embed(model="nomic-embed-text", input=["woman"])["embeddings"][0]

result = np.array(king) - np.array(man) + np.array(woman)
# Chercher le mot le plus proche → "queen" (reine)`} />
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
                  Pourquoi « doctor » (médecin) pourrait-il être plus proche de « man » (homme) que de « woman » (femme) dans certains espaces d’embeddings ?
                  Qu’est-ce que cela nous apprend sur les données d’entraînement ?
                </p>
                <p style={{ marginBottom: 8, paddingLeft: 16 }}>
                  <strong style={{ color: '#e8d06e' }}>1.</strong> Cliquez sur « doctor » et « nurse » (infirmière) sur la carte ci-dessus.
                  Regardez leurs plus proches voisins. Remarquez-vous un schéma lié au genre ?
                </p>
                <p style={{ marginBottom: 8, paddingLeft: 16 }}>
                  <strong style={{ color: '#e8d06e' }}>2.</strong> Si les embeddings apprennent à partir de textes, et que ces
                  textes contiennent des biais (par exemple « le médecin… il » contre « l’infirmière… elle »), où finissent ces biais ?
                </p>
                <p style={{ paddingLeft: 16 }}>
                  <strong style={{ color: '#e8d06e' }}>3.</strong> Comment pourrait-on corriger les biais des embeddings ? Peut-on supprimer
                  la « direction du genre » sans perdre d’autres informations utiles ?
                </p>
              </div>
            ),
          },
          {
            label: 'Dans la vraie vie',
            color: '#e87a96',
            content: (
              <div>
                <p style={{ marginBottom: 14 }}>
                  Les embeddings font tourner la plupart des fonctionnalités d’IA que vous utilisez au quotidien, souvent sans que vous le voyiez.
                </p>
                <div style={{ display: 'grid', gap: 10 }}>
                  <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #6ec0e8' }}>
                    <strong style={{ color: '#6ec0e8' }}>Moteurs de recherche</strong>
                    <div style={{ marginTop: 4, fontSize: 13 }}>
                      Google transforme votre requête en embedding et la compare aux embeddings des documents. Chercher « réparer un pneu à plat »
                      trouve des pages sur « changer une roue crevée » : des mots différents, mais le même voisinage dans l’espace du sens.
                    </div>
                  </div>
                  <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #e8d06e' }}>
                    <strong style={{ color: '#e8d06e' }}>RAG (génération augmentée par récupération)</strong>
                    <div style={{ marginTop: 4, fontSize: 13 }}>
                      Quand ChatGPT cherche sur le web ou lit des documents pour vous répondre, il utilise des embeddings pour trouver
                      les passages les plus pertinents. C’est ainsi qu’une IA « connaît » les documents internes de votre entreprise.
                    </div>
                  </div>
                  <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #e87a96' }}>
                    <strong style={{ color: '#e87a96' }}>Systèmes de recommandation</strong>
                    <div style={{ marginTop: 4, fontSize: 13 }}>
                      Netflix, Spotify et YouTube placent les contenus et les utilisateurs dans le même espace. Si votre « vecteur utilisateur »
                      est proche de l’embedding d’un film, il vous plaira probablement. Mêmes maths, autre domaine.
                    </div>
                  </div>
                </div>
              </div>
            ),
          },
        ]}
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
          Les mots ont un sens. Mais comment le modèle sait-il quels sens comptent
          pour chaque prédiction ? C’est là qu’intervient l’attention.
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
          Voir comment l’IA fait attention
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
