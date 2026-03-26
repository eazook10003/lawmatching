'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import SelectLawyerButton from './SelectLawyerButton'

export default function DashboardPage() {
  const [cases, setCases] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('cases')
        .select('*, interests(*), engagements(*)')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })

      setCases(data ?? [])
    }
    load()
  }, [])

  return (
    <div className="px-4 sm:px-10 py-8 sm:py-12">
      <div className="flex items-start justify-between gap-4 mb-1">
        <h1 className="text-3xl font-bold">내 사건</h1>
        <Link
          href="/cases/new"
          className="shrink-0 px-4 py-2 bg-black text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          사건 등록
        </Link>
      </div>
      <p className="text-base text-zinc-400 mb-10">등록한 사건과 변호사 제안을 확인하세요</p>

      {cases.length === 0 && (
        <div className="border border-dashed border-zinc-200 p-12 text-center max-w-sm">
          <p className="text-base text-zinc-400 mb-4">아직 등록된 사건이 없습니다</p>
          <Link href="/cases/new" className="text-sm underline underline-offset-2 text-zinc-400 hover:text-black transition-colors">
            첫 사건 등록하기 →
          </Link>
        </div>
      )}

      <div className="flex flex-wrap gap-6">
        {cases.map(c => (
          <div key={c.id} className="border border-zinc-100 p-6 sm:p-8 w-full sm:w-96 transition-all duration-200 hover:scale-105 hover:border-zinc-400 hover:bg-zinc-50 hover:shadow-md cursor-default">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-base border border-zinc-200 px-3 py-1 text-zinc-500">{c.category}</span>
                <span className={`text-sm px-2 py-0.5 ${
                  c.status === 'open' ? 'bg-zinc-100 text-zinc-600' :
                  c.status === 'matched' ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-400'
                }`}>
                  {c.status === 'open' ? '접수중' : c.status === 'matched' ? '매칭완료' : c.status}
                </span>
              </div>
              <span className="text-sm text-zinc-300">
                {new Date(c.created_at).toLocaleDateString('ko-KR')}
              </span>
            </div>

            <p className="text-lg text-zinc-700 leading-relaxed mb-6">{c.description}</p>

            <div>
              <p className="text-sm font-medium text-zinc-500 mb-3">
                변호사 제안 {c.interests.length > 0 ? `(${c.interests.length})` : ''}
              </p>

              {c.interests.length === 0 && (
                <p className="text-base text-zinc-300">아직 제안이 없습니다</p>
              )}

              <div className="flex flex-col gap-3">
                {c.interests.map((interest: any) => (
                  <div key={interest.id} className="border border-zinc-100 p-4">
                    <p className="text-base text-zinc-700 mb-1">{interest.message}</p>
                    <p className="text-sm text-zinc-400 mb-3">
                      제안 금액: {interest.proposed_price?.toLocaleString()}원
                    </p>

                    {c.status === 'open' && interest.status === 'pending' && (
                      <SelectLawyerButton
                        interestId={interest.id}
                        caseId={c.id}
                        lawyerId={interest.lawyer_id}
                      />
                    )}

                    {interest.status === 'selected' && (
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-zinc-500">선택된 변호사</span>
                        {c.engagements?.[0] && (
                          <Link
                            href={`/chat/${c.engagements[0].id}`}
                            className="text-sm underline underline-offset-2 text-black"
                          >
                            채팅 시작 →
                          </Link>
                        )}
                      </div>
                    )}

                    {interest.status === 'rejected' && (
                      <span className="text-sm text-zinc-300">미선택</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
