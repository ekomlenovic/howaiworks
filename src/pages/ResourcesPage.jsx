import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import DeeperDive from '../components/DeeperDive'

const TRUSTED_VOICES = [
  {
    name: 'Andrew Ng',
    role: 'Cofondateur de Coursera, fondateur de DeepLearning.AI',
    photo: '/andrew-ng.jpg',
    desc: 'Professeur à Stanford et ancien directeur de Google Brain. Ses cours gratuits sur l’apprentissage automatique et l’apprentissage profond sont la référence pour débuter (en anglais, sous-titres disponibles).',
    links: [
      { label: 'DeepLearning.AI', href: 'https://www.deeplearning.ai/' },
      { label: 'Cours de ML sur Coursera', href: 'https://www.coursera.org/learn/machine-learning' },
    ],
  },
  {
    name: 'Andrej Karpathy',
    role: 'Ancien directeur de l’IA chez Tesla, ex-OpenAI',
    photo: 'https://pbs.twimg.com/profile_images/1296667294148382721/9Pr6XrPB_400x400.jpg',
    desc: 'Sa série YouTube « Neural Networks: Zero to Hero » construit des transformers à partir de zéro : le meilleur moyen de vraiment comprendre ce qu’il y a sous le capot (en anglais).',
    links: [
      { label: 'YouTube', href: 'https://www.youtube.com/@AndrejKarpathy' },
      { label: 'Zero to Hero', href: 'https://karpathy.ai/zero-to-hero.html' },
    ],
  },
  {
    name: 'Jeremy Howard',
    role: 'Cofondateur de fast.ai',
    photo: 'https://pbs.twimg.com/profile_images/1550854978044698624/Rj2vTOiR_400x400.jpg',
    desc: 'Une approche pratique de l’apprentissage profond, qui part du concret. Les cours fast.ai sont gratuits et pensés pour celles et ceux qui veulent construire des choses, pas seulement étudier la théorie (en anglais).',
    links: [
      { label: 'fast.ai', href: 'https://www.fast.ai/' },
      { label: 'Le cours', href: 'https://course.fast.ai/' },
    ],
  },
]

const RESOURCES = [
  {
    href: 'https://bbycroft.net/llm',
    title: 'Visualisation de LLM (Brendan Bycroft)',
    desc: 'Une visite interactive en 3D d’un transformer complet : suivez les tokens à travers les embeddings, l’attention et la prédiction, étape par étape.',
  },
  {
    href: 'https://arxiv.org/abs/1508.07909',
    title: 'L’article sur le BPE (Sennrich et al., 2016)',
    desc: 'L’article original qui a introduit l’encodage par paires d’octets (Byte Pair Encoding) pour la traduction automatique neuronale.',
  },
  {
    href: 'https://github.com/dqbd/tiktoken',
    title: 'js-tiktoken',
    desc: 'La bibliothèque de tokenisation qui fait tourner cette démo, entièrement dans votre navigateur.',
  },
  {
    href: 'https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them',
    title: 'Qu’est-ce qu’un token ? (OpenAI)',
    desc: 'L’explication officielle d’OpenAI sur les tokens, la façon de les compter et leur effet sur les prix (en anglais).',
  },
]

export default function ResourcesPage() {
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
          Ressources
        </h1>
        <p style={{
          fontSize: 17,
          color: 'var(--text-secondary)',
          maxWidth: 420,
          margin: '0 auto',
          lineHeight: 1.5,
        }}>
          Quelques ressources supplémentaires pour aller plus loin.
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
          Des voix de confiance en IA
        </h2>
        <p style={{
          fontSize: 14,
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          marginBottom: 20,
        }}>
          Des personnes à suivre : chercheurs et pédagogues qui expliquent l’IA avec profondeur et honnêteté.
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
