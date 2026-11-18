'use client';

import { useState } from 'react';

interface Props {
  src: string;
  fallback: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}

/** 远程案例图加载失败时回退到对应的本地季节封面，避免出现破图。 */
export default function ImageWithFallback({
  src,
  fallback,
  alt,
  className = '',
  imgClassName = '',
}: Props) {
  const [current, setCurrent] = useState(src);

  return (
    <div className={`magazine-image ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={current}
        alt={alt}
        loading="lazy"
        onError={() => {
          if (current !== fallback) setCurrent(fallback);
        }}
        className={imgClassName}
      />
    </div>
  );
}
