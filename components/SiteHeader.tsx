"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/products", label: "상품 목록" },
  { href: "/cart", label: "장바구니" },
  { href: "/admin/orders", label: "관리자" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-black text-center text-xs font-bold leading-7 text-white">
            AB
          </div>
          <div className="text-sm font-semibold tracking-tight">
            ABU Commerce
          </div>
        </Link>
        <nav className="flex items-center gap-4 text-xs sm:text-sm">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "rounded-full px-3 py-1 transition " +
                  (active
                    ? "bg-black text-white"
                    : "text-zinc-600 hover:bg-zinc-100")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}