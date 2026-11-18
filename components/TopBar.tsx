'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TopBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between px-6 pb-4 pt-6">
        <Link href="/" className="editorial-title text-[15px] tracking-[0.04em]">
          STYLE <span className="text-muted">/</span> 穿搭研究所
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? '关闭菜单' : '打开菜单'}
          className="flex h-9 w-9 flex-col items-center justify-center gap-[5px]
                     text-ink transition-opacity hover:opacity-60"
        >
          <span
            className={`block h-px w-5 bg-current transition-transform duration-300 ${
              open ? 'translate-y-[3px] rotate-45' : ''
            }`}
          />
          <span
            className={`block h-px w-5 bg-current transition-transform duration-300 ${
              open ? '-translate-y-[3px] -rotate-45' : ''
            }`}
          />
        </button>
      </header>

      {open && (
        <div className="fade-up hairline-bottom border-b bg-cream px-6 pb-7 pt-2">
          <p className="editorial-label mb-5">INDEX</p>
          <nav className="flex flex-col gap-4">
            {[
              { href: '/', cn: '首页', en: 'Home' },
              { href: '/analyze', cn: '穿搭分析', en: 'AI Analysis' },
              { href: '/inspiration', cn: '穿搭灵感', en: 'Lookbook' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="group flex items-baseline justify-between border-b border-sand pb-3"
              >
                <span className="font-serif text-[19px] text-ink">{item.cn}</span>
                <span className="editorial-label transition-colors group-hover:text-olive">
                  {item.en} ↗
                </span>
              </Link>
            ))}
          </nav>
          <p className="mt-6 text-[11px] leading-relaxed text-muted">
            一个轻量的个人穿搭顾问。少一点噪音，多一点关于风格的判断。
          </p>
        </div>
      )}
    </>
  );
}
