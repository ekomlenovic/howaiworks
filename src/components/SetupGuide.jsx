import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useT } from '../i18n'

function IntroBlock({ accent, children }) {
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      borderLeft: `3px solid ${accent}`,
      borderRadius: 8,
      padding: '12px 16px',
      fontSize: 13,
      lineHeight: 1.7,
      color: 'var(--text-secondary)',
      marginBottom: 12,
    }}>
      {children}
    </div>
  )
}

function SetupStep({ step, accent, title, children }) {
  return (
    <div style={{
      display: 'flex',
      gap: 12,
      padding: '8px 0',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: `${accent}20`,
        color: accent,
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        fontWeight: 700,
        flexShrink: 0,
        marginTop: 1,
      }}>
        {step}
      </div>
      <div style={{ flex: 1 }}>
        {title && (
          <div style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 4,
          }}>
            {title}
          </div>
        )}
        <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

function SetupSection({ title, accent, connected, connectedLabel, children }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{
      borderTop: '1px solid var(--border)',
    }}>
      <button
        onClick={() => !connected && setOpen(prev => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          padding: '12px 0',
          background: 'none',
          border: 'none',
          cursor: connected ? 'default' : 'pointer',
          textAlign: 'left',
        }}
      >
        {connected ? (
          <span style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'rgba(248, 95, 0,0.15)',
            color: 'var(--brand)',
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
          }}>
            ✓
          </span>
        ) : (
          <span style={{
            color: accent,
            fontSize: 14,
            transition: 'transform 0.2s',
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            lineHeight: 1,
          }}>
            ▸
          </span>
        )}
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: connected ? 'var(--brand)' : accent,
        }}>
          {title}
        </span>
        {connected && (
          <span style={{
            fontSize: 11,
            color: 'var(--text-dim)',
            marginLeft: 4,
          }}>
            {connectedLabel}
          </span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && !connected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 0 16px 0' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


const localAccent = 'var(--brand)'

function LocalSteps({ intro, steps }) {
  return (
    <>
      <IntroBlock accent="#f85f00">
        {intro}
      </IntroBlock>

      {steps.map((st, i) => (
        <SetupStep key={i} step={i + 1} accent={localAccent} title={st.title}>
          {st.body}
        </SetupStep>
      ))}
    </>
  )
}

export default function SetupGuide({ localConnected, webllm, localInferenceMode }) {
  const t = useT('run').setup
  const localActive = localConnected || localInferenceMode === 'webllm'

  if (localActive) return null

  const localTitle = localActive
    ? t.titleWebllmActive
    : webllm?.status === 'loading'
      ? t.titleLoading
      : t.titleOllama

  return (
    <AnimatePresence>
      <motion.div
        key="setup-guide"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
        transition={{ duration: 0.35 }}
        style={{ marginBottom: 20 }}
      >
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          {/* Top accent line */}
          <div style={{
            height: 2,
            background: 'linear-gradient(90deg, transparent, #e8d06e, transparent)',
          }} />

          {/* Header */}
          <div style={{ padding: '14px 16px 8px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 6,
            }}>
              <span style={{ fontSize: 13 }}>⚡</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                color: '#e8d06e',
              }}>
                {t.heading}
              </span>
            </div>
            <p style={{
              fontSize: 13,
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              margin: 0,
            }}>
              {t.description}
            </p>
          </div>

          {/* Sections */}
          <div style={{ padding: '0 16px 8px' }}>
            <SetupSection
              title={localTitle}
              accent={localAccent}
              connected={localActive}
              connectedLabel={t.connected}
            >
              <LocalSteps intro={t.intro} steps={t.steps} />
            </SetupSection>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
