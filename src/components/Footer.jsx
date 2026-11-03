export default function Footer() {
  const linkStyle = {
    color: 'var(--brand)',
    textDecoration: 'none',
  }

  return (
    <footer style={{
      textAlign: 'center',
      padding: '60px 0 40px',
      fontSize: 13,
      color: 'var(--text-dim)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href="https://github.com/MatthewFeroz/howaiworks" target="_blank" rel="noopener noreferrer" style={linkStyle}>
          GitHub
        </a>
        <span>·</span>
        <a href="https://howaiworks.io" style={linkStyle}>
          howaiworks.io
        </a>
        <span>·</span>
        <a href="https://matthewferoz.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>
          Créé par Matt Feroz
        </a>
      </div>

      <div style={{ fontSize: 12 }}>
        Ce projet est open source : il a été conçu pour rendre l’apprentissage de l’IA accessible à tous.
      </div>
    </footer>
  )
}
