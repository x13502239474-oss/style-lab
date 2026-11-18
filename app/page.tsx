'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar';
import UploadArea from '@/components/UploadArea';
import { seasons } from '@/lib/data/looks';
import { assetPath } from '@/lib/utils';
import { savePhoto } from '@/lib/image-store';

export default function HomePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const goToAnalysis = async () => {
    if (file) {
      await savePhoto(file);
      sessionStorage.setItem('style-lab:auto-analyze', '1');
    }
    router.push('/analyze');
  };

  return (
    <>
      <TopBar />

      {/* ---------- 封面视觉 ---------- */}
      <section className="px-6 pt-2">
        <div className="fade-up flex items-center gap-3">
          <span className="editorial-label">ISSUE 01</span>
          <span className="h-px w-8 bg-sand" />
          <span className="editorial-label">PERSONAL STYLE</span>
        </div>
        <h1 className="editorial-title fade-up delay-1 mt-5 text-[40px] leading-[1.16]">
          穿出你的
          <br />
          风格<span className="text-olive">。</span>
        </h1>
        <p className="fade-up delay-2 mt-3 text-[13px] leading-[1.8] text-muted">
          让每一次穿搭，都更接近理想中的自己。
        </p>
      </section>

      {/* ---------- AI 拍照入口：前置到手机首屏 ---------- */}
      <section className="mt-7 px-6">
        <div className="hairline pt-6">
          <p className="editorial-label">AI STYLE ANALYSIS</p>
          <h2 className="editorial-title mt-2.5 text-[25px] leading-snug">今天穿得怎么样？</h2>
          <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
            上传一张全身穿搭照片，让AI为你分析。
          </p>
        </div>

        <button type="button" onClick={() => void goToAnalysis()} className="btn-primary mt-5 w-full">
          {file ? '分析这张照片' : '开始穿搭分析'}
          <span className="text-[16px] leading-none">→</span>
        </button>

        <div className="mt-5">
          <UploadArea
            file={file}
            previewUrl={previewUrl}
            onChange={(nextFile, nextUrl) => {
              setFile(nextFile);
              setPreviewUrl(nextUrl);
            }}
          />
        </div>
      </section>

      {/* ---------- 封面摄影：压缩高度后移 ---------- */}
      <div className="fade-up mt-12 px-6">
        <div className="magazine-image aspect-[4/3]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetPath('/images/hero.jpg')} alt="穿搭研究所封面人物" className="h-full w-full object-cover object-[center_20%]" />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="editorial-label">A STUDY OF PERSONAL STYLE</span>
          <span className="editorial-label">01 / 04</span>
        </div>
      </div>

      {/* ---------- 四季入口 ---------- */}
      <section className="mt-20">
        <div className="flex items-end justify-between px-6">
          <div>
            <p className="editorial-label">SEASONAL INSPIRATION</p>
            <h2 className="editorial-title mt-3 text-[27px]">四季穿搭灵感</h2>
          </div>
          <Link href="/inspiration" className="pb-1 text-[11px] text-muted transition-colors hover:text-olive">
            全部 ↗
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 px-6">
          {seasons.map((season) => (
            <Link key={season.key} href={`/season/${season.key}`} className="group block">
              <div className="magazine-image aspect-[3/4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={season.cover}
                  alt={`${season.nameZh}穿搭灵感`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="editorial-label">{season.nameEn}</span>
                <span className="text-[11px] text-ink">{season.nameZh}</span>
              </div>
              <p className="mt-1 text-[11px] text-muted">{season.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-20 px-6 pb-6">
        <div className="hairline pt-6 text-center">
          <p className="editorial-label">STYLE / 穿搭研究所</p>
          <p className="mt-3 text-[11px] leading-relaxed text-muted">
            穿搭不是追逐潮流，是找到适合自己的表达。
          </p>
        </div>
      </footer>
    </>
  );
}
