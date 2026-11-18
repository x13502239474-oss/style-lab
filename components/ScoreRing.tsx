'use client';

import { useEffect, useState } from 'react';

export default function ScoreRing({ score }: { score: number }) {
  const [display, setDisplay] = useState(0);
  const radius = 82;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(() => setDisplay(score), 120);
    return () => clearTimeout(timer);
  }, [score]);

  const offset = circumference * (1 - display / 100);

  return (
    <div className="relative h-[200px] w-[200px] shrink-0">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#E9E3D9"
          strokeWidth="1.5"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#89917B"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
        {/* 外圈刻度点 */}
        <circle cx="100" cy="100" r="95" fill="none" stroke="#E9E3D9" strokeWidth="0.6" strokeDasharray="1 9" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-[58px] leading-none tracking-tight text-ink">{display}</span>
        <span className="editorial-label mt-2">/ 100</span>
      </div>
    </div>
  );
}
