import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import DeeperDive from '../components/DeeperDive'
import { useT } from '../i18n'

const sectionStyle = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: '24px',
  marginBottom: 16,
}

const headingStyle = {
  fontSize: 17,
  fontWeight: 600,
  color: 'var(--text-primary)',
  marginBottom: 12,
}

const bodyStyle = {
  fontSize: 14,
  color: 'var(--text-secondary)',
  lineHeight: 1.7,
}

export default function AboutPage() {
  const t = useT('about')
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
          {t.titleStart}{' '}
          howaiworks<span style={{ color: 'var(--brand)' }}>.io</span>
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

      {/* The Story */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={sectionStyle}
      >
        <div style={headingStyle}>{t.storyTitle}</div>
        <div style={bodyStyle}>
          <p style={{ marginBottom: 12 }}>
            {t.storyIntro}
          </p>
          <div style={{
            padding: '12px 16px',
            background: 'rgba(248, 95, 0,0.06)',
            border: '1px solid rgba(248, 95, 0,0.25)',
            borderRadius: 8,
            marginBottom: 12,
            fontStyle: 'italic',
            color: 'var(--text-primary)',
          }}>
            {t.quote}
          </div>
          <p style={{ marginBottom: 12 }}>
            {t.storyMiddle}
          </p>
          <p>
            <strong style={{ color: 'var(--brand)' }}>howaiworks.io</strong>{' '}
            {t.storyEnd}
          </p>
        </div>
      </motion.div>

      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, var(--border), transparent)',
        margin: '24px 0 40px',
      }} />

      <DeeperDive path="/about" />

      <Footer />
    </div>
  )
}
