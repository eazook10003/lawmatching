'use client'

import { useEffect, useRef } from 'react'

export default function FadeIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transition = `opacity 1.2s ease ${delay}ms, transform 1.2s ease ${delay}ms`
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        } else {
          el.style.transition = 'none'
          el.style.opacity = '0'
          el.style.transform = 'translateY(28px)'
        }
      },
      { threshold: 0.15 }
    )

    // Double RAF ensures browser paints opacity:0 before observer starts
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        observer.observe(el)
      })
    })

    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} style={{ opacity: 0, transform: 'translateY(28px)' }}>
      {children}
    </div>
  )
}
