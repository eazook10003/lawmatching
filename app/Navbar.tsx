'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      setEmail(user.email ?? '')
      setRole(profile?.role ?? '')
    }
    load()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (!email) return null

  return (
    <header className="border-b border-zinc-100 px-8 py-4 flex items-center justify-between bg-white">
      <div className="flex items-center gap-8">
        <Link href={role === 'lawyer' ? '/lawyer-dashboard' : '/dashboard'} className="text-base font-bold tracking-tight">
          로매칭
        </Link>
        <nav className="flex items-center gap-6">
          {role === 'client' && (
            <>
              <Link href="/dashboard" className="text-sm text-zinc-600 hover:text-black transition-colors">내 사건</Link>
              <Link href="/cases/new" className="text-sm text-zinc-600 hover:text-black transition-colors">사건 등록</Link>
            </>
          )}
          {role === 'lawyer' && (
            <>
              <Link href="/lawyer-dashboard" className="text-sm text-zinc-600 hover:text-black transition-colors">내 수임</Link>
              <Link href="/cases" className="text-sm text-zinc-600 hover:text-black transition-colors">사건 목록</Link>
            </>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-zinc-400">{email}</span>
        <span className="text-xs border border-zinc-200 px-2 py-0.5 text-zinc-500">
          {role === 'lawyer' ? '변호사' : '의뢰인'}
        </span>
        <button
          onClick={handleLogout}
          className="text-sm text-zinc-500 hover:text-black transition-colors"
        >
          로그아웃
        </button>
      </div>
    </header>
  )
}
