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
    <div className="px-4 sm:px-10 py-8 sm:py-12">
      <h1 className="text-3xl font-bold mb-1">내 수임</h1>
      <p className="text-base text-zinc-400 mb-10">현재 진행 중인 수임 사건을 확인하세요</p>

      {engagements.length === 0 && (
        <div className="border border-dashed border-zinc-200 p-12 text-center max-w-sm">
          <p className="text-base text-zinc-400 mb-4">아직 수임된 사건이 없습니다</p>
          <a href="/cases" className="text-sm underline underline-offset-2 text-zinc-400 hover:text-black transition-colors">
            사건 목록 보기 →
          </a>
        </div>
      )}

      <div className="flex flex-wrap gap-6">
        {engagements.map(e => (
          <div key={e.id} className="border border-zinc-100 p-6 sm:p-8 w-full sm:w-96 transition-all duration-200 hover:scale-105 hover:border-zinc-400 hover:bg-zinc-50 hover:shadow-md cursor-default">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-base border border-zinc-200 px-3 py-1 text-zinc-500">
                {e.cases?.category}
              </span>
              <span className="text-base text-zinc-300">
                {new Date(e.created_at).toLocaleDateString('ko-KR')}
              </span>
            </div>

            <p className="text-lg text-zinc-700 leading-relaxed mb-6">{e.cases?.description}</p>

            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">
                수임 금액: {e.agreed_price?.toLocaleString() ?? '미정'}원
              </span>
              <Link
                href={`/chat/${e.id}`}
                className="text-sm underline underline-offset-2 text-black"
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
