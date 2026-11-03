// Pre-recorded conversations for demo mode
// Simulates realistic Ollama streaming at ~30 tokens/sec

// The pre-recorded conversations live in the language files: run.demo

// Simulate token streaming by splitting response into word-level chunks
// Optional params: initialDelay (ms before first token), tokenInterval (ms between tokens)
export function simulateTokenStream(text, onToken, onDone, options = {}) {
  const {
    initialDelay = 0,
    tokenInterval = 30 + Math.random() * 20,
  } = options

  // Split into small chunks that approximate tokens
  const chunks = []
  let i = 0
  while (i < text.length) {
    // Vary chunk size for realism (2-6 chars)
    const chunkSize = Math.min(2 + Math.floor(Math.random() * 4), text.length - i)
    // Don't break in the middle of a word if possible
    let end = i + chunkSize
    if (end < text.length && text[end] !== ' ' && text.indexOf(' ', i) > 0) {
      const nextSpace = text.indexOf(' ', end)
      const prevSpace = text.lastIndexOf(' ', end)
      if (nextSpace > 0 && nextSpace - end < 3) {
        end = nextSpace + 1
      } else if (prevSpace > i) {
        // keep end as-is for variety
      }
    }
    chunks.push(text.slice(i, end))
    i = end
  }

  let idx = 0
  let intervalId = null
  let cancelled = false

  const startStreaming = () => {
    if (cancelled) return
    intervalId = setInterval(() => {
      if (idx >= chunks.length) {
        clearInterval(intervalId)
        onDone()
        return
      }
      onToken(chunks[idx])
      idx++
    }, tokenInterval)
  }

  if (initialDelay > 0) {
    const delayTimer = setTimeout(startStreaming, initialDelay)
    return () => {
      cancelled = true
      clearTimeout(delayTimer)
      if (intervalId) clearInterval(intervalId)
    }
  } else {
    startStreaming()
    return () => {
      cancelled = true
      if (intervalId) clearInterval(intervalId)
    }
  }
}
