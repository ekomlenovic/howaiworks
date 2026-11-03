import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useT } from '../i18n'

// PythonCode lives in LessonBits.jsx (shared with the language files); re-exported here.
export { PythonCode } from './LessonBits'

// ── DepthPanel Component ───────────────────────────────────────────────

/**
 * DepthPanel — expandable section that adds university-level depth
 *
 * Accepts a `sections` array, each rendered as a collapsible accordion.
 * First section auto-opens. Multiple sections can be open simultaneously.
 */
export default function DepthPanel({ sections, visible, delay = 0, onOpen }) {
  const [isOpen, setIsOpen] = useState(false)
  const { depthPanelTitle } = useT('common')

  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      style={{ margin: '24px 0' }}
    >
      {/* Toggle button */}
      <button
        onClick={() => {
          const willOpen = !isOpen
          setIsOpen(willOpen)
          if (willOpen && onOpen) onOpen()
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          padding: '14px 20px',
          background: isOpen ? 'var(--bg-elevated)' : 'var(--bg-surface)',
          border: `1px solid ${isOpen ? 'rgba(248, 95, 0,0.3)' : 'var(--border)'}`,
          borderRadius: isOpen ? '12px 12px 0 0' : 12,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.3s',
          textAlign: 'left',
        }}
      >
        <span style={{ flex: 1 }}>{depthPanelTitle}</span>
        <span style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.3s',
          color: 'var(--text-dim)',
          fontSize: 18,
        }}>
          ▾
        </span>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              background: 'var(--bg-elevated)',
              border: '1px solid rgba(248, 95, 0,0.15)',
              borderTop: 'none',
              borderRadius: '0 0 12px 12px',
              padding: '16px 24px 24px',
            }}>
              {sections.map((section, i) => (
                <AccordionSection
                  key={section.label}
                  label={section.label}
                  color={section.color}
                  defaultOpen={section.defaultOpen}
                  isLast={i === sections.length - 1}
                >
                  {section.content}
                </AccordionSection>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}


function AccordionSection({ label, color, defaultOpen = false, isLast, children }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div style={{
      borderBottom: isLast ? 'none' : '1px solid var(--border)',
    }}>
      {/* Clickable header */}
      <button
        onClick={() => setOpen(prev => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          padding: '12px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{
          color: color,
          fontSize: 14,
          transition: 'transform 0.2s',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          lineHeight: 1,
        }}>
          ▸
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: color,
        }}>
          {label}
        </span>
      </button>

      {/* Collapsible content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0 0 20px 0',
              fontSize: 14,
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
            }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
