'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  {
    href: '/',
    label: '首页',
    en: 'HOME',
    icon: (
      <path d="M3 10.6 12 3.2l9 7.4V20a1 1 0 0 1-1 1h-5v-6.5H9V21H4a1 1 0 0 1-1-1v-9.4Z" />
    ),
  },
  {
    href: '/analyze',
    label: '穿搭分析',
    en: 'ANALYZE',
    icon: (
      <>
        <path d="m12 2.5 2.1 6.4L20.5 11l-6.4 2.1L12 19.5l-2.1-6.4L3.5 11l6.4-2.1L12 2.5Z" />
        <path d="M18.5 17.5 19.3 20l2.5.8-2.5.8-.8 2.4-.8-2.4-2.5-.8 2.5-.8.8-2.5Z" />
      </>
    ),
  },
  {
    href: '/inspiration',
    label: '穿搭灵感',
    en: 'LOOKBOOK',
    icon: (
      <>
        <rect x="3" y="3" width="7.5" height="7.5" />
        <rect x="13.5" y="3" width="7.5" height="7.5" />
        <rect x="3" y="13.5" width="7.5" height="7.5" />
        <rect x="13.5" y="13.5" width="7.5" height="7.5" />
      </>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname() || '/';

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/analyze') return pathname.startsWith('/analyze');
    return pathname.startsWith('/inspiration') || pathname.startsWith('/season');
  };

  return (
    <nav
      aria-label="主导航"
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2
                 border-t border-sand bg-cream/95 backdrop-blur-md"
    >
      <div className="grid grid-cols-3">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`group flex flex-col items-center justify-center gap-1.5 py-3.5
                          transition-colors duration-300 ${
                            active ? 'text-olive' : 'text-muted hover:text-ink'
                          }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.35"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[22px] w-[22px]"
                aria-hidden="true"
              >
                {item.icon}
              </svg>
              <span className={`text-[10px] tracking-[0.08em] ${active ? 'text-ink' : ''}`}>
                {item.label}
              </span>
              <span className="text-[7px] tracking-editorial text-muted/70">{item.en}</span>
            </Link>
          );
        })}
      </div>
      {/* iPhone Home Indicator 安全区 */}
      <div className="h-[env(safe-area-inset-bottom)] bg-cream" />
    </nav>
  );
}
