"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "로그인에 실패했습니다.");
      } else {
        // 쿠키가 설정된 뒤 관리자 페이지로 이동
        router.push("/admin/products");
      }
    } catch (err) {
      console.error(err);
      setMessage("요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-sm px-6 py-20 space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">관리자 로그인</h1>
          <p className="text-sm text-zinc-600">
            내부 관리자 전용 페이지입니다. 비밀번호를 입력해 주세요.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700">
              관리자 비밀번호
            </label>
            <input
              type="password"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          {message && (
            <p className="text-sm text-red-600">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <Link
          href="/"
          className="block text-center text-sm text-zinc-600 underline-offset-4 hover:underline"
        >
          홈으로
        </Link>
      </main>
    </div>
  );
}