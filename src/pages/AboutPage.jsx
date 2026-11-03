import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import DeeperDive from '../components/DeeperDive'

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
          À propos de{' '}
          howaiworks<span style={{ color: 'var(--brand)' }}>.io</span>
        </h1>
        <p style={{
          fontSize: 17,
          color: 'var(--text-secondary)',
          maxWidth: 420,
          margin: '0 auto',
          lineHeight: 1.5,
        }}>
          Apprendre l’IA en la touchant du doigt, de façon interactive.
        </p>
      </motion.div>

      {/* The Story */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={sectionStyle}
      >
        <div style={headingStyle}>L’histoire</div>
        <div style={bodyStyle}>
          <p style={{ marginBottom: 12 }}>
            howaiworks.io est né d’un constat simple :
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
            « La plupart des gens utilisent l’IA tous les jours, mais presque personne ne sait ce qui
            se passe réellement à l’intérieur. »
          </div>
          <p style={{ marginBottom: 12 }}>
            Lire des articles n’y change rien. Les diapositives et les cours magistraux non plus.
            L’expérimenter, si.
          </p>
          <p>
            <strong style={{ color: 'var(--brand)' }}>howaiworks.io</strong> is
            repose sur cette idée. Au lieu de lire des explications sur la tokenisation, les embeddings et
            l’inférence, vous les vivez. Tapez du texte et regardez-le devenir des tokens.
            Voyez les mots se ranger selon leur sens. Faites s’affronter l’inférence dans le cloud et en local. Pas de diapositives,
            pas de cours magistral. Juste la machine, rendue visible.
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
