'use client'

import Link from 'next/link'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleLogin() {
    setError('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      return
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single()

    window.location.href = profile?.role === 'lawyer' ? '/lawyer-dashboard' : '/dashboard'
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-10 py-6 border-b border-zinc-100">
        <Link href="/" className="text-xl font-bold tracking-tight">로매칭</Link>
      </header>

      <main className="flex-1 flex items-start justify-center px-6 pt-20">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-1">로그인</h1>
          <p className="text-sm text-zinc-400 mb-8">계속하려면 로그인하세요</p>

          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
            />
          </div>

          {error && <p className="text-xs text-red-500 mt-3">{error}</p>}

          <button
            onClick={handleLogin}
            className="w-full mt-6 py-3 bg-black text-white text-sm font-semibold hover:bg-zinc-800 transition-colors"
          >
            로그인
          </button>

          <p className="text-sm text-zinc-400 text-center mt-6">
            계정이 없으신가요?{' '}
            <Link href="/signup" className="text-black underline underline-offset-2">회원가입</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
