import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

function SetupSection({ title, accent, connected, children }) {
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
            Connecté
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

const codeStyle = (accent) => ({
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  background: `${accent}18`,
  padding: '1px 5px',
  borderRadius: 4,
})

const localAccent = 'var(--brand)'

function LocalSteps() {
  const code = codeStyle('rgba(248, 95, 0,0.3)')
  return (
    <>
      <IntroBlock accent="#f85f00">
        Ollama fait tourner des modèles d’IA directement sur votre machine : pas d’internet, pas de clé d’API, aucune donnée qui quitte votre ordinateur. Le modèle utilisé ici est Qwen 2.5, avec 500 millions de paramètres, assez petit pour tenir dans environ 1 Go de mémoire vive. Il n’atteindra pas la qualité du cloud (500 millions contre 70 milliards de paramètres), mais l’inférence démarre instantanément et vos messages restent privés. C’est exactement ce compromis que cette page vous fait ressentir.
      </IntroBlock>

      <SetupStep step={1} accent={localAccent} title="Installer Ollama">
        Téléchargez-le sur{' '}
        <a href="https://ollama.com" target="_blank" rel="noopener noreferrer"
          style={{ color: 'var(--brand)', textDecoration: 'underline' }}>
          ollama.com
        </a>. C’est un logiciel qui gère les modèles d’IA sur votre machine : il les télécharge, les charge en mémoire et les rend accessibles via une API locale, un peu comme Docker gère des conteneurs.
      </SetupStep>

      <SetupStep step={2} accent={localAccent} title="Télécharger un modèle">
        Lancez <code style={code}>ollama pull qwen2.5:0.5b</code>. Cette commande télécharge les poids du modèle (~400 Mo), c’est-à-dire les paramètres appris qui contiennent tout ce que le modèle sait. Le « pull », c’est comme récupérer une image Docker : on télécharge une fois, on l’utilise autant de fois qu’on veut.
      </SetupStep>

      <SetupStep step={3} accent={localAccent} title="Vérifier que ça marche">
        Lancez <code style={code}>ollama run qwen2.5:0.5b</code> et tapez une question. S’il répond, le modèle est bien chargé. Appuyez sur Ctrl+D pour quitter.
      </SetupStep>

      <SetupStep step={4} accent={localAccent} title="Installer le serveur Python">
        Lancez <code style={code}>pip install fastapi uvicorn httpx tiktoken</code>. Cela installe le serveur qui fait le lien entre l’API locale d’Ollama et l’interface de ce site.
      </SetupStep>

      <SetupStep step={5} accent={localAccent} title="Démarrer le serveur">
        Lancez <code style={code}>uvicorn main:app --port 8000</code>. Cela démarre le serveur FastAPI sur localhost:8000. Le serveur de développement du site lui redirige les requêtes <code style={code}>/api</code>.
      </SetupStep>

      <SetupStep step={6} accent={localAccent} title="Rafraîchir cette page">
        Le badge « Simulé » disparaît de la colonne Local. Vous faites maintenant tourner une vraie inférence sur votre propre matériel.
      </SetupStep>
    </>
  )
}

export default function SetupGuide({ localConnected, webllm, localInferenceMode }) {
  const localActive = localConnected || localInferenceMode === 'webllm'

  if (localActive) return null

  const localTitle = localActive
    ? 'Local : WebLLM actif (Ollama recommandé)'
    : webllm?.status === 'loading'
      ? 'Connecter le local : chargement dans le navigateur…'
      : 'Connecter le local : Ollama'

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
                Guide d’installation
              </span>
            </div>
            <p style={{
              fontSize: 13,
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              margin: 0,
            }}>
              La course ci-dessous est simulée pour montrer des temps typiques : la piste cloud
              rejoue le comportement d’un centre de données (premier token plus lent, flux plus rapide ensuite).
              Installez Ollama ou utilisez WebGPU pour faire tourner le côté local pour de vrai.
            </p>
          </div>

          {/* Sections */}
          <div style={{ padding: '0 16px 8px' }}>
            <SetupSection
              title={localTitle}
              accent={localAccent}
              connected={localActive}
            >
              <LocalSteps />
            </SetupSection>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
