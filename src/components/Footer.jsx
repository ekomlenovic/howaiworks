import { useT } from '../i18n'

export default function Footer() {
  const t = useT('common').footer
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
          {t.builtBy}
        </a>
      </div>

      <div style={{ fontSize: 12 }}>
        {t.note}
      </div>
    </footer>
  )
}
