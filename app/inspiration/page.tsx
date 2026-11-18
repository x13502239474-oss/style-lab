import Link from 'next/link';
import TopBar from '@/components/TopBar';
import { seasons } from '@/lib/data/looks';
import { assetPath } from '@/lib/utils';

export const metadata = {
  title: '穿搭灵感 / STYLE',
  description: '春夏秋冬四季穿搭案例，每套都附有具体单品与配色说明。',
};

export default function InspirationPage() {
  return (
    <>
      <TopBar />

      <section className="px-6 pt-2">
        <p className="editorial-label">THE LOOKBOOK</p>
        <h1 className="editorial-title mt-4 text-[34px]">四季穿搭灵感</h1>
        <p className="mt-3 max-w-[320px] text-[12px] leading-[1.8] text-muted">
          按季节整理的搭配参考。每套案例都写清楚穿了什么、怎么配色、适合什么场合。
        </p>
      </section>

      <div className="mt-9 space-y-11 px-6">
        {seasons.map((season, index) => (
          <Link key={season.key} href={`/season/${season.key}`} className="group block">
            <div className="magazine-image relative aspect-[16/11]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={season.cover}
                alt={`${season.nameZh}穿搭灵感`}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-ink/25" />
              <div className="absolute bottom-5 left-5">
                <span className="text-[10px] tracking-editorial text-white/85">{season.nameEn}</span>
                <p className="mt-1 font-serif text-[28px] leading-none text-white">{season.nameZh}</p>
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="text-[12px] text-muted">{season.tagline}</p>
              <span className="editorial-label transition-colors group-hover:text-olive">
                0{index + 1} ↗
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 px-6">
        <div className="hairline pt-6 text-center">
          <p className="editorial-label">END OF LOOKBOOK</p>
          <p className="mt-3 text-[11px] text-muted">灵感是起点，适合自己的才是答案。</p>
        </div>
      </div>
    </>
  );
}
