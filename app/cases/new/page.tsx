'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function NewCasePage() {
  const [category, setCategory] = useState('부동산')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit() {
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('로그인이 필요합니다.'); return }
    if (!description.trim()) { setError('사건 내용을 입력해주세요.'); return }

    const { error } = await supabase.from('cases').insert({
      client_id: user.id,
      category,
      description,
      status: 'open'
    })

    if (error) {
      setError(error.message)
    } else {
      setDone(true)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-white flex items-start justify-center px-6 pt-20">
        <div className="text-center">
          <p className="text-2xl font-bold mb-2">등록 완료</p>
          <p className="text-sm text-zinc-400 mb-8">사건이 성공적으로 등록되었습니다</p>
          <a href="/dashboard" className="text-sm underline underline-offset-2 text-black">내 사건 보기 →</a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-1">사건 등록</h1>
      <p className="text-sm text-zinc-400 mb-10">담당 변호사가 사건을 검토 후 연락드립니다</p>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-xs text-zinc-500 mb-1.5 block">분야</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors bg-white"
          >
            <option value="부동산">부동산</option>
            <option value="이혼">이혼</option>
            <option value="노동">노동</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-zinc-500 mb-1.5 block">사건 내용</label>
          <textarea
            placeholder="상황을 자세히 설명해주세요"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={6}
            className="w-full border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors resize-none"
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-500 mt-3">{error}</p>}

      <button
        onClick={handleSubmit}
        className="w-full mt-6 py-3 bg-black text-white text-sm font-semibold hover:bg-zinc-800 transition-colors"
      >
        등록하기
      </button>
    </div>
  )
}
