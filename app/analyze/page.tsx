'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import UploadArea from '@/components/UploadArea';
import ScoreRing from '@/components/ScoreRing';
import { analyzeOutfit } from '@/lib/ai/analyzer';
import { clearPhoto, loadPhoto, savePhoto } from '@/lib/image-store';
import type { AnalysisResult } from '@/lib/ai/types';

type Phase = 'idle' | 'loading' | 'done' | 'error';

const LOADING_STEPS = [
  '正在读取照片的色彩信息…',
  '分析配色与明暗层次…',
  '整理可执行的搭配建议…',
  '生成造型师点评…',
];

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState(0);

  const runAnalysis = useCallback(async (target: File) => {
    setPhase('loading');
    setError('');
    setStep(0);
    const timers = LOADING_STEPS.map((_, index) =>
      window.setTimeout(() => setStep(index), index * 620),
    );

    try {
      const data = await analyzeOutfit(target);
      setResult(data);
      setPhase('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析过程中出现错误，请重试。');
      setPhase('error');
    } finally {
      timers.forEach(clearTimeout);
    }
  }, []);

  useEffect(() => {
    const restored = loadPhoto();
    if (restored) {
      setFile(restored);
      setPreviewUrl(URL.createObjectURL(restored));
    }
    const auto = sessionStorage.getItem('style-lab:auto-analyze');
    if (auto === '1' && restored) {
      sessionStorage.removeItem('style-lab:auto-analyze');
      void runAnalysis(restored);
    }
  }, [runAnalysis]);

  const handleFileChange = (nextFile: File | null, nextUrl: string | null) => {
    setFile(nextFile);
    setPreviewUrl(nextUrl);
    setResult(null);
    setError('');
    setPhase('idle');
  };

  const handleAnalyze = async () => {
    if (!file) return;
    await savePhoto(file);
    void runAnalysis(file);
  };

  const handleReset = () => {
    clearPhoto();
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError('');
    setPhase('idle');
  };

  return (
    <>
      <TopBar />

      <section className="flex items-start justify-between px-6 pt-2">
        <div>
          <p className="editorial-label">AI STYLE ANALYSIS</p>
          <h1 className="editorial-title mt-4 text-[34px]">穿搭分析</h1>
          <p className="mt-2 text-[12px] leading-relaxed text-muted">
            认真看一次，你的搭配哪里做对了。
          </p>
        </div>
        {previewUrl && phase !== 'done' && (
          <div className="magazine-image h-[76px] w-[58px] shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="待分析照片" className="h-full w-full object-cover" />
          </div>
        )}
      </section>

      {/* ---------- 上传与启动 ---------- */}
      {phase !== 'done' && (
        <div className="mt-8 px-6">
          <UploadArea file={file} previewUrl={previewUrl} onChange={handleFileChange} />

          {phase === 'idle' && (
            <button
              type="button"
              onClick={() => void handleAnalyze()}
              disabled={!file}
              className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:bg-sand disabled:text-muted"
            >
              开始分析 <span className="text-[16px] leading-none">→</span>
            </button>
          )}

          {phase === 'loading' && (
            <div className="fade-up mt-6 border border-sand bg-white/50 px-6 py-10 text-center">
              <div className="mx-auto mb-6 h-px w-12 overflow-hidden bg-sand">
                <div className="h-px w-1/2 bg-olive shimmer" />
              </div>
              <p className="font-serif text-[16px] text-ink">{LOADING_STEPS[step]}</p>
              <p className="editorial-label mt-4">ANALYZING</p>
            </div>
          )}

          {phase === 'error' && (
            <div className="mt-6 border border-[#9B4A3F]/30 bg-white/50 p-5">
              <p className="text-[12px] leading-relaxed text-[#9B4A3F]">{error}</p>
              <button
                type="button"
                onClick={() => file && void runAnalysis(file)}
                className="btn-ghost mt-4"
              >
                重试
              </button>
            </div>
          )}

          <p className="mt-4 text-center text-[11px] leading-relaxed text-muted">
            照片仅在你的设备内处理，不会上传或保存。
          </p>
        </div>
      )}

      {/* ---------- 分析结果 ---------- */}
      {phase === 'done' && result && (
        <div className="mt-8 px-6 fade-up">
          {/* 模式标识：绝不把演示包装成真实 AI */}
          <div
            className={`border px-4 py-3 ${
              result.mode === 'demo' ? 'border-sand bg-white/50' : 'border-olive/50 bg-white/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 ${result.mode === 'demo' ? 'bg-muted' : 'bg-olive'}`} />
              <span className="editorial-label">
                {result.mode === 'demo' ? 'DEMO ANALYSIS' : 'AI ANALYSIS'}
              </span>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted">
              {result.mode === 'demo'
                ? '演示分析 · 基于照片色彩特征生成，非真实 AI 视觉识别'
                : '由视觉模型生成的分析结果'}
            </p>
          </div>

          {/* 综合评分 */}
          <div className="mt-11 flex flex-col items-center">
            <p className="editorial-label">OVERALL SCORE</p>
            <div className="mt-5">
              <ScoreRing score={result.overall.score} />
            </div>
            <p className="mt-5 max-w-[310px] text-center font-serif text-[16px] leading-[1.8] text-ink">
              {result.overall.verdict}
            </p>
          </div>

          {/* 照片观察 */}
          <div className="hairline mt-11 pt-7">
            <p className="editorial-label">OBSERVED FROM PHOTO</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.observed.dominantColors.map((color) => (
                <span key={color} className="border border-sand px-3 py-1.5 text-[11px] text-muted">
                  {color}
                </span>
              ))}
            </div>
            <p className="mt-4 text-[12px] leading-[1.8] text-muted">
              {result.observed.tone} · {result.observed.paletteNote}
            </p>
          </div>

          {/* 五维度 */}
          <section className="mt-12">
            <p className="editorial-label">FIVE DIMENSIONS</p>
            <h2 className="editorial-title mt-3 text-[25px]">多维度分析</h2>
            <div className="mt-7 space-y-7">
              {result.dimensions.map((dimension, index) => (
                <div key={dimension.key} className="fade-up" style={{ animationDelay: `${index * 80}ms` }}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[13px] text-ink">{dimension.label}</span>
                    <span className="font-serif text-[18px] text-ink">
                      {dimension.score}
                      <span className="ml-1 text-[10px] text-muted">/ 100</span>
                    </span>
                  </div>
                  <div className="mt-3 h-[2px] w-full bg-sand">
                    <div
                      className="h-full bg-olive transition-all duration-1000"
                      style={{ width: `${dimension.score}%` }}
                    />
                  </div>
                  <p className="mt-2.5 text-[11px] leading-[1.75] text-muted">{dimension.comment}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 穿搭优点 */}
          <section className="hairline mt-14 pt-8">
            <p className="editorial-label">WHAT WORKS</p>
            <h2 className="editorial-title mt-3 text-[25px]">穿搭优点</h2>
            <ul className="mt-6 space-y-4">
              {result.strengths.map((item, index) => (
                <li key={index} className="flex gap-4">
                  <span className="editorial-label pt-1">0{index + 1}</span>
                  <p className="text-[12px] leading-[1.85] text-ink">{item}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* 改进建议 */}
          <section className="hairline mt-14 pt-8">
            <p className="editorial-label">ROOM TO REFINE</p>
            <h2 className="editorial-title mt-3 text-[25px]">改进建议</h2>
            <ul className="mt-6 space-y-4">
              {result.suggestions.map((item, index) => (
                <li key={index} className="flex gap-4">
                  <span className="editorial-label pt-1 text-olive">0{index + 1}</span>
                  <p className="text-[12px] leading-[1.85] text-ink">{item}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* 如果这样搭配 */}
          <section className="hairline mt-14 pt-8">
            <p className="editorial-label">IF / THEN</p>
            <h2 className="editorial-title mt-3 text-[25px]">如果这样搭配</h2>
            <p className="mt-2 text-[11px] text-muted">把建议落到具体单品，而不只是理论。</p>
            <div className="mt-6 space-y-5">
              {result.alternatives.map((item, index) => (
                <div key={index} className="border border-sand bg-white p-5">
                  <p className="editorial-label">OPTION 0{index + 1}</p>
                  <div className="mt-4 space-y-3">
                    <div>
                      <span className="text-[10px] text-muted">原搭配</span>
                      <p className="mt-1 text-[12px] text-muted line-through decoration-[#858078]/60">
                        {item.from}
                      </p>
                    </div>
                    <div className="text-[14px] text-olive">↓</div>
                    <div>
                      <span className="editorial-label text-olive">优化方案</span>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-ink">{item.to}</p>
                    </div>
                  </div>
                  <p className="mt-4 border-t border-sand pt-3 text-[11px] leading-[1.8] text-muted">
                    {item.reason}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 造型师点评 */}
          <section className="hairline mt-14 pt-8">
            <p className="editorial-label">STYLIST NOTE</p>
            <h2 className="editorial-title mt-3 text-[25px]">造型师点评</h2>
            <p className="mt-6 border-l-2 border-olive pl-5 font-serif text-[14px] leading-[2] text-ink">
              {result.summary}
            </p>
          </section>

          {result.disclaimer && (
            <div className="mt-10 bg-sand/40 p-4">
              <p className="text-[10px] leading-[1.9] text-muted">{result.disclaimer}</p>
            </div>
          )}

          <div className="mt-8 grid grid-cols-2 gap-3">
            <button type="button" onClick={handleReset} className="btn-ghost w-full">
              重新上传
            </button>
            <Link href="/inspiration" className="btn-ghost w-full">
              看看灵感
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
