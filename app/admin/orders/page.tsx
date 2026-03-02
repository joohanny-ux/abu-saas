"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Order = {
  id: number; // orders.id 가 int8 이므로 number
  contact_name: string;
  contact_email: string | null;
  contact_channel: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

type OrderItem = {
  id: string;
  order_id: number;
  product_id: string;
  quantity: number;
  unit_price: number;
};

type ProductInfo = {
  id: string;
  name: string;
  brand: string | null;
};

const STATUS_OPTIONS = [
  "all",
  "requested",
  "reviewing",
  "confirmed",
  "closed",
] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [itemsByOrder, setItemsByOrder] = useState<Record<number, OrderItem[]>>(
    {}
  );
  const [productsMap, setProductsMap] = useState<
    Record<string, ProductInfo>
  >({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_OPTIONS)[number]>("all");
  const [search, setSearch] = useState("");
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null);

  async function loadOrders() {
    setLoading(true);

    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select(
        "id, contact_name, contact_email, contact_channel, message, status, created_at"
      )
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("ordersError", ordersError);
      setOrders([]);
      setItemsByOrder({});
      setProductsMap({});
      setLoading(false);
      return;
    }

    const orderList = (ordersData ?? []) as Order[];
    const orderIds = orderList.map((o) => o.id);

    // order_items
    let allItems: OrderItem[] = [];
    if (orderIds.length > 0) {
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("id, order_id, product_id, quantity, unit_price")
        .in("order_id", orderIds);

      if (itemsError) {
        console.error("itemsError", itemsError);
        allItems = [];
      } else {
        allItems = (itemsData ?? []) as OrderItem[];
      }
    }

    const mapByOrder: Record<number, OrderItem[]> = {};
    allItems.forEach((item) => {
      if (!mapByOrder[item.order_id]) mapByOrder[item.order_id] = [];
      mapByOrder[item.order_id].push(item);
    });
    setItemsByOrder(mapByOrder);

    // products
    const productIds = Array.from(
      new Set(allItems.map((i) => i.product_id))
    );
    if (productIds.length > 0) {
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("id, name, brand")
        .in("id", productIds);

      if (productsError) {
        console.error("productsError", productsError);
        setProductsMap({});
      } else {
        const pMap: Record<string, ProductInfo> = {};
        (productsData ?? []).forEach((p) => {
          pMap[p.id] = p as ProductInfo;
        });
        setProductsMap(pMap);
      }
    } else {
      setProductsMap({});
    }

    setOrders(orderList);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(id: number, status: string) {
    setUpdatingId(id);
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("상태 변경 중 오류가 발생했습니다.");
    } else {
      await loadOrders();
    }
    setUpdatingId(null);
  }

  function formatDate(value: string) {
    const d = new Date(value);
    return d.toLocaleString();
  }

  // 필터 + 검색 적용
  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) return false;

    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();

    const inBasic =
      order.contact_name.toLowerCase().includes(q) ||
      (order.contact_email ?? "").toLowerCase().includes(q) ||
      (order.contact_channel ?? "").toLowerCase().includes(q) ||
      (order.message ?? "").toLowerCase().includes(q);

    const items = itemsByOrder[order.id] || [];
    const inItems = items.some((item) => {
      const p = productsMap[item.product_id];
      return (
        p?.name.toLowerCase().includes(q) ||
        (p?.brand ?? "").toLowerCase().includes(q)
      );
    });

    return inBasic || inItems;
  });

  const activeOrder =
    activeOrderId != null
      ? filteredOrders.find((o) => o.id === activeOrderId) ??
        orders.find((o) => o.id === activeOrderId) ??
        null
      : null;
  const activeItems = activeOrder
    ? itemsByOrder[activeOrder.id] || []
    : ([] as OrderItem[]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">관리자 · 주문/견적 요청 목록</h1>
            <p className="mt-1 text-sm text-zinc-600">
              인플루언서·B2B 바이어가 장바구니에서 보낸 주문/견적 요청을
              확인합니다.
            </p>
          </div>
          <div className="flex gap-3 text-sm">
            <Link
              href="/admin/products"
              className="text-zinc-600 underline-offset-4 hover:underline"
            >
              상품 관리
            </Link>
            <Link
              href="/"
              className="text-zinc-600 underline-offset-4 hover:underline"
            >
              홈으로
            </Link>
          </div>
        </header>

        {/* 필터 / 검색 영역 */}
        <section className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-zinc-600">
              상태 필터
            </span>
            <div className="flex flex-wrap gap-1">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={
                    "rounded-full px-3 py-1 text-xs transition " +
                    (statusFilter === s
                      ? "bg-black text-white"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200")
                  }
                >
                  {s === "all" ? "전체" : s}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="주문자/이메일/연락처/메모/상품명 검색"
              className="w-full rounded-full border border-zinc-300 px-4 py-2 text-xs outline-none focus:border-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>

        {/* 주문 리스트 (테이블 형태) */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900">
              들어온 주문 / 견적 요청
            </h2>
            <button
              type="button"
              onClick={loadOrders}
              className="text-xs text-zinc-500 underline-offset-4 hover:underline"
            >
              새로고침
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-zinc-500">
              주문 목록을 불러오는 중입니다...
            </p>
          ) : filteredOrders.length === 0 ? (
            <p className="text-sm text-zinc-500">
              조건에 맞는 주문/견적 요청이 없습니다.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-zinc-200 bg-zinc-50 text-[11px] text-zinc-500 sm:text-xs">
                  <tr>
                    <th className="py-2 pr-3">시간</th>
                    <th className="py-2 pr-3">주문자</th>
                    <th className="py-2 pr-3">연락 채널</th>
                    <th className="py-2 pr-3">요청 메모</th>
                    <th className="py-2 pr-3">상품 개수</th>
                    <th className="py-2 pr-3">상태</th>
                    <th className="py-2 pr-3 text-right">상세</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const items = itemsByOrder[order.id] || [];
                    const itemCount = items.length;
                    return (
                      <tr
                        key={order.id}
                        className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50"
                      >
                        <td className="py-2 pr-3 align-top text-[11px] text-zinc-500 sm:text-xs">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="py-2 pr-3 align-top">
                          <div className="font-medium">
                            {order.contact_name}
                          </div>
                          {order.contact_email && (
                            <div className="text-[11px] text-zinc-500">
                              {order.contact_email}
                            </div>
                          )}
                        </td>
                        <td className="py-2 pr-3 align-top text-[11px] text-zinc-600 sm:text-xs">
                          {order.contact_channel || "-"}
                        </td>
                        <td className="py-2 pr-3 align-top text-[11px] text-zinc-600 sm:text-xs">
                          {order.message
                            ? order.message.length > 40
                              ? order.message.slice(0, 40) + "..."
                              : order.message
                            : "-"}
                        </td>
                        <td className="py-2 pr-3 align-top text-[11px] sm:text-xs">
                          {itemCount}개
                        </td>
                        <td className="py-2 pr-3 align-top">
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-white">
                              {order.status}
                            </span>
                            <select
                              value={order.status}
                              disabled={updatingId === order.id}
                              onChange={(e) =>
                                updateStatus(order.id, e.target.value)
                              }
                              className="rounded-full border border-zinc-300 px-2 py-0.5 text-[10px] outline-none focus:border-black bg-white"
                            >
                              <option value="requested">requested</option>
                              <option value="reviewing">reviewing</option>
                              <option value="confirmed">confirmed</option>
                              <option value="closed">closed</option>
                            </select>
                          </div>
                        </td>
                        <td className="py-2 pr-3 text-right align-top">
                          <button
                            type="button"
                            onClick={() => setActiveOrderId(order.id)}
                            className="rounded-full border border-zinc-300 px-3 py-1 text-[11px] text-zinc-700 hover:bg-zinc-100"
                          >
                            상세 보기
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* 상세 모달 */}
        {activeOrder && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3">
                <h2 className="text-sm font-semibold text-zinc-900">
                  주문 상세 · #{activeOrder.id}
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveOrderId(null)}
                  className="text-xs text-zinc-500 hover:text-zinc-800"
                >
                  닫기
                </button>
              </div>
              <div className="max-h-[80vh] space-y-4 overflow-y-auto px-5 py-4 text-sm">
                <section className="space-y-1">
                  <div className="text-xs text-zinc-500">
                    {formatDate(activeOrder.created_at)}
                  </div>
                  <div className="font-semibold">
                    {activeOrder.contact_name}
                    {activeOrder.contact_email && (
                      <span className="ml-2 text-xs text-zinc-500">
                        ({activeOrder.contact_email})
                      </span>
                    )}
                  </div>
                  {activeOrder.contact_channel && (
                    <div className="text-xs text-zinc-600">
                      연락 채널: {activeOrder.contact_channel}
                    </div>
                  )}
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-zinc-800 px-2 py-0.5 font-medium text-white">
                      {activeOrder.status}
                    </span>
                  </div>
                </section>

                <section className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-700">
                  <div className="font-semibold text-zinc-900">
                    요청 메모
                  </div>
                  <div className="whitespace-pre-wrap">
                    {activeOrder.message || "요청 메모가 없습니다."}
                  </div>
                </section>

                <section className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-700">
                  <div className="font-semibold text-zinc-900">
                    요청 상품
                  </div>
                  {activeItems.length === 0 ? (
                    <div className="text-zinc-500">
                      연결된 상품 정보가 없습니다.
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {activeItems.map((item) => {
                        const p = productsMap[item.product_id];
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <div className="font-medium">
                                {p?.name || "상품 이름 없음"}
                              </div>
                              {p?.brand && (
                                <div className="text-[11px] text-zinc-500">
                                  {p.brand}
                                </div>
                              )}
                            </div>
                            <div className="text-right text-[11px]">
                              <div>
                                수량: {item.quantity.toLocaleString()}개
                              </div>
                              <div>
                                단가: {item.unit_price.toLocaleString()}원
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}