"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  description: string | null;
  target: string | null;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function loadProducts() {
    setLoadingList(true);
    const { data, error } = await supabase
      .from("products")
      .select("id, name, brand, price, category, description, target")
      .order("name", { ascending: true });

    if (error) {
      console.error(error);
      setProducts([]);
    } else {
      setProducts(data ?? []);
    }
    setLoadingList(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function resetForm() {
    setEditingId(null);
    setName("");
    setBrand("");
    setPrice("");
    setCategory("");
    setDescription("");
    setTarget("");
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setName(product.name);
    setBrand(product.brand);
    setPrice(product.price);
    setCategory(product.category);
    setDescription(product.description ?? "");
    setTarget(product.target ?? "");
    setMessage(null);
  }

  async function handleDelete(id: string) {
    const ok = window.confirm("정말 이 상품을 삭제하시겠습니까?");
    if (!ok) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error(error);
      alert("삭제 중 오류가 발생했습니다.");
      return;
    }
    if (editingId === id) resetForm();
    await loadProducts();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!name || !brand || !price || !category) {
      setMessage("필수 항목을 모두 입력해 주세요.");
      return;
    }

    setSaving(true);

    const payload = {
      name,
      brand,
      price: Number(price),
      category,
      description: description || null,
      target: target || null,
    };

    let error;
    if (editingId) {
      const res = await supabase
        .from("products")
        .update(payload)
        .eq("id", editingId);
      error = res.error;
    } else {
      const res = await supabase.from("products").insert(payload);
      error = res.error;
    }

    if (error) {
      console.error(error);
      setMessage("저장 중 오류가 발생했습니다. 콘솔을 확인해 주세요.");
    } else {
      setMessage(editingId ? "상품이 수정되었습니다." : "상품이 등록되었습니다.");
      resetForm();
      await loadProducts();
    }

    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-5xl px-6 py-10 space-y-10">
        {/* 상단 헤더 */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">관리자 · 상품 관리</h1>
            <p className="mt-1 text-sm text-zinc-600">
              Supabase products 테이블에서 상품을 등록·수정·삭제합니다.
            </p>
          </div>
          <div className="flex gap-3 text-sm">
            <Link
              href="/products"
              className="text-zinc-600 underline-offset-4 hover:underline"
            >
              사용자용 상품 목록
            </Link>
            <Link
              href="/"
              className="text-zinc-600 underline-offset-4 hover:underline"
            >
              홈으로
            </Link>
          </div>
        </header>

        {/* 상품 등록/수정 폼 */}
        <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900">
              {editingId ? "상품 수정" : "새 상품 등록"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-zinc-500 underline-offset-4 hover:underline"
              >
                새 상품 등록 모드로 전환
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-700">
                  상품명 *
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 클린 뷰티 스킨 토너"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-700">
                  브랜드명 *
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="예: ABU Beauty"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-700">
                  가격(원) *
                </label>
                <input
                  type="number"
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
                  value={price}
                  onChange={(e) =>
                    setPrice(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="예: 19000"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-700">
                  카테고리 *
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="예: 스킨케어 / 푸드 / 리빙 ..."
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700">
                상품 설명
              </label>
              <textarea
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="인플루언서/바이어에게 설명할 핵심 포인트를 적어 주세요."
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700">
                추천 타깃
              </label>
              <textarea
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
                rows={2}
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="예: 스킨케어 인플루언서, 뷰티샵 MD ..."
              />
            </div>

            {message && (
              <p className="text-sm text-zinc-700">{message}</p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="mt-2 w-full rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {saving
                ? "저장 중..."
                : editingId
                ? "상품 수정하기"
                : "상품 등록하기"}
            </button>
          </form>
        </section>

        {/* 상품 목록 테이블 */}
        <section className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900">
              등록된 상품 목록
            </h2>
            <button
              type="button"
              onClick={loadProducts}
              className="text-xs text-zinc-500 underline-offset-4 hover:underline"
            >
              새로고침
            </button>
          </div>

          {loadingList ? (
            <p className="text-sm text-zinc-500">목록을 불러오는 중입니다...</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-zinc-500">
              아직 등록된 상품이 없습니다.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-zinc-200 text-xs text-zinc-500">
                  <tr>
                    <th className="py-2 pr-4">상품명</th>
                    <th className="py-2 pr-4">브랜드</th>
                    <th className="py-2 pr-4">카테고리</th>
                    <th className="py-2 pr-4 text-right">가격</th>
                    <th className="py-2 pr-4 text-right">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-zinc-100 last:border-0"
                    >
                      <td className="py-2 pr-4">{p.name}</td>
                      <td className="py-2 pr-4">{p.brand}</td>
                      <td className="py-2 pr-4">{p.category}</td>
                      <td className="py-2 pr-4 text-right">
                        {p.price.toLocaleString()}원
                      </td>
                      <td className="py-2 pr-4 text-right">
                        <button
                          type="button"
                          onClick={() => startEdit(p)}
                          className="mr-2 text-xs text-zinc-700 underline-offset-4 hover:underline"
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="text-xs text-red-600 underline-offset-4 hover:underline"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}