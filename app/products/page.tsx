"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/context/CartContext";

type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);

  const { addItem } = useCart();

  async function fetchProducts() {
    setLoading(true);

    let query = supabase
      .from("products")
      .select("id, name, brand, price, category")
      .order("name", { ascending: true });

    // 검색어가 있으면 name, brand 둘 다 검색
    if (search.trim() !== "") {
      const keyword = `%${search.trim()}%`;
      query = query.or(`name.ilike.${keyword},brand.ilike.${keyword}`);
    }

    // 카테고리 필터
    if (categoryFilter !== "all") {
      query = query.eq("category", categoryFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      setProducts([]);
    } else {
      setProducts(data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    // 초기 로딩 + 카테고리 목록 추출
    async function init() {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, brand, price, category")
        .order("name", { ascending: true });

      if (error) {
        console.error("Supabase error:", error);
        setProducts([]);
        setCategories([]);
      } else {
        const items = data ?? [];
        setProducts(items);
        const uniqueCategories = Array.from(
          new Set(items.map((p) => p.category).filter(Boolean))
        );
        setCategories(uniqueCategories);
      }
      setLoading(false);
    }

    init();
  }, []);

  // 검색어/카테고리가 바뀔 때마다 다시 조회
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoryFilter]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">상품 목록</h1>
            <p className="mt-1 text-sm text-zinc-600">
              인플루언서 및 B2B 바이어를 위한 브랜드 상품 카탈로그입니다.
            </p>
          </div>
          <div className="flex gap-3 text-sm">
            <Link
              href="/cart"
              className="text-zinc-600 underline-offset-4 hover:underline"
            >
              장바구니 보기
            </Link>
            <Link
              href="/"
              className="text-zinc-600 underline-offset-4 hover:underline"
            >
              홈으로
            </Link>
          </div>
        </header>

        {/* 검색 / 필터 영역 */}
        <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="상품명 또는 브랜드로 검색"
              className="w-full rounded-full border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              className="w-full rounded-full border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black bg-white"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">전체 카테고리</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </section>

        {loading ? (
          <p className="text-sm text-zinc-500">상품을 불러오는 중입니다...</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-zinc-500">
            조건에 맞는 상품이 없습니다. 검색어 또는 필터를 조정해 보세요.
          </p>
        ) : (
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="group rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <Link href={`/products/${product.id}`}>
                  <div className="mb-3 text-xs font-medium text-zinc-500">
                    {product.brand} · {product.category}
                  </div>
                  <h2 className="mb-1 text-base font-semibold group-hover:text-black">
                    {product.name}
                  </h2>
                  <div className="mb-2 text-sm font-medium text-zinc-900">
                    {product.price.toLocaleString()}원 (도매 기준 샘플)
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      productId: product.id,
                      name: product.name,
                      price: product.price,
                    })
                  }
                  className="mt-1 w-full rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-100"
                >
                  장바구니에 담기
                </button>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}