'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import InterestButton from './InterestButton'

export default function CasesPage() {
  const [cases, setCases] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('cases')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })

      setCases(data ?? [])
    }
    load()
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-1">사건 목록</h1>
      <p className="text-sm text-zinc-400 mb-10">수임 가능한 사건을 확인하세요</p>

      {cases.length === 0 && (
        <div className="border border-dashed border-zinc-200 p-12 text-center">
          <p className="text-sm text-zinc-400">현재 등록된 사건이 없습니다</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {cases.map(c => (
          <div key={c.id} className="border border-zinc-100 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs border border-zinc-200 px-2 py-0.5 text-zinc-500">{c.category}</span>
              <span className="text-xs text-zinc-300">
                {new Date(c.created_at).toLocaleDateString('ko-KR')}
              </span>
            </div>
            <p className="text-sm text-zinc-700 leading-relaxed mb-4">{c.description}</p>
            <InterestButton caseId={c.id} />
          </div>
        ))}
      </div>
    </div>
  )
}
