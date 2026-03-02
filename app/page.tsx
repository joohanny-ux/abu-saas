"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-16">
        <header className="flex items-center justify-between">
          <div className="text-xl font-semibold">ABU Commerce</div>
          <nav className="flex gap-4 text-sm">
            <Link href="/" className="hover:underline">
              홈
            </Link>
            <Link href="/products" className="hover:underline">
              상품 보기
            </Link>
          </nav>
        </header>

        <section className="grid gap-8 md:grid-cols-[3fr,2fr] items-center">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold leading-snug">
              브랜드 상품을 인플루언서와
              <br />
              B2B 바이어에게 손쉽게 공급하세요.
            </h1>
            <p className="text-zinc-600">
              우리가 유통하는 브랜드 상품을 한 곳에 모아 업로드하고,
              인플루언서와 B2B 구매자가 검색·선택·주문까지 할 수 있는 전용
              플랫폼입니다.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-full bg-black px-6 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              >
                상품 둘러보기
              </Link>
              <button
                type="button"
                className="rounded-full border border-zinc-300 px-6 py-2 text-sm hover:bg-zinc-100"
              >
                인플루언서 / B2B 입점 안내
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-6 text-sm text-zinc-600">
            <p className="font-medium mb-2">지금은 초기 버전입니다.</p>
            <p>
              우선 상품 리스트와 상세 페이지부터 만들고, 이후에 장바구니와
              주문/견적 기능, 관리자 대시보드를 단계적으로 추가할 예정입니다.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}