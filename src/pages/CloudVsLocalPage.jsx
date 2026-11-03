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

export default function CloudVsLocalPage({ webllm }) {
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
          La même IA.{' '}
          <span style={{ color: 'var(--brand)' }}>Deux machines très différentes.</span>
        </h1>
        <p style={{
          fontSize: 17,
          color: 'var(--text-secondary)',
          fontWeight: 400,
          maxWidth: 440,
          margin: '0 auto',
          lineHeight: 1.5,
        }}>
          <span style={{ color: '#6ec0e8' }}>Cloud</span> : une grappe de GPU dans un centre de données.{' '}
          <span style={{ color: 'var(--brand)' }}>Local</span> : votre propre ordinateur. Regardez-les faire la course.
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
        sections={[
          {
            label: 'Le concept',
            color: 'var(--brand)',
            defaultOpen: true,
            content: (
              <div>
                <p style={{ marginBottom: 16 }}>
                  <strong style={{ color: 'var(--brand)', fontSize: 15 }}>La chaîne d’inférence</strong>
                </p>
                <p style={{ marginBottom: 12 }}>
                  Quand vous envoyez un prompt à un modèle d’IA, voici ce qui se passe dans le GPU (la carte graphique) :
                </p>
                <div style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
                  <InferenceStep step={1} title="Tokeniser">
                    Votre texte est découpé en tokens (vous l’avez vu dans la leçon sur la tokenisation). Cela se passe sur le processeur (CPU) : rapide, pas besoin de GPU.
                  </InferenceStep>
                  <InferenceStep step={2} title="Plonger (embedding)">
                    Les identifiants des tokens sont convertis en vecteurs d’embedding (leçon « Comprendre »). La table des embeddings est stockée dans la mémoire du GPU.
                  </InferenceStep>
                  <InferenceStep step={3} title="Propagation avant">
                    Les embeddings traversent des dizaines de couches de transformer. Chaque couche contient des têtes d’attention et des réseaux
                    « feed-forward » : des milliards de multiplications de matrices. C’est là que le GPU mérite son salaire.
                  </InferenceStep>
                  <InferenceStep step={4} title="Tirer le token suivant">
                    Le modèle produit une distribution de probabilités sur les quelque 100 000 tokens possibles. On tire au sort dedans pour choisir le token suivant.
                    Puis on recommence à l’étape 2 en ajoutant ce nouveau token.
                  </InferenceStep>
                </div>

                <p style={{ marginBottom: 16 }}>
                  <strong style={{ color: 'var(--brand)', fontSize: 15 }}>La mémoire du GPU, c’est le goulot d’étranglement</strong>
                </p>
                <p style={{ marginBottom: 12 }}>
                  Tous les paramètres d’un modèle doivent tenir dans la mémoire vidéo (VRAM) du GPU. En FP16 (2 octets par paramètre) :
                </p>
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(248, 95, 0,0.06)',
                  border: '1px solid rgba(248, 95, 0,0.25)',
                  borderRadius: 8,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  marginBottom: 12,
                }}>
                  <div>0,5 Md de paramètres × 2 octets = <strong style={{ color: 'var(--brand)' }}>1 Go</strong> (tourne sur un Chromebook)</div>
                  <div>8 Md de paramètres × 2 octets = <strong style={{ color: '#6ec0e8' }}>16 Go</strong> (il faut une carte graphique de joueur)</div>
                  <div>70 Md de paramètres × 2 octets = <strong style={{ color: '#e8956e' }}>140 Go</strong> (il faut 2 A100 de 80 Go)</div>
                </div>
                <p>
                  <strong style={{ color: 'var(--text-primary)' }}>La quantification</strong> réduit ce besoin : en quantification 4 bits,
                  chaque paramètre occupe 0,5 octet au lieu de 2. Un modèle de 70 milliards de paramètres passe de 140 Go à environ 35 Go, et tient
                  sur une seule A100 ou une carte grand public très haut de gamme. La contrepartie : une légère perte de précision.
                </p>
              </div>
            ),
          },
          {
            label: 'Le code',
            color: '#6ec0e8',
            defaultOpen: false,
            content: (
              <pre style={{
                background: 'var(--bg-deep)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '16px',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                lineHeight: 1.6,
                overflowX: 'auto',
                whiteSpace: 'pre',
                color: 'var(--text-secondary)',
              }}>
{`# Inférence dans le cloud (n'importe quelle API compatible OpenAI)
import openai

client = openai.OpenAI(
    api_key="sk-votre-cle-ici"
)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "C'est quoi l'IA ?"}],
    stream=True
)

for chunk in response:
    token = chunk.choices[0].delta.content
    if token:
        print(token, end="", flush=True)

# ── Même interface, autre infrastructure ──────────
# Inférence locale (Ollama, tourne sur votre machine)
client = openai.OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"  # Ollama n'a pas besoin d'une vraie clé
)

response = client.chat.completions.create(
    model="qwen2.5:0.5b",
    messages=[{"role": "user", "content": "C'est quoi l'IA ?"}],
    stream=True
)

for chunk in response:
    token = chunk.choices[0].delta.content
    if token:
        print(token, end="", flush=True)`}
              </pre>
            ),
          },
          {
            label: 'Défi',
            color: '#e8d06e',
            defaultOpen: false,
            content: (
              <div>
                <p style={{ marginBottom: 10 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Réfléchissez :</strong>
                </p>
                <p style={{ marginBottom: 8, paddingLeft: 16 }}>
                  <strong style={{ color: '#e8d06e' }}>1.</strong> Si une A100 a 80 Go de VRAM et que chaque paramètre
                  en FP16 occupe 2 octets, quel est le plus gros modèle qu’elle peut contenir ? Et en quantification 4 bits ?
                </p>
                <p style={{ marginBottom: 8, paddingLeft: 16 }}>
                  <strong style={{ color: '#e8d06e' }}>2.</strong> Certaines stations de travail sont désormais livrées avec 128 Go de
                  mémoire unifiée, partagée entre le CPU et le GPU. Qu’est-ce que cela change pour les modèles qu’on peut faire tourner en local ?
                </p>
                <p style={{ paddingLeft: 16 }}>
                  <strong style={{ color: '#e8d06e' }}>3.</strong> Pourquoi le cloud met-il plus de temps à produire le premier token,
                  mais génère-t-il ensuite plus de tokens par seconde ? Qu’est-ce qui changerait si vous étiez sur le même réseau que la grappe de GPU ?
                </p>
              </div>
            ),
          },
          {
            label: 'Dans la vraie vie',
            color: '#e87a96',
            defaultOpen: false,
            content: (
              <div>
                <p style={{ marginBottom: 14 }}>
                  Choisir entre cloud et local n’est pas qu’une question technique : cela façonne des secteurs entiers.
                </p>
                <div style={{ display: 'grid', gap: 10 }}>
                  <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #e87a96' }}>
                    <strong style={{ color: '#e87a96' }}>Santé (le local l’emporte)</strong>
                    <div style={{ marginTop: 4, fontSize: 13 }}>
                      Les hôpitaux utilisent une IA locale pour analyser les dossiers des patients. La réglementation (HIPAA aux États-Unis, RGPD et hébergement de données de santé en France) encadre strictement ces données.
                      L’historique médical d’un patient ne devrait jamais traverser internet pour atteindre un GPU dans le cloud.
                    </div>
                  </div>
                  <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid #6ec0e8' }}>
                    <strong style={{ color: '#6ec0e8' }}>Startups (le cloud l’emporte)</strong>
                    <div style={{ marginTop: 4, fontSize: 13 }}>
                      Une startup qui sert un million d’utilisateurs ne peut pas acheter 100 A100 dès le premier jour. Le cloud lui permet d’augmenter
                      ou de réduire sa consommation de GPU selon la demande, en ne payant que ce qu’elle utilise.
                    </div>
                  </div>
                  <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid var(--brand)' }}>
                    <strong style={{ color: 'var(--brand)' }}>IA embarquée (combler l’écart)</strong>
                    <div style={{ marginTop: 4, fontSize: 13 }}>
                      Les téléphones et ordinateurs portables embarquent désormais des processeurs neuronaux et de la mémoire unifiée pensés pour les modèles
                      locaux, et des stations de travail dédiées à l’IA font tourner des modèles de plus de 100 milliards de paramètres sur votre bureau. Le matériel
                      réduit peu à peu le dilemme entre puissance et confidentialité.
                    </div>
                  </div>
                </div>
              </div>
            ),
          },
        ]}
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
          Copié !
        </span>
      )}
    </div>
  )
}

function OllamaLocalCard({ connected, webllm }) {

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
              Faire tourner en local avec Ollama
            </div>
            <div style={{
              fontSize: 13,
              color: 'var(--text-secondary)',
            }}>
              {connected
                ? 'Ollama est lancé : inférence locale active'
                : 'Faites tourner l’IA sur votre machine, sans internet'}
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
              Connecté
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
          <strong style={{ color: 'var(--brand)' }}>L’inférence locale</strong> fait tourner le modèle d’IA directement
          sur votre ordinateur : pas d’internet, pas de clé d’API, aucune donnée qui quitte votre machine. La contrepartie : votre matériel
          limite les modèles que vous pouvez utiliser. Le modèle de 0,5 milliard de paramètres utilisé ici tient dans environ 1 Go de RAM, mais il est bien plus petit
          que les modèles du cloud.
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
              Démarrage rapide
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
                Télécharger Ollama
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
                    ? 'Modèle WebGPU chargé'
                    : webllm.status === 'loading'
                    ? 'Chargement du modèle WebGPU…'
                    : "Impossible d’installer ? Essayez WebGPU"}
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
            Chargement de l’IA dans votre navigateur…
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
          {progress.text || 'Préparation de WebGPU…'}
        </div>
      </div>
    </motion.div>
  )
}

function InferenceStep({ step, title, children }) {
  return (
    <div style={{
      display: 'flex',
      gap: 14,
      padding: '12px 16px',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid var(--border)',
      borderRadius: 8,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: 'var(--brand-dim)',
        color: 'var(--brand)',
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        fontWeight: 700,
        flexShrink: 0,
        marginTop: 2,
      }}>
        {step}
      </div>
      <div style={{ flex: 1 }}>
        <strong style={{ color: 'var(--text-primary)', fontSize: 14 }}>{title}</strong>
        <div style={{ marginTop: 4, fontSize: 13, lineHeight: 1.6 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
