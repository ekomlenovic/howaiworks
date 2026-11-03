import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import DeeperDive from '../components/DeeperDive'
import { useT } from '../i18n'

export default function ResourcesPage() {
  const t = useT('resources')
  const { TRUSTED_VOICES, RESOURCES } = t
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px' }}>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', padding: '56px 0 40px' }}
      >
        <h1 style={{
          fontSize: 'clamp(24px, 5vw, 38px)',
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: 12,
          letterSpacing: -0.5,
        }}>
          {t.title}
        </h1>
        <p style={{
          fontSize: 17,
          color: 'var(--text-secondary)',
          maxWidth: 420,
          margin: '0 auto',
          lineHeight: 1.5,
        }}>
          {t.subtitle}
        </p>
      </motion.div>

      {/* Resource list */}
      <motion.ul
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {RESOURCES.map((r) => (
          <li key={r.href} style={{
            padding: '16px 20px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
          }}>
            <a
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--brand)',
                fontSize: 15,
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; e.currentTarget.style.textUnderlineOffset = '3px' }}
              onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none' }}
            >
              {r.title} <span style={{ fontSize: 11, opacity: 0.6 }}>↗</span>
            </a>
            <div style={{
              fontSize: 13,
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              marginTop: 4,
            }}>
              {r.desc}
            </div>
          </li>
        ))}
      </motion.ul>

      {/* Trusted voices section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ marginTop: 48 }}
      >
        <h2 style={{
          fontSize: 22,
          fontWeight: 600,
          marginBottom: 6,
          letterSpacing: -0.3,
        }}>
          {t.voicesTitle}
        </h2>
        <p style={{
          fontSize: 14,
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          marginBottom: 20,
        }}>
          {t.voicesSubtitle}
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          {TRUSTED_VOICES.map((v) => (
            <div key={v.name} style={{
              padding: '16px 20px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              display: 'flex',
              gap: 16,
              alignItems: 'flex-start',
            }}>
              <img
                src={v.photo}
                alt={v.name}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--border)',
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {v.name}
                </div>
                <div style={{
                  fontSize: 12,
                  color: 'var(--text-dim)',
                  marginTop: 2,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}>
                  {v.role}
                </div>
                <div style={{
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  marginTop: 8,
                }}>
                  {v.desc}
                </div>
                <div style={{
                  display: 'flex',
                  gap: 12,
                  marginTop: 10,
                  flexWrap: 'wrap',
                }}>
                  {v.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 13,
                        color: 'var(--brand)',
                        textDecoration: 'none',
                        fontWeight: 500,
                        transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; e.currentTarget.style.textUnderlineOffset = '3px' }}
                      onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none' }}
                    >
                      {l.label} <span style={{ fontSize: 11, opacity: 0.6 }}>↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, var(--border), transparent)',
        margin: '40px 0',
      }} />

      <DeeperDive path="/resources" />

      <Footer />
    </div>
  )
}
