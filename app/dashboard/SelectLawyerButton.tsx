'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function SelectLawyerButton({
  interestId,
  caseId,
  lawyerId
}: {
  interestId: string
  caseId: string
  lawyerId: string
}) {
  const [done, setDone] = useState(false)

  async function handleSelect() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('interests').update({ status: 'selected' }).eq('id', interestId)
    await supabase.from('interests').update({ status: 'rejected' }).eq('case_id', caseId).neq('id', interestId)
    await supabase.from('engagements').insert({ case_id: caseId, client_id: user.id, lawyer_id: lawyerId, status: 'active' })
    await supabase.from('cases').update({ status: 'matched' }).eq('id', caseId)

    setDone(true)
  }

  if (done) return <p className="text-xs text-zinc-500 mt-2">선택 완료</p>

  return (
    <button
      onClick={handleSelect}
      className="mt-2 px-4 py-2 bg-black text-white text-xs font-medium hover:bg-zinc-800 transition-colors"
    >
      이 변호사 선택
    </button>
  )
}
