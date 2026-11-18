import Link from 'next/link';
import { notFound } from 'next/navigation';
import TopBar from '@/components/TopBar';
import ImageWithFallback from '@/components/ImageWithFallback';
import { seasons, seasonByKey } from '@/lib/data/looks';
import { assetPath } from '@/lib/utils';

export function generateStaticParams() {
  return seasons.map((season) => ({ season: season.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ season: string }> }) {
  const { season: key } = await params;
  const season = seasonByKey(key);
  return {
    title: season ? `${season.nameZh}穿搭灵感 / STYLE` : '穿搭灵感 / STYLE',
    description: season?.description,
  };
}

export default async function SeasonPage({ params }: { params: Promise<{ season: string }> }) {
  const { season: key } = await params;
  const season = seasonByKey(key);
  if (!season) notFound();

  const others = seasons.filter((item) => item.key !== season.key);

  return (
    <>
      <TopBar />

      {/* ---------- 季节封面 ---------- */}
      <section className="px-6 pt-2">
        <div className="flex items-end justify-between">
          <div>
            <p className="editorial-label">SEASONAL EDITION</p>
            <h1 className="editorial-title mt-4 text-[38px] leading-none">{season.nameZh}</h1>
          </div>
          <span className="editorial-label pb-1">{season.nameEn}</span>
        </div>
        <p className="mt-4 font-serif text-[15px] leading-[1.8] text-ink">{season.tagline}</p>
        <p className="mt-3 text-[12px] leading-[1.9] text-muted">{season.description}</p>
      </section>

      <div className="mt-7 px-6">
        <div className="magazine-image aspect-[3/4]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={season.cover} alt={`${season.nameZh}穿搭封面`} className="h-full w-full object-cover" />
        </div>
      </div>

      {/* ---------- 案例列表 ---------- */}
      <div className="mt-12 px-6">
        {season.looks.map((look, index) => (
          <article key={look.id} className={index === 0 ? '' : 'mt-16'}>
            <div className="flex items-baseline justify-between">
              <span className="editorial-label">LOOK 0{index + 1}</span>
              <span className="text-[10px] tracking-[0.06em] text-muted">{look.scene}</span>
            </div>

            <div className="mt-3">
              <ImageWithFallback
                src={look.image}
                fallback={season.cover}
                alt={`${look.name}穿搭案例`}
                className="aspect-[3/4]"
              />
            </div>

            <div className="mt-5">
              <h2 className="editorial-title text-[23px]">{look.name}</h2>
              <p className="mt-1.5 text-[11px] text-muted">适合场景：{look.scene}</p>

              <dl className="mt-6 space-y-3">
                <DetailRow label="上装" value={look.top} />
                <DetailRow label="下装" value={look.bottom} />
                <DetailRow label="鞋履" value={look.shoes} />
                <DetailRow label="配饰" value={look.accessories} />
              </dl>

              <div className="hairline mt-6 pt-5">
                <p className="editorial-label">COLOR PALETTE</p>
                <div className="mt-3 flex gap-1.5">
                  {look.colors.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="h-9 flex-1 border border-sand/60"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <p className="mt-3 text-[11px] leading-[1.9] text-muted">{look.palette}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* ---------- 其他季节 ---------- */}
      <section className="mt-16 px-6">
        <div className="hairline pt-8">
          <p className="editorial-label">OTHER SEASONS</p>
          <h2 className="editorial-title mt-3 text-[23px]">换个季节看看</h2>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {others.map((item) => (
              <Link
                key={item.key}
                href={`/season/${item.key}`}
                className="group border border-sand bg-white/50 px-2 py-4 text-center transition-colors hover:border-olive"
              >
                <span className="editorial-label block transition-colors group-hover:text-olive">
                  {item.nameEn}
                </span>
                <span className="mt-1.5 block text-[12px] text-ink">{item.nameZh}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-12 px-6 text-center">
        <Link href="/inspiration" className="btn-ghost">
          ← 返回全部灵感
        </Link>
      </div>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 border-b border-sand pb-3">
      <dt className="editorial-label w-10 shrink-0 pt-1">{label}</dt>
      <dd className="text-[12px] leading-[1.8] text-ink">{value}</dd>
    </div>
  );
}
