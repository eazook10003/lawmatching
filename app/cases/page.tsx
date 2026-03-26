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
    <div className="px-4 sm:px-10 py-8 sm:py-12">
      <h1 className="text-3xl font-bold mb-1">사건 목록</h1>
      <p className="text-base text-zinc-400 mb-10">수임 가능한 사건을 확인하세요</p>

      {cases.length === 0 && (
        <div className="border border-dashed border-zinc-200 p-12 text-center">
          <p className="text-base text-zinc-400">현재 등록된 사건이 없습니다</p>
        </div>
      )}

      <div className="flex flex-wrap gap-6">
        {cases.map(c => (
          <div key={c.id} className="border border-zinc-100 p-6 sm:p-8 w-full sm:w-96 transition-all duration-200 hover:scale-105 hover:border-zinc-400 hover:bg-zinc-50 hover:shadow-md cursor-default">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-base border border-zinc-200 px-3 py-1 text-zinc-500">{c.category}</span>
              <span className="text-base text-zinc-300">
                {new Date(c.created_at).toLocaleDateString('ko-KR')}
              </span>
            </div>
            <p className="text-lg text-zinc-700 leading-relaxed mb-6">{c.description}</p>
            <InterestButton caseId={c.id} />
          </div>
        ))}
      </div>
    </div>
  )
}
