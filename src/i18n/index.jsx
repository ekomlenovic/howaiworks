import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { LANGUAGES, DEFAULT_LANG } from './languages'

// Every src/i18n/locales/<code>/ folder is loaded automatically.
const modules = import.meta.glob('./locales/*/index.js', { eager: true })
const LOCALES = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [path.split('/')[2], mod.default]),
)

const STORAGE_KEY = 'howaiworks-lang'
const isSupported = (code) => LANGUAGES.some((l) => l.code === code) && !!LOCALES[code]

function initialLanguage() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang')
    if (fromUrl && isSupported(fromUrl)) return fromUrl
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && isSupported(stored)) return stored
  } catch { /* storage unavailable: keep the default language */ }
  return DEFAULT_LANG
}

// Merge "translation over the default language": a key missing
// from a translation shows the default-language text instead of crashing.
const isPlainObject = (v) =>
  v !== null && typeof v === 'object' && !Array.isArray(v) && !v.$$typeof &&
  Object.getPrototypeOf(v) === Object.prototype

function withFallback(base, override) {
  if (override === undefined) return base
  if (!isPlainObject(base) || !isPlainObject(override)) return override
  const out = { ...base }
  for (const key of Object.keys(override)) out[key] = withFallback(base[key], override[key])
  return out
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(initialLanguage)

  const setLang = useCallback((code) => {
    if (!isSupported(code)) return
    setLangState(code)
    try { localStorage.setItem(STORAGE_KEY, code) } catch { /* ignored */ }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const messages = useMemo(
    () => withFallback(LOCALES[DEFAULT_LANG], LOCALES[lang]),
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, messages, languages: LANGUAGES }), [lang, setLang, messages])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}

// Returns the strings for one part of the site, e.g. useT('tokenizer').
export function useT(namespace) {
  const { messages } = useContext(LanguageContext)
  return namespace ? messages[namespace] : messages
}

export { LANGUAGES, DEFAULT_LANG }
