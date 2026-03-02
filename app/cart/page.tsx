"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, updateQuantity, clear } = useCart();
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactChannel, setContactChannel] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);

    if (!contactName) {
      setResult("담당자 이름은 필수입니다.");
      return;
    }
    if (items.length === 0) {
      setResult("장바구니에 담긴 상품이 없습니다.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contactName,
        contactEmail,
        contactChannel,
        message,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.price,
        })),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data);
      setResult(data.message || "요청 중 오류가 발생했습니다.");
    } else {
      setResult("주문/견적 요청이 접수되었습니다.");
      clear();
      setContactName("");
      setContactEmail("");
      setContactChannel("");
      setMessage("");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-4xl px-6 py-10 space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">장바구니 / 주문 요청</h1>
            <p className="mt-1 text-sm text-zinc-600">
              인플루언서·B2B 바이어용 주문/견적 요청 장바구니입니다.
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm text-zinc-600 underline-offset-4 hover:underline"
          >
            상품 더 보러가기
          </Link>
        </header>

        {/* 장바구니 목록 */}
        <section className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">담긴 상품</h2>
          {items.length === 0 ? (
            <p className="text-sm text-zinc-500">
              장바구니가 비어 있습니다. 상품 목록에서 담아보세요.
            </p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-zinc-500">
                      {item.price.toLocaleString()}원 / 개
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      className="w-16 rounded-md border border-zinc-300 px-2 py-1 text-xs outline-none focus:border-black"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          item.productId,
                          Math.max(1, Number(e.target.value) || 1)
                        )
                      }
                    />
                    <div className="w-24 text-right text-xs font-medium">
                      {(item.price * item.quantity).toLocaleString()}원
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-2 border-t border-zinc-200 pt-2 text-right text-sm font-semibold">
                예상 합계: {total.toLocaleString()}원
              </div>
            </div>
          )}
        </section>

        {/* 주문자 정보 폼 */}
        <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">
            주문/견적 요청 정보
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-700">
                  담당자 이름 *
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="예: 홍길동"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-700">
                  이메일
                </label>
                <input
                  type="email"
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="예: you@example.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-medium text-zinc-700">
                  연락 채널 (인스타 ID, 카카오톡, 전화번호 등)
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
                  value={contactChannel}
                  onChange={(e) => setContactChannel(e.target.value)}
                  placeholder="예: @influencer_id, 카카오톡 ID, 전화번호 등"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700">
                요청 메모
              </label>
              <textarea
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="콘텐츠 형태, 희망 단가/수량, 일정 등 요청사항을 자유롭게 적어 주세요."
              />
            </div>

            {result && (
              <p className="text-sm text-zinc-700">{result}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {loading ? "요청 보내는 중..." : "주문/견적 요청 보내기"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}