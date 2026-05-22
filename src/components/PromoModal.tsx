"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const DISMISS_KEY = "modelhouse:promoHiddenUntil"; // YYYY-MM-DD

function todayYMD(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * 진입 시 자동 노출되는 홍보배너 모달.
 * - 페이지 로드마다 자동으로 뜸 (사용자 요청)
 * - "오늘 하루 보지 않기" 체크 시 localStorage에 오늘 날짜 저장 → 그날 동안 다시 안 뜸
 * - 배경 클릭, ESC, X 버튼으로 닫힘
 */
export default function PromoModal() {
  const [open, setOpen] = useState(false);

  // 마운트 시 자동 오픈 (오늘 "안 보기" 체크되어 있으면 skip)
  useEffect(() => {
    const hiddenUntil = localStorage.getItem(DISMISS_KEY);
    if (hiddenUntil === todayYMD()) return;
    setOpen(true);
  }, []);

  // 모달 열림 시 body 스크롤 잠금 + ESC 닫기
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  const closeForToday = () => {
    localStorage.setItem(DISMISS_KEY, todayYMD());
    setOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      role="dialog"
      aria-modal="true"
      aria-label="홍보 배너"
    >
      <div className="relative w-full max-w-sm sm:max-w-md max-h-[min(92svh,720px)] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col">
        {/* 닫기 */}
        <button
          type="button"
          aria-label="닫기"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
        >
          ✕
        </button>

        {/* 배너 이미지 */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Image
            src="/images/banner/promo_banner.png"
            alt="업성 푸르지오 레이크시티 홍보 배너"
            width={1086}
            height={1449}
            priority
            sizes="(max-width: 640px) 90vw, 480px"
            className="block h-auto w-full"
          />
        </div>

        {/* 하단 액션 바 */}
        <div className="flex shrink-0 divide-x divide-zinc-200 border-t border-zinc-200 bg-white text-sm">
          <button
            type="button"
            onClick={closeForToday}
            className="flex-1 py-3 text-zinc-500 hover:bg-zinc-50 active:bg-zinc-100"
          >
            오늘 하루 보지 않기
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex-1 py-3 font-semibold text-zinc-900 hover:bg-zinc-50 active:bg-zinc-100"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
