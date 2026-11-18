import type { Metadata, Viewport } from 'next';
import './globals.css';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'STYLE / 穿搭研究所',
  description: '上传一张穿搭照片，获得有参考价值的穿搭分析与四季搭配灵感。',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#F7F5F0',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="app-shell">
          <main className="pb-[104px]">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
