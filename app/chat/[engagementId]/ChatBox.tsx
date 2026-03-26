'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function ChatBox({
  engagementId,
  initialMessages,
}: {
  engagementId: string
  initialMessages: any[]
}) {
  const [messages, setMessages] = useState(initialMessages)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id)
    })
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('chat-' + engagementId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `engagement_id=eq.${engagementId}`,
        },
        (payload) => {
          setMessages(prev => {
            if (prev.find((m: any) => m.id === payload.new.id)) return prev
            return [...prev, payload.new]
          })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [engagementId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    if (!text.trim() || sending) return
    setSending(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSending(false); return }

    await supabase.from('messages').insert({
      engagement_id: engagementId,
      sender_id: user.id,
      content: text,
    })

    setText('')
    setSending(false)
  }

  return (
    <div>
      {/* Message list */}
      <div className="border border-zinc-100 p-4 h-96 overflow-y-auto flex flex-col gap-3 mb-4">
        {messages.length === 0 && (
          <p className="text-sm text-zinc-300 text-center mt-8">아직 메시지가 없습니다</p>
        )}
        {messages.map(m => {
          const isMe = m.sender_id === userId
          return (
            <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-xs px-4 py-2 text-sm ${
                isMe ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-800'
              }`}>
                {m.content}
              </div>
              <span className="text-xs text-zinc-300 mt-1">
                {new Date(m.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="메시지를 입력하세요"
          className="flex-1 border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={sending}
          className="px-6 py-3 bg-black text-white text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          전송
        </button>
      </div>
    </div>
  )
}
