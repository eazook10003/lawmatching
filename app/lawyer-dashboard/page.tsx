'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function LawyerDashboardPage() {
  const [engagements, setEngagements] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('engagements')
        .select('*, cases(*)')
        .eq('lawyer_id', user.id)
        .order('created_at', { ascending: false })

      setEngagements(data ?? [])
    }
    load()
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-10">
        <h1 className="text-2xl font-bold mb-1">내 수임</h1>
        <p className="text-sm text-zinc-400">현재 진행 중인 수임 사건을 확인하세요</p>
      </div>

      {engagements.length === 0 && (
        <div className="border border-dashed border-zinc-200 p-12 text-center">
          <p className="text-sm text-zinc-400 mb-4">아직 수임된 사건이 없습니다</p>
          <a href="/cases" className="text-xs underline underline-offset-2 text-zinc-400 hover:text-black transition-colors">
            사건 목록 보기 →
          </a>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {engagements.map(e => (
          <div key={e.id} className="border border-zinc-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs border border-zinc-200 px-2 py-0.5 text-zinc-500">
                {e.cases?.category}
              </span>
              <span className="text-xs text-zinc-300">
                {new Date(e.created_at).toLocaleDateString('ko-KR')}
              </span>
            </div>

            <p className="text-sm text-zinc-700 leading-relaxed mb-4">{e.cases?.description}</p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">
                수임 금액: {e.agreed_price?.toLocaleString() ?? '미정'}원
              </span>
              <Link
                href={`/chat/${e.id}`}
                className="text-xs underline underline-offset-2 text-black"
              >
                채팅 시작 →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
