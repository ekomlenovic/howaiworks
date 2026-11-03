import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        textAlign: 'center',
        padding: '48px 0 32px',
      }}
    >
      <h1 style={{
        fontSize: 'clamp(28px, 5vw, 42px)',
        fontWeight: 700,
        lineHeight: 1.2,
        marginBottom: 12,
        letterSpacing: -0.5,
      }}>
        L’IA ne lit pas des mots. Elle lit des <span style={{ color: 'var(--brand)' }}>nombres.</span>
      </h1>

      <p style={{
        fontSize: 17,
        color: 'var(--text-secondary)',
        fontWeight: 400,
        maxWidth: 420,
        margin: '0 auto',
        lineHeight: 1.5,
      }}>
        Avant de pouvoir faire quoi que ce soit de votre texte, l’IA doit le découper en petits morceaux appelés tokens.
        Tapez ci-dessous et voyez exactement comment.
      </p>
    </motion.div>
  )
}
