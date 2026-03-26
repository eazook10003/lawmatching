import Link from 'next/link'
import FadeIn from './FadeIn'

const categories = [
  '부동산', '이혼', '노동', '형사', '계약분쟁',
  '상속', '교통사고', '임금체불', '명예훼손', '사기',
]

export default function Home() {
  const ticker = [...categories, ...categories, ...categories, ...categories]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="px-4 sm:px-10 py-6 border-b border-zinc-100">
        <span className="text-xl font-bold tracking-tight">로매칭</span>
      </header>

      {/* Hero */}
      <main className="flex flex-col items-center justify-center px-6 text-center pt-16 sm:pt-24 pb-16 sm:pb-20">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 leading-tight">
          법률 문제,<br />빠르게 해결하세요
        </h1>
        <p className="text-zinc-500 text-base sm:text-lg mb-10 sm:mb-12 max-w-md">
          검증된 변호사와 간편하게 연결되는 법률 매칭 서비스
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link
            href="/login"
            className="w-full py-3 bg-black text-white text-center font-semibold text-sm tracking-wide hover:bg-zinc-800 transition-colors"
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="w-full py-3 border border-black text-black text-center font-semibold text-sm tracking-wide hover:bg-zinc-50 transition-colors"
          >
            회원가입
          </Link>
        </div>
      </main>

      {/* Ticker */}
      <div className="py-10" style={{ maxWidth: '100vw', overflow: 'hidden' }}>
        <p className="text-base font-semibold text-zinc-600 text-center mb-6">
          가장 많이 찾는 분야
        </p>
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {ticker.map((cat, i) => (
              <span
                key={i}
                className="mx-3 px-8 py-3 rounded-full border border-zinc-200 text-zinc-700 whitespace-nowrap"
                style={{ fontSize: '1.2rem' }}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Explainer sections */}
      <div className="border-t border-zinc-100 mt-10">
        {/* For clients */}
        <div className="border-b border-zinc-100">
          <FadeIn>
            <div className="max-w-2xl mx-auto px-6 py-20">
              <h2 className="text-3xl font-bold mb-6 leading-snug">의뢰인이신가요?</h2>
              <p className="text-zinc-500 text-lg leading-relaxed mb-4">
                복잡한 절차 없이 의뢰인의 요구에 응당하는 변호사를 매칭해드립니다.
              </p>
              <p className="text-zinc-500 text-lg leading-relaxed">
                요금은 오직 변호사들이 지불합니다.{' '}
                <span className="text-black font-medium">저희는 일절 돈을 받지 않습니다.</span>
              </p>
              <Link
                href="/signup?role=client"
                className="inline-block mt-8 px-6 py-3 bg-black text-white text-sm font-semibold hover:bg-zinc-800 transition-colors"
              >
                의뢰인으로 시작하기 →
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* For lawyers */}
        <div>
          <FadeIn>
            <div className="max-w-2xl mx-auto px-6 py-20">
              <h2 className="text-3xl font-bold mb-6 leading-snug">변호사이신가요?</h2>
              <p className="text-zinc-500 text-lg leading-relaxed mb-10">
                의뢰인들이 올린 케이스들을 본인의 조건에 맞게 수임하실 수 있습니다.
              </p>

              <div className="flex flex-col gap-6 mb-10">
                <div className="border-l-2 border-black pl-5">
                  <p className="font-semibold text-base mb-1">월 200만원 구독료</p>
                  <p className="text-zinc-500 text-sm leading-relaxed">합리적인 고정 비용으로 플랫폼을 이용하세요.</p>
                </div>
                <div className="border-l-2 border-black pl-5">
                  <p className="font-semibold text-base mb-1">수임료 100% 본인에게</p>
                  <p className="text-zinc-500 text-sm leading-relaxed">중개 수수료 없이 수임료 전액이 변호사님께 돌아갑니다.</p>
                </div>
                <div className="border-l-2 border-black pl-5">
                  <p className="font-semibold text-base mb-1">편리한 수임 관리</p>
                  <p className="text-zinc-500 text-sm leading-relaxed">의뢰인의 의뢰 목록에 대한 알림을 받고, 본인이 준비됐을 때 편하게 관심을 표현하세요.</p>
                </div>
              </div>

              <Link
                href="/signup?role=lawyer"
                className="inline-block mt-2 px-6 py-3 border border-black text-black text-sm font-semibold hover:bg-zinc-50 transition-colors"
              >
                변호사로 시작하기 →
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-10 py-6 border-t border-zinc-100 text-center">
        <p className="text-xs text-zinc-400">© 2025 로매칭. All rights reserved.</p>
      </footer>
    </div>
  )
}
