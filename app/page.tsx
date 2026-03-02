"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-10 space-y-20">
        {/* HERO 섹션 */}
        <section className="grid gap-10 md:grid-cols-2 md:items-center">
          {/* 왼쪽 텍스트 */}
          <div className="space-y-6">
            <p className="text-xs font-semibold tracking-[0.18em] text-zinc-500 uppercase">
              INFLUENCER · B2B COMMERCE PLATFORM
            </p>
            <h1 className="text-3xl font-bold leading-snug tracking-tight md:text-4xl">
              브랜드 및
              <br />
              크리에이터의 성공적인
              <br />
              비즈니스를 위한 플랫폼
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-zinc-600 md:text-base">
              나만의 브랜드 스토어에 그대로 담길 수 있는 제품과 스토리.
              인플루언서와 B2B 바이어가 신뢰할 수 있는 상품 중심의 커머스를
              지향합니다.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <Link
                href="/products"
                className="rounded-full bg-black px-6 py-2 font-medium text-white hover:bg-zinc-800"
              >
                상품 둘러보기
              </Link>
              <button
                type="button"
                className="rounded-full border border-zinc-300 bg-white px-6 py-2 font-medium text-zinc-800 hover:bg-zinc-100"
              >
                시작 가이드 보기
              </button>
            </div>
          </div>

          {/* 오른쪽 카드 / 디바이스 모형 */}
          <div className="flex items-center justify-center">
            <div className="relative h-64 w-full max-w-sm rounded-3xl bg-gradient-to-b from-zinc-100 to-white shadow-[0_18px_60px_rgba(15,23,42,0.15)]">
              <div className="absolute inset-x-10 top-6 h-4 rounded-full bg-zinc-100" />
              <div className="absolute inset-x-8 top-16 h-40 rounded-2xl bg-white shadow-inner" />
              <div className="absolute inset-x-8 bottom-10 flex flex-col gap-2 px-6 text-xs text-zinc-500">
                <div className="h-2 rounded-full bg-zinc-200" />
                <div className="h-2 w-4/5 rounded-full bg-zinc-200/70" />
                <div className="h-2 w-3/5 rounded-full bg-zinc-200/60" />
              </div>
              <div className="absolute inset-x-16 bottom-4 h-1.5 rounded-full bg-zinc-100" />
            </div>
          </div>
        </section>

        {/* 검은 배경 섹션 - 가치 제안 */}
        <section className="rounded-3xl bg-black px-6 py-12 text-white md:px-10">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                브랜드와 크리에이터의
                <br />
                성장을 돕습니다.
              </h2>
              <p className="text-sm leading-relaxed text-zinc-300 md:text-base">
                ABU Commerce 는 브랜드가 원하는 유통 전략과
                크리에이터가 원하는 협업 방식을 한 곳에 모아,
                서로가 빠르게 연결될 수 있도록 돕는 B2B · 크리에이터 커머스
                허브입니다.
              </p>
            </div>

            <div className="grid gap-6 text-sm md:grid-cols-3">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-zinc-400">
                  01 · 액션 중심 크리에이터 매칭
                </p>
                <p className="text-sm font-medium">
                  실제 판매/전환 데이터를 기반으로 한 크리에이터 연결
                </p>
                <p className="text-xs leading-relaxed text-zinc-400">
                  단순 조회수가 아니라, 카테고리/타깃/콘텐츠 스타일에 맞는
                  파트너를 찾을 수 있도록 설계합니다.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-zinc-400">
                  02 · 글로벌 브랜드 프레젠테이션
                </p>
                <p className="text-sm font-medium">
                  브랜드가 원하는 스토리 그대로 노출
                </p>
                <p className="text-xs leading-relaxed text-zinc-400">
                  소재/포지셔닝/브랜드 히스토리를 한 번에 전달해,
                  인플루언서와 바이어가 정확한 맥락 안에서 상품을 이해합니다.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-zinc-400">
                  03 · 운영 부담 없는 견적/주문 흐름
                </p>
                <p className="text-sm font-medium">
                  장바구니 기반 견적/공급 요청 자동화
                </p>
                <p className="text-xs leading-relaxed text-zinc-400">
                  반복되는 견적·재고 문의를 최소화하고, 단일 대시보드에서
                  모든 요청을 처리할 수 있게 합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 누구를 위한 플랫폼인가요? */}
        <section className="space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
              누구를 위한 플랫폼인가요?
            </h2>
            <p className="text-sm text-zinc-600">
              브랜드 · 크리에이터 · 쇼룸 각자의 관점에서 필요한 기능을
              제공합니다.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* 카드 1: 브랜드용 */}
            <div className="flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
              <div className="h-32 bg-gradient-to-tr from-zinc-800 via-zinc-600 to-zinc-300" />
              <div className="flex flex-1 flex-col gap-3 p-5 text-sm">
                <h3 className="text-base font-semibold">브랜드용</h3>
                <p className="text-xs leading-relaxed text-zinc-600">
                  기존 도매 채널과 별도로, 크리에이터/온라인 바이어만을
                  위한 상품 라인업과 조건을 구성할 수 있습니다.
                </p>
                <div className="mt-auto">
                  <Link
                    href="/admin/products"
                    className="text-xs font-semibold text-zinc-900 underline-offset-4 hover:underline"
                  >
                    브랜드 시작하기
                  </Link>
                </div>
              </div>
            </div>

            {/* 카드 2: 크리에이터용 */}
            <div className="flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
              <div className="h-32 bg-gradient-to-tr from-fuchsia-500 via-purple-500 to-sky-400" />
              <div className="flex flex-1 flex-col gap-3 p-5 text-sm">
                <h3 className="text-base font-semibold">크리에이터용</h3>
                <p className="text-xs leading-relaxed text-zinc-600">
                  카테고리/브랜드/가격대별로 상품을 탐색하고,
                  장바구니를 기반으로 협업 상품 리스트와 견적을 구성할 수
                  있습니다.
                </p>
                <div className="mt-auto">
                  <Link
                    href="/products"
                    className="text-xs font-semibold text-zinc-900 underline-offset-4 hover:underline"
                  >
                    제품 라인업 살펴보기
                  </Link>
                </div>
              </div>
            </div>

            {/* 카드 3: 쇼룸/에이전시용 */}
            <div className="flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
              <div className="h-32 bg-gradient-to-tr from-zinc-900 via-zinc-700 to-zinc-400" />
              <div className="flex flex-1 flex-col gap-3 p-5 text-sm">
                <h3 className="text-base font-semibold">쇼룸 · 에이전시용</h3>
                <p className="text-xs leading-relaxed text-zinc-600">
                  여러 브랜드를 동시에 운영하는 쇼룸/에이전시는, 입점사 관리와
                  크리에이터/바이어 관리 흐름을 하나의 툴에서 통합할 수
                  있습니다.
                </p>
                <div className="mt-auto">
                  <button
                    type="button"
                    className="text-xs font-semibold text-zinc-900 underline-offset-4 hover:underline"
                  >
                    맞춤 플랜 상담하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}