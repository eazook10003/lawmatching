'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

const inputClass = "w-full border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors"

export default function SignupPage() {
  const searchParams = useSearchParams()
  const initialRole = searchParams.get('role') as 'client' | 'lawyer' | null
  const [role, setRole] = useState<'client' | 'lawyer' | null>(initialRole)
  const [step, setStep] = useState<'form' | 'payment'>('form')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [attorneyInfo, setAttorneyInfo] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleFormNext() {
    setError('')
    if (!fullName.trim()) return setError('이름을 입력해주세요.')
    if (!email.trim()) return setError('이메일을 입력해주세요.')
    if (password.length < 6) return setError('비밀번호는 6자 이상이어야 합니다.')
    if (password !== confirmPassword) return setError('비밀번호가 일치하지 않습니다.')

    if (role === 'lawyer') {
      setStep('payment')
    } else {
      handleSignup()
    }
  }

  async function handleSignup() {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role, full_name: fullName, attorney_info: attorneyInfo }
      }
    })

    if (error) {
      setError(error.message)
      setStep('form')
    } else {
      window.location.href = '/'
    }
    setLoading(false)
  }

  // Step 1: choose role
  if (!role) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="px-10 py-6 border-b border-zinc-100">
          <Link href="/" className="text-xl font-bold tracking-tight">로매칭</Link>
        </header>
        <main className="flex-1 flex items-start justify-center px-6 pt-20">
          <div className="w-full max-w-sm text-center">
            <h1 className="text-2xl font-bold mb-2">회원가입</h1>
            <p className="text-sm text-zinc-400 mb-10">어떤 자격으로 가입하시나요?</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => setRole('client')} className="w-full py-4 bg-black text-white font-semibold text-sm hover:bg-zinc-800 transition-colors">
                의뢰인으로 가입
              </button>
              <button onClick={() => setRole('lawyer')} className="w-full py-4 border border-black text-black font-semibold text-sm hover:bg-zinc-50 transition-colors">
                변호사로 가입
              </button>
            </div>
            <p className="text-sm text-zinc-400 text-center mt-8">
              이미 계정이 있으신가요?{' '}
              <Link href="/login" className="text-black underline underline-offset-2">로그인</Link>
            </p>
          </div>
        </main>
      </div>
    )
  }

  // Step 3: payment info (lawyers only)
  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="px-10 py-6 border-b border-zinc-100">
          <Link href="/" className="text-xl font-bold tracking-tight">로매칭</Link>
        </header>
        <main className="flex-1 flex items-start justify-center px-6 pt-8">
          <div className="w-full max-w-sm">
            <button onClick={() => setStep('form')} className="text-sm text-zinc-400 hover:text-black transition-colors mb-6">
              ← 뒤로
            </button>

            <h1 className="text-2xl font-bold mb-1">구독 안내</h1>
            <p className="text-sm text-zinc-400 mb-10">로매칭 변호사 플랜</p>

            <div className="border border-zinc-100 p-6 mb-6">
              <div className="flex items-end gap-2 mb-6">
                <span className="text-4xl font-bold">200만원</span>
                <span className="text-zinc-400 text-sm mb-1">/ 월</span>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-black mt-0.5">—</span>
                  <p className="text-sm text-zinc-600">수임료 100% 본인에게 — 중개 수수료 없음</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-black mt-0.5">—</span>
                  <p className="text-sm text-zinc-600">의뢰인 케이스 목록 실시간 알림</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-black mt-0.5">—</span>
                  <p className="text-sm text-zinc-600">원하는 사건에만 선택적으로 수임 의사 표현</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-black mt-0.5">—</span>
                  <p className="text-sm text-zinc-600">의뢰인과 1:1 채팅</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-400 mb-6">
              * 현재 결제 시스템 준비 중입니다. 지금 가입하시면 정식 오픈 시 안내드립니다.
            </p>

            {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full py-3 bg-black text-white text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {loading ? '처리 중...' : '가입 완료하기'}
            </button>
          </div>
        </main>
      </div>
    )
  }

  // Step 2: fill in form
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-10 py-6 border-b border-zinc-100">
        <Link href="/" className="text-xl font-bold tracking-tight">로매칭</Link>
      </header>
      <main className="flex-1 flex items-start justify-center px-6 pt-8">
        <div className="w-full max-w-sm">
          <button onClick={() => setRole(null)} className="text-sm text-zinc-400 hover:text-black transition-colors mb-6">
            ← 뒤로
          </button>

          <h1 className="text-2xl font-bold mb-1">
            {role === 'client' ? '의뢰인' : '변호사'} 회원가입
          </h1>
          <p className="text-sm text-zinc-400 mb-8">
            {role === 'client' ? '법률 도움이 필요한 의뢰인' : '법률 서비스를 제공하는 변호사'}
          </p>

          <div className="flex flex-col gap-3">
            <input placeholder="이름" value={fullName} onChange={e => setFullName(e.target.value)} className={inputClass} />
            <input placeholder="이메일" type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
            <input placeholder="비밀번호 (6자 이상)" type="password" value={password} onChange={e => setPassword(e.target.value)} className={inputClass} />
            <input placeholder="비밀번호 확인" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputClass} />

            {role === 'lawyer' && (
              <div>
                <p className="text-xs text-zinc-400 mb-2">변호사 자격 증명 (추후 확정 예정)</p>
                <textarea
                  placeholder="변호사 자격을 증명할 수 있는 정보를 입력해주세요."
                  value={attorneyInfo}
                  onChange={e => setAttorneyInfo(e.target.value)}
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </div>
            )}
          </div>

          {error && <p className="text-xs text-red-500 mt-3">{error}</p>}

          <button
            onClick={handleFormNext}
            className="w-full mt-6 py-3 bg-black text-white text-sm font-semibold hover:bg-zinc-800 transition-colors"
          >
            {role === 'lawyer' ? '다음 — 구독 안내 확인' : '가입하기'}
          </button>
        </div>
      </main>
    </div>
  )
}
