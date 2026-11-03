import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LatencyRace from '../components/LatencyRace'
import TradeoffCards from '../components/TradeoffCards'
import DepthPanel from '../components/DepthPanel'
import SetupGuide from '../components/SetupGuide'
import Footer from '../components/Footer'
import DeeperDive from '../components/DeeperDive'
import FunnelCTA from '../components/FunnelCTA'
import { markLessonComplete } from '../components/Navbar'
import { useT } from '../i18n'

export default function CloudVsLocalPage({ webllm }) {
  const t = useT('run')
  const [ollamaConnected, setOllamaConnected] = useState(false)
  const [allTradeoffsExplored, setAllTradeoffsExplored] = useState(false)

  // Check Ollama
  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || ''
    fetch(`${apiBase}/api/health`)
      .then(r => r.json())
      .then(data => setOllamaConnected(data.ollama === true))
      .catch(() => setOllamaConnected(false))
  }, [])

  const localInferenceMode = ollamaConnected ? 'ollama' : webllm?.isReady ? 'webllm' : 'simulated'

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
          maxWidth: 440,
          margin: '0 auto',
          lineHeight: 1.5,
        }}>
          {t.subtitle}
        </p>
      </motion.div>

      {/* Setup Guide — shows when local inference is not connected */}
      <SetupGuide
        localConnected={ollamaConnected}
        webllm={webllm}
        localInferenceMode={localInferenceMode}
      />

      {/* WebLLM progress bar */}
      <AnimatePresence>
        {webllm?.status === 'loading' && (
          <WebLLMProgressBar progress={webllm.progress} />
        )}
      </AnimatePresence>

      {/* Latency Race */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <LatencyRace
          ollamaConnected={ollamaConnected}
          onRaceComplete={() => {}}
          webllm={webllm}
          localInferenceMode={localInferenceMode}
        />
      </motion.div>

      {/* Ollama Local Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        style={{ marginTop: 16 }}
      >
        <OllamaLocalCard connected={ollamaConnected} webllm={webllm} />
      </motion.div>

      {/* Trade-off Cards — always visible */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        style={{ marginTop: 32 }}
      >
        <TradeoffCards onAllExplored={() => setAllTradeoffsExplored(true)} />
      </motion.div>

      {/* DepthPanel — always visible */}
      <DepthPanel
        visible={true}
        delay={0.55}
        onOpen={() => markLessonComplete('lesson-complete-run')}
        sections={t.depthSections}
      />

      {/* Divider */}
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, var(--border), transparent)',
        margin: '40px 0',
      }} />

      <DeeperDive path="/run" />

      <FunnelCTA path="/run" />

      <Footer />

      {/* Animations */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}

function CopyableCommand({ command }) {
  const t = useT('run')
  const [copied, setCopied] = useState(false)
  const [hovered, setHovered] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }
  return (
    <div
      onClick={handleCopy}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        background: 'var(--bg-deep)',
        border: `1px solid ${hovered ? 'var(--text-dim)' : 'var(--border)'}`,
        borderRadius: 6,
        marginBottom: 6,
        cursor: 'pointer',
        transition: 'border-color 0.2s',
      }}
    >
      <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--text-secondary)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        <span style={{ color: 'var(--text-dim)' }}>$</span> {command}
      </code>
      <svg
        fill={copied ? 'var(--brand)' : hovered ? 'var(--text-secondary)' : 'var(--text-dim)'}
        width="14"
        height="14"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, marginLeft: 12, transition: 'fill 0.2s' }}
      >
        <path d="M27.2,8.22H23.78V5.42A3.42,3.42,0,0,0,20.36,2H5.42A3.42,3.42,0,0,0,2,5.42V20.36a3.43,3.43,0,0,0,3.42,3.42h2.8V27.2A2.81,2.81,0,0,0,11,30H27.2A2.81,2.81,0,0,0,30,27.2V11A2.81,2.81,0,0,0,27.2,8.22ZM5.42,21.91a1.55,1.55,0,0,1-1.55-1.55V5.42A1.54,1.54,0,0,1,5.42,3.87H20.36a1.55,1.55,0,0,1,1.55,1.55v2.8H11A2.81,2.81,0,0,0,8.22,11V21.91ZM28.13,27.2a.93.93,0,0,1-.93.93H11a.93.93,0,0,1-.93-.93V11a.93.93,0,0,1,.93-.93H27.2a.93.93,0,0,1,.93.93Z" />
      </svg>
      {copied && (
        <span style={{
          position: 'absolute',
          right: 36,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--brand)',
        }}>
          {t.card.copied}
        </span>
      )}
    </div>
  )
}

function OllamaLocalCard({ connected, webllm }) {
  const t = useT('run')

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      {/* Top accent */}
      <div style={{
        height: 2,
        background: 'linear-gradient(90deg, transparent, var(--brand), transparent)',
      }} />

      <div style={{ padding: '20px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 2,
            }}>
              {t.card.title}
            </div>
            <div style={{
              fontSize: 13,
              color: 'var(--text-secondary)',
            }}>
              {connected
                ? t.card.subtitleConnected
                : t.card.subtitle}
            </div>
          </div>
          {connected && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 10px',
              background: 'rgba(248, 95, 0,0.1)',
              border: '1px solid rgba(248, 95, 0,0.25)',
              borderRadius: 6,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--brand)',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 8 }}>●</span>
              {t.card.connected}
            </div>
          )}
        </div>

        {/* Educational IntroBlock */}
        <div style={{
          padding: '12px 16px',
          background: 'var(--bg-elevated)',
          borderLeft: '3px solid var(--brand)',
          borderRadius: '0 8px 8px 0',
          marginBottom: 16,
          fontSize: 13,
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
        }}>
          {t.card.intro}
        </div>

        {/* Quick-start commands */}
        {!connected && (
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: 'var(--text-dim)',
              marginBottom: 8,
            }}>
              {t.card.quickStart}
            </div>
            <CopyableCommand command="ollama pull qwen2.5:0.5b" />
            <CopyableCommand command="ollama run qwen2.5:0.5b" />

            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <a
                href="https://ollama.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  background: 'var(--brand)',
                  color: '#0a0a0b',
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  borderRadius: 8,
                  textDecoration: 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(248, 95, 0,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {t.card.getOllama}
                <span style={{ fontSize: 12 }}>↗</span>
              </a>
              {webllm && (
                <button
                  onClick={() => { if (!webllm.isReady && webllm.load) webllm.load() }}
                  disabled={webllm.isReady || webllm.status === 'loading'}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 20px',
                    background: 'transparent',
                    color: webllm.isReady ? 'var(--brand)' : '#6ec0e8',
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: 'var(--font-body)',
                    borderRadius: 8,
                    border: `1px solid ${webllm.isReady ? 'rgba(248, 95, 0,0.4)' : 'rgba(110,192,232,0.4)'}`,
                    cursor: webllm.isReady || webllm.status === 'loading' ? 'default' : 'pointer',
                    opacity: webllm.status === 'loading' ? 0.6 : 1,
                    transition: 'border-color 0.2s',
                  }}
                >
                  {webllm.isReady
                    ? t.card.webgpuLoaded
                    : webllm.status === 'loading'
                    ? t.card.webgpuLoading
                    : t.card.webgpuTry}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function WebLLMProgressBar({ progress }) {
  const t = useT('run')
  const pct = Math.round((progress.progress || 0) * 100)
  return (
    <motion.div
      key="webllm-progress"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      style={{ overflow: 'hidden', marginBottom: 16 }}
    >
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '12px 16px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--brand)',
            fontWeight: 600,
          }}>
            {t.progress.loading}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-dim)',
          }}>
            {pct}%
          </span>
        </div>
        <div style={{
          height: 4,
          background: 'var(--bg-elevated)',
          borderRadius: 2,
          overflow: 'hidden',
        }}>
          <motion.div
            style={{
              height: '100%',
              background: 'var(--brand)',
              borderRadius: 2,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-dim)',
          marginTop: 6,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {progress.text || t.progress.preparing}
        </div>
      </div>
    </motion.div>
  )
}
