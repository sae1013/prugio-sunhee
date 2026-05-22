"use client";

import { useState } from "react";
import ReservationModal from "./ReservationModal";

/**
 * 화면 하단 고정 CTA 바 (모든 스크롤 위치에서 항상 노출).
 * 좌 50% 전화걸기 / 우 50% 방문예약.
 *
 * 스타일: 푸르지오 시그니처 그린 단색 + 차분한 골드 액센트 (글로우 없음).
 */
export default function ReservationFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-0 z-40 bg-[#062e25] text-white"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* 상단 골드 가는 선 */}
        <div
          aria-hidden="true"
          className="absolute -top-px inset-x-0 h-px bg-[#c9a86a]"
        />

        <div className="flex">
          <a
            href="tel:041-522-5353"
            aria-label="전화 걸기 041-522-5353"
            className="group relative flex flex-1 basis-1/2 items-center justify-center gap-2 min-h-[84px] sm:min-h-[96px] py-4 text-base sm:text-lg font-bold tracking-wide transition-colors hover:bg-white/[0.04] active:bg-white/[0.08]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 sm:h-5 sm:w-5 text-[#c9a86a]"
              aria-hidden="true"
            >
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.57.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.57 1 1 0 01-.24 1.01l-2.21 2.21z" />
            </svg>
            <span className="text-white">전화하기</span>
          </a>

          {/* 가운데 골드 구분선 (단색) */}
          <span
            aria-hidden="true"
            className="w-px self-stretch bg-[#c9a86a]/40"
          />

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="방문예약 접수"
            className="group relative flex flex-1 basis-1/2 items-center justify-center gap-2 min-h-[84px] sm:min-h-[96px] py-4 text-base sm:text-lg font-bold tracking-wide transition-colors hover:bg-white/[0.04] active:bg-white/[0.08]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 sm:h-5 sm:w-5 text-[#c9a86a]"
              aria-hidden="true"
            >
              <path d="M7 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v13a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm12 8H5v9h14v-9z" />
            </svg>
            <span className="text-white">방문예약</span>
          </button>
        </div>
      </div>

      <ReservationModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
