'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
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
    <header className="border-b border-zinc-100 px-4 sm:px-8 py-4 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href={role === 'lawyer' ? '/lawyer-dashboard' : '/dashboard'} className="text-base font-bold tracking-tight">
            로매칭
          </Link>
          <nav className="hidden sm:flex items-center gap-6">
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

        {/* Desktop right */}
        <div className="hidden sm:flex items-center gap-4">
          <span className="text-sm text-zinc-400">{email}</span>
          <span className="text-xs border border-zinc-200 px-2 py-0.5 text-zinc-500">
            {role === 'lawyer' ? '변호사' : '의뢰인'}
          </span>
          <button onClick={handleLogout} className="text-sm text-zinc-500 hover:text-black transition-colors">
            로그아웃
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="sm:hidden text-zinc-600" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden mt-4 pb-2 flex flex-col gap-4 border-t border-zinc-100 pt-4">
          {role === 'client' && (
            <>
              <Link href="/dashboard" className="text-sm text-zinc-700" onClick={() => setMenuOpen(false)}>내 사건</Link>
              <Link href="/cases/new" className="text-sm text-zinc-700" onClick={() => setMenuOpen(false)}>사건 등록</Link>
            </>
          )}
          {role === 'lawyer' && (
            <>
              <Link href="/lawyer-dashboard" className="text-sm text-zinc-700" onClick={() => setMenuOpen(false)}>내 수임</Link>
              <Link href="/cases" className="text-sm text-zinc-700" onClick={() => setMenuOpen(false)}>사건 목록</Link>
            </>
          )}
          <span className="text-sm text-zinc-400">{email}</span>
          <button onClick={handleLogout} className="text-sm text-left text-zinc-500">로그아웃</button>
        </div>
      )}
    </header>
  )
}
