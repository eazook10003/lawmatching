'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function InterestButton({ caseId }: { caseId: string }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [proposedPrice, setProposedPrice] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleInterest() {
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('로그인이 필요합니다.'); return }
    if (!message.trim()) { setError('메시지를 입력해주세요.'); return }
    if (!proposedPrice) { setError('금액을 입력해주세요.'); return }

    const { error } = await supabase.from('interests').insert({
      case_id: caseId,
      lawyer_id: user.id,
      message,
      proposed_price: parseInt(proposedPrice),
      status: 'pending'
    })

    if (error) {
      setError(error.message)
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return <p className="text-xs text-zinc-500 mt-4">수임 의사를 전달했습니다</p>
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-4 px-4 py-2 border border-black text-black text-sm font-medium hover:bg-black hover:text-white transition-colors"
      >
        수임 의사 전달
      </button>
    )
  }

  return (
    <div className="mt-4 border border-zinc-100 p-4 flex flex-col gap-3">
      <textarea
        placeholder="의뢰인에게 전달할 메시지"
        value={message}
        onChange={e => setMessage(e.target.value)}
        rows={3}
        className="w-full border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-black transition-colors resize-none"
      />
      <input
        placeholder="제안 금액 (원)"
        value={proposedPrice}
        onChange={e => setProposedPrice(e.target.value)}
        type="number"
        className="w-full border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-black transition-colors"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={handleInterest}
          className="px-4 py-2 bg-black text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          전달하기
        </button>
        <button
          onClick={() => setOpen(false)}
          className="px-4 py-2 border border-zinc-200 text-zinc-500 text-sm hover:border-black hover:text-black transition-colors"
        >
          취소
        </button>
      </div>
    </div>
  )
}
