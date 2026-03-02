import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

type OrderItemPayload = {
  productId: string;
  quantity: number;
  unitPrice: number;
};

export async function POST(request: Request) {
  const body = await request.json();
  const {
    contactName,
    contactEmail,
    contactChannel,
    message,
    items,
  }: {
    contactName: string;
    contactEmail?: string;
    contactChannel?: string;
    message?: string;
    items: OrderItemPayload[];
  } = body;

  if (!contactName || !items || items.length === 0) {
    return NextResponse.json(
      { ok: false, message: "필수 정보가 부족합니다." },
      { status: 400 }
    );
  }

  // 1) orders 테이블에 주문 기본 정보 생성
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      contact_name: contactName,
      contact_email: contactEmail || null,
      contact_channel: contactChannel || null,
      message: message || null,
      status: "requested",
    })
    .select("id")
    .single();

  if (orderError || !orderData) {
    console.error(orderError);
    return NextResponse.json(
      { ok: false, message: "주문 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }

  const orderId = orderData.id;

  // 2) order_items 테이블에 항목들 생성
  const itemsPayload = items.map((item) => ({
    order_id: orderId,
    product_id: item.productId,
    quantity: item.quantity,
    unit_price: item.unitPrice,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsPayload);

  if (itemsError) {
    console.error(itemsError);
    return NextResponse.json(
      {
        ok: false,
        message: "주문 상품 저장 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, orderId });
}