import { useRef, useEffect } from 'react'
import ChatMessage from './ChatMessage'

export default function ChatArea({ messages }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '16px 0',
      minHeight: 200,
      maxHeight: 420,
    }}>
      {messages.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--text-dim)',
          fontSize: 14,
          fontFamily: 'var(--font-mono)',
        }}>
          Envoyez un message pour commencer à discuter avec l’IA locale
        </div>
      )}
      {messages.map((msg, i) => (
        <ChatMessage
          key={i}
          role={msg.role}
          content={msg.content}
          tokens={msg.tokens}
          isStreaming={msg.isStreaming}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
