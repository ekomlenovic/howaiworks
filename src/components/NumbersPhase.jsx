import { motion } from 'framer-motion'
import Insight from './Insight'
import DepthPanel from './DepthPanel'

export default function NumbersPhase({ visible, tokens, inputText, showIds, onToggleIds }) {
  if (!visible) return null

  const tokenIds = tokens.map((t) => t.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ padding: '40px 0' }}
    >
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--brand)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
        Étape 02
      </div>

      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
        Tout n’est que nombres
      </h2>

      <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
        Chaque token correspond à un identifiant numérique. Ces nombres sont la{' '}
        <strong style={{ color: 'var(--text-primary)' }}>seule chose</strong>{' '}
        que le modèle d’IA reçoit. Pas de lettres, pas de sens : juste des entiers.
      </p>

      {/* Toggle button */}
      <button
        onClick={onToggleIds}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 20px',
          background: showIds ? 'var(--brand-dim)' : 'var(--bg-surface)',
          border: `1px solid ${showIds ? 'var(--brand)' : 'var(--border)'}`,
          borderRadius: 8, color: showIds ? 'var(--brand)' : 'var(--text-primary)',
          fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
          cursor: 'pointer', transition: 'all 0.3s', marginBottom: 24,
        }}
      >
        <div style={{
          width: 36, height: 20,
          background: showIds ? 'rgba(248, 95, 0, 0.3)' : 'var(--bg-elevated)',
          borderRadius: 10, position: 'relative', transition: 'background 0.3s',
        }}>
          <div style={{
            position: 'absolute', width: 16, height: 16,
            background: showIds ? 'var(--brand)' : 'var(--text-secondary)',
            borderRadius: '50%', top: 2, left: showIds ? 18 : 2, transition: 'all 0.3s',
          }} />
        </div>
        Révéler les nombres cachés dessous
      </button>

      {/* AI view comparison */}
      {showIds && inputText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: 24, marginBottom: 24,
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 12 }}>
              Ce que vous voyez
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, lineHeight: 1.8 }}>
              {inputText}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--brand)', marginBottom: 12 }}>
              Ce que voit l’IA
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, lineHeight: 1.8, color: 'var(--brand)', wordBreak: 'break-all' }}>
              {tokenIds.length > 0 ? `[${tokenIds.join(', ')}]` : '...'}
            </div>
          </div>
        </motion.div>
      )}

      {/* Surface insight */}
      <Insight visible={showIds}>
        <strong style={{ color: 'var(--brand)', fontWeight: 600 }}>Réfléchissez-y :</strong>{' '}
        quand vous posez une question à ChatGPT, il ne voit jamais vos mots. Il reçoit une suite
        de nombres comme [{tokenIds.slice(0, 5).join(', ')}{tokenIds.length > 5 ? ', ...' : ''}] et
        doit deviner ce que vous voulez dire uniquement à partir d’eux. Chacune de ses réponses commence elle aussi
        sous forme de nombres, qui ne sont retraduits en texte qu’à la toute fin.
      </Insight>

      {/* University-depth panel */}
      <DepthPanel
        visible={showIds}
        concept={
          <div>
            <p style={{ marginBottom: 12 }}>
              Chaque identifiant de token est un numéro de ligne dans une <strong style={{ color: 'var(--text-primary)' }}>matrice d’embeddings</strong> :
              un gigantesque tableau de correspondance où chaque ligne est un vecteur à très grand nombre de dimensions (en général de 768 à 12 288 selon
              le modèle). Quand le modèle reçoit le token 496, il va lire la ligne 496 et récupère
              un vecteur comme [0.023, -0.817, 0.445, ...].
            </p>
            <p style={{ marginBottom: 12 }}>
              Ce vecteur, C’EST le sens. Toute l’intelligence d’un modèle de langage travaille sur ces
              vecteurs, en les transformant à travers des couches d’attention et des réseaux dits « feed-forward ». Le texte
              d’origine a disparu. Il ne reste que les vecteurs.
            </p>
            <p>
              La matrice d’embeddings est <strong style={{ color: 'var(--text-primary)' }}>apprise pendant l’entraînement</strong>.
              Les mots employés dans des contextes similaires finissent avec des vecteurs similaires : personne ne l’a programmé,
              c’est l’objectif d’entraînement (prédire le token suivant) qui crée naturellement cette structure.
              C’est la base de l’étape 03.
            </p>
          </div>
        }
        code={`# Python : de l'identifiant de token au vecteur d'embedding
import numpy as np

# Modèle simplifié de ce qui se passe dans un transformer :
vocab_size = 100256       # taille du vocabulaire cl100k_base
embedding_dim = 1536      # dimension des embeddings de GPT-4

# La matrice d'embeddings, apprise pendant l'entraînement
# Forme : (100256, 1536), soit ~154 millions de paramètres rien que pour ce tableau !
embedding_matrix = model.get_embedding_weights()

# Quand le modèle reçoit des identifiants de tokens :
token_ids = [791, 1071, 64, 2294]  # "What does AI see"

# Chaque identifiant devient un vecteur :
vectors = embedding_matrix[token_ids]  # Forme : (4, 1536)

# Ce sont ces vecteurs que le transformer traite réellement.
# Le texte a disparu. Il ne reste que des nombres.

# Anecdote : cette matrice pèse à elle seule ~600 Mo pour GPT-4.
# C'est le « dictionnaire » qui convertit les tokens en sens.
print(f"Taille de la matrice : {vocab_size * embedding_dim * 4 / 1e6:.0f} Mo (float32)")`}
        challenge={
          <div>
            <p style={{ marginBottom: 8 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Réfléchissez-y :</strong> le vocabulaire cl100k_base
              compte 100 256 tokens. La dimension des embeddings de GPT-4 est de 1 536. Combien de paramètres contient
              la matrice d’embeddings à elle seule ?
            </p>
            <p style={{ marginBottom: 8 }}>
              Maintenant, sachant que GPT-4 aurait environ 1 800 milliards de paramètres au total, quel pourcentage du
              modèle représente « simplement » ce tableau d’embeddings ?
            </p>
            <p style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>
              La matrice d’embeddings est le pont entre le langage humain et l’espace mathématique où
              se déroule tout le raisonnement. C’est une petite fraction du modèle, mais sans elle, rien ne fonctionne.
            </p>
          </div>
        }
        realWorld={
          <div>
            <p style={{ marginBottom: 12 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Chaque appel à une API d’IA est facturé au nombre de tokens.</strong>{' '}
              Comprendre les tokens n’est pas qu’une question théorique : cela influe directement sur le coût de toute
              application construite sur des LLM (grands modèles de langage).
            </p>
            <p style={{ marginBottom: 8, paddingLeft: 16 }}>
              <strong style={{ color: '#e8d06e' }}>→ Entrée de GPT-4 Turbo :</strong> environ 0,01 $ pour 1 000 tokens.
              Une page de texte en anglais (~500 mots) coûte environ 0,005 $ à traiter.
            </p>
            <p style={{ marginBottom: 8, paddingLeft: 16 }}>
              <strong style={{ color: '#e8d06e' }}>→ Fenêtres de contexte :</strong> GPT-4 Turbo accepte 128 000 tokens,
              soit à peu près un livre de 300 pages. Mais chaque token utilisé par le message est un token
              qui ne peut pas servir à la réponse.
            </p>
            <p style={{ marginBottom: 12, paddingLeft: 16 }}>
              <strong style={{ color: '#e8d06e' }}>→ Bien écrire un prompt, c’est gérer ses tokens :</strong>{' '}
              les prompts les plus efficaces sont économes en tokens. Comprendre comment le texte se découpe
              aide à écrire des prompts qui laissent au modèle un maximum de place pour raisonner.
            </p>
            <p style={{ fontStyle: 'italic', color: 'var(--text-dim)' }}>
              Les entreprises qui construisent des produits d’IA sont obsédées par le nombre de tokens. Faire passer un prompt système de
              500 à 300 tokens, sur des millions d’appels, fait économiser des dizaines de milliers de dollars.
            </p>
          </div>
        }
      />
    </motion.div>
  )
}
