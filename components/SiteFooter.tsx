export default function SiteFooter() {
    return (
      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} ABU Commerce. All rights reserved.</div>
          <div className="flex gap-3">
            <span>인플루언서 · B2B 상품 공급 플랫폼</span>
          </div>
        </div>
      </footer>
    );
  }