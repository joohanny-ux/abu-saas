"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, brand, price, category, description, target")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error(error);
        setProduct(null);
      } else {
        setProduct(data as Product);
      }
      setLoading(false);
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900">
        <main className="mx-auto max-w-3xl px-6 py-10">
          <p className="text-sm text-zinc-500">상품 정보를 불러오는 중입니다...</p>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900">
        <main className="mx-auto max-w-3xl px-6 py-10">
          <p className="mb-4 text-sm text-zinc-500">상품을 찾을 수 없습니다.</p>
          <Link
            href="/products"
            className="text-sm text-zinc-600 underline-offset-4 hover:underline"
          >
            상품 목록으로 돌아가기
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-3xl px-6 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-wide text-zinc-500">
            {product.brand} · {product.category}
          </div>
          <Link
            href="/products"
            className="text-sm text-zinc-600 underline-offset-4 hover:underline"
          >
            상품 목록으로
          </Link>
        </div>

        <section className="space-y-3">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="text-lg font-semibold text-zinc-900">
            도매 기준: {product.price.toLocaleString()}원
          </div>
          <p className="text-sm text-zinc-600">
            실제 공급 단가와 최소 수량은 문의 후 확정됩니다.
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">상품 설명</h2>
            <p className="mt-1 text-sm text-zinc-700">
              {product.description || "아직 등록된 설명이 없습니다."}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">추천 타깃</h2>
            <p className="mt-1 text-sm text-zinc-700">
              {product.target || "추천 타깃 정보가 아직 없습니다."}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">
              협업 / 공급 문의
            </h2>
            <p className="mt-1 text-sm text-zinc-700">
              인플루언서/리셀러/MD 분들은 이후 버전에서 추가될 주문/견적 기능을
              통해 협업·입점·도매 공급을 요청하실 수 있습니다. 현재는 테스트
              단계입니다.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}