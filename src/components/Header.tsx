/**
 * 상단 sticky 헤더.
 * - 좌: 푸르지오 로고
 * - 가운데: 단지명
 * - 우: 전화번호 (tap to call)
 *
 * 모바일에서는 좁으니 가운데 타이틀과 전화번호 폰트 사이즈를 줄이고,
 * 전화번호는 아이콘 + 숫자 형태로 표시.
 */

import Image from "next/image";

const TEL_DISPLAY = "041-522-5353";
const TEL_HREF = "tel:041-522-5353";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-zinc-200/70">
      <div className="mx-auto flex h-16 sm:h-20 w-full max-w-screen-lg items-center justify-between gap-2 px-3 sm:px-5">
        {/* 좌: 푸르지오 로고 */}
        <div className="flex shrink-0 items-center">
          <Image
            src="/prugio-logo.png"
            alt="푸르지오"
            width={224}
            height={224}
            priority
            className="h-11 w-11 sm:h-14 sm:w-14 rounded-xl"
          />
        </div>

        {/* 가운데: 단지명 */}
        <div className="min-w-0 flex-1 text-center">
          <h1 className="text-sm sm:text-lg font-black leading-tight text-zinc-900">
            <span className="block sm:inline">업성푸르지오</span>{" "}
            <span className="block sm:inline">레이크시티</span>
          </h1>
        </div>

        {/* 우: 전화번호 (tap to call) */}
        <a
          href={TEL_HREF}
          aria-label={`전화 걸기 ${TEL_DISPLAY}`}
          className="animate-call-shine flex shrink-0 items-center gap-1.5 sm:gap-2 rounded-full bg-zinc-900 px-3.5 sm:px-5 py-1.5 sm:py-2.5 text-white text-base sm:text-lg font-bold tabular-nums transition-colors hover:bg-zinc-800 active:bg-zinc-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4 sm:h-5 sm:w-5"
            aria-hidden="true"
          >
            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.57.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.57 1 1 0 01-.24 1.01l-2.21 2.21z" />
          </svg>
          <span>{TEL_DISPLAY}</span>
        </a>
      </div>
    </header>
  );
}
