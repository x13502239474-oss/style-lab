'use client';

import { useEffect, useRef, useState } from 'react';
import { compressImage } from '@/lib/image-store';

interface Props {
  file: File | null;
  previewUrl: string | null;
  onChange: (file: File | null, previewUrl: string | null) => void;
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 15 * 1024 * 1024;

export default function UploadArea({ file, previewUrl, onChange }: Props) {
  const albumRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const reuploadRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const currentUrlRef = useRef<string | null>(null);

  useEffect(() => {
    currentUrlRef.current = previewUrl;
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (currentUrlRef.current) URL.revokeObjectURL(currentUrlRef.current);
    };
  }, []);

  const handleFile = async (candidate?: File) => {
    if (!candidate) return;
    setError('');

    if (!ACCEPTED.includes(candidate.type)) {
      setError('仅支持 JPG、PNG 或 WEBP 格式的图片。');
      return;
    }
    if (candidate.size > MAX_SIZE) {
      setError('图片请勿超过 15MB。');
      return;
    }

    setProcessing(true);
    try {
      const compressed = await compressImage(candidate);
      const url = URL.createObjectURL(compressed);
      if (currentUrlRef.current) URL.revokeObjectURL(currentUrlRef.current);
      currentUrlRef.current = url;
      onChange(compressed, url);
    } catch {
      setError('图片处理失败，请换一张照片重试。');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = () => {
    if (currentUrlRef.current) URL.revokeObjectURL(currentUrlRef.current);
    currentUrlRef.current = null;
    onChange(null, null);
  };

  if (file && previewUrl) {
    return (
      <div className="fade-up">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-sand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="已上传的穿搭照片预览" className="h-full w-full object-cover" />
          <div className="absolute left-0 top-0 bg-ink px-3 py-2">
            <span className="text-[10px] tracking-editorial text-white">PHOTO READY</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="truncate text-[11px] text-muted">{file.name}</p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => reuploadRef.current?.click()}
              className="border border-ink px-4 py-2 text-[11px] tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-white"
            >
              重新上传
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="border border-sand px-4 py-2 text-[11px] tracking-[0.08em] text-muted transition-colors hover:border-muted hover:text-ink"
            >
              删除
            </button>
          </div>
        </div>
        <input
          ref={reuploadRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            void handleFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => albumRef.current?.click()}
        disabled={processing}
        className="group flex min-h-[180px] w-full flex-col items-center justify-center border border-sand
                   bg-white/40 px-6 py-8 text-center transition-all duration-300 hover:border-olive
                   hover:bg-white disabled:opacity-60"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-5 h-10 w-10 text-olive transition-transform duration-300 group-hover:-translate-y-1"
          aria-hidden="true"
        >
          <path d="M4 8.5h3l1.5-2h7L17 8.5h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z" />
          <circle cx="12" cy="13.5" r="3.2" />
        </svg>
        <p className="font-serif text-[17px] text-ink">
          {processing ? '正在处理照片…' : '轻触上传穿搭照片'}
        </p>
        <p className="mt-2 text-[11px] tracking-[0.06em] text-muted">
          JPG / PNG / WEBP · 建议全身照
        </p>
      </button>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          disabled={processing}
          className="btn-ghost w-full disabled:opacity-50"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M4 8.5h3l1.5-2h7L17 8.5h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z" />
            <circle cx="12" cy="13.5" r="3.2" />
          </svg>
          拍照上传
        </button>
        <button
          type="button"
          onClick={() => albumRef.current?.click()}
          disabled={processing}
          className="btn-ghost w-full disabled:opacity-50"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="14" rx="1" />
            <path d="m3 17 5-5 3.5 3.5L15 12l6 5" />
          </svg>
          从相册选择
        </button>
      </div>

      {error && <p className="mt-3 text-[12px] text-[#9B4A3F]">{error}</p>}

      <input
        ref={albumRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </div>
  );
}
