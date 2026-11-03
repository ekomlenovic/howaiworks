import { motion } from 'framer-motion'

export default function EmbeddingTeaser({ visible }) {
  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        textAlign: 'center',
        padding: '60px 0',
      }}
    >
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--brand)',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 8,
      }}>
        Étape 03
      </div>

      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
        La carte du sens
      </h2>

      <p style={{
        color: 'var(--text-secondary)',
        fontSize: 15,
        maxWidth: 480,
        margin: '0 auto',
        lineHeight: 1.6,
      }}>
        Ces nombres ne sont pas choisis au hasard : les mots de sens proche se retrouvent voisins
        dans un immense espace mathématique. Découvrez comment l’IA organise le sens de tous les mots que vous connaissez.
      </p>

      {/* TODO: Replace with EmbeddingMap component connected to Ollama */}
      <div style={{
        marginTop: 40,
        padding: 40,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        color: 'var(--text-dim)',
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
      }}>
        🗺️ Carte interactive des embeddings : connectez Ollama pour l’explorer
      </div>
    </motion.div>
  )
}
