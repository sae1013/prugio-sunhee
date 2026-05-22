"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { SectionImage } from "@/lib/sections";

type Props = {
  images: SectionImage[];
};

/**
 * 모바일 우선 캐러셀.
 * - CSS scroll-snap 기반 → 모바일에서는 자연스러운 스와이프
 * - 하단 점 인디케이터 + (sm 이상) 좌우 화살표
 * - 이미지 비율은 첫 이미지 기준으로 컨테이너 높이 고정 (CLS 방지)
 */
export default function Carousel({ images }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // 스크롤 위치 → 현재 인덱스 추적
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      setIndex(i);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative w-full">
      <div
        ref={trackRef}
        className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((img, i) => (
          <div
            key={img.src}
            className="relative shrink-0 basis-full snap-center"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority={i === 0}
              className="block h-auto w-full"
            />
          </div>
        ))}
      </div>

      {/* 좌우 화살표 (sm 이상) */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="이전"
            onClick={() => scrollTo(Math.max(0, index - 1))}
            disabled={index === 0}
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60 disabled:opacity-30"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="다음"
            onClick={() => scrollTo(Math.min(images.length - 1, index + 1))}
            disabled={index === images.length - 1}
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60 disabled:opacity-30"
          >
            ›
          </button>
        </>
      )}

      {/* 인디케이터 */}
      {images.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`${i + 1}번째 슬라이드로 이동`}
              onClick={() => scrollTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-zinc-800" : "w-1.5 bg-zinc-300"
              }`}
            />
          ))}
        </div>
      )}

      {/* 카운터 (sm 이하에서만) */}
      {images.length > 1 && (
        <div className="sm:hidden mt-2 text-center text-xs text-zinc-500 tabular-nums">
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
