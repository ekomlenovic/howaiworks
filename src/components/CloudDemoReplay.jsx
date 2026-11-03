// Pre-recorded cloud responses for demo mode
// Simulates cloud inference: longer initial delay (network hop) + faster token rate

// The pre-recorded responses live in the language files: run.demo

// Simulate cloud streaming: initial delay (300-800ms) + faster token rate (~80 tok/s)
export function simulateCloudStream(text, onToken, onDone, options = {}) {
  const {
    initialDelay = 400 + Math.random() * 400,
    tokenInterval = 12 + Math.random() * 8,
  } = options

  // Split into small chunks that approximate tokens
  const chunks = []
  let i = 0
  while (i < text.length) {
    const chunkSize = Math.min(2 + Math.floor(Math.random() * 4), text.length - i)
    let end = i + chunkSize
    if (end < text.length && text[end] !== ' ' && text.indexOf(' ', i) > 0) {
      const nextSpace = text.indexOf(' ', end)
      if (nextSpace > 0 && nextSpace - end < 3) {
        end = nextSpace + 1
      }
    }
    chunks.push(text.slice(i, end))
    i = end
  }

  let idx = 0
  let intervalId = null
  let cancelled = false

  // Initial delay simulating network latency
  const delayTimer = setTimeout(() => {
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
  }, initialDelay)

  return () => {
    cancelled = true
    clearTimeout(delayTimer)
    if (intervalId) clearInterval(intervalId)
  }
}
