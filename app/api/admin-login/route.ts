import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { ok: false, message: "관리자 비밀번호가 설정되어 있지 않습니다." },
      { status: 500 }
    );
  }

  if (password !== adminPassword) {
    return NextResponse.json(
      { ok: false, message: "비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });

  // 아주 단순한 쿠키 (실서비스라면 만료시간/보안옵션 더 고려 필요)
  res.cookies.set("admin_auth", adminPassword, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return res;
}