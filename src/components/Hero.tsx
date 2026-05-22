import Image from "next/image";

type Props = {
  /** 메인 비주얼 (cover 배경) */
  imageSrc: string;
  /** 메인 비주얼 위에 얹을 브랜드 슬로건 이미지 (예: "Lake View" 손글씨) */
  sloganSrc: string;
  /** 슬로건 아래에 표시할 텍스트 라인들 */
  lines: string[];
};

/**
 * 최상단 히어로.
 * - main-visual.jpg를 cover로 깔고 Ken Burns(슬로우 줌·패닝)
 * - 브랜드 슬로건 이미지와 텍스트 라인들을 순차 페이드업
 */
export default function Hero({ imageSrc, sloganSrc, lines }: Props) {
  const [headline, ...rest] = lines;

  return (
    <section
      aria-label="업성 푸르지오 레이크시티 메인"
      className="relative w-full h-[100svh] min-h-[560px] overflow-hidden bg-stone-900"
    >
      {/* 메인 비주얼 (Ken Burns) */}
      <div className="absolute inset-0 animate-ken-burns">
        <Image
          src={imageSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center select-none"
        />
      </div>

      {/* 가독성용 그라데이션 — 위쪽은 옅게, 아래쪽으로 진하게 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/55"
      />

      {/* 텍스트 영역 — 상단으로 정렬 */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-start px-6 pt-[14svh] sm:pt-[16svh] text-center text-white">
        {/* 헤드라인 (상단, 크게) */}
        {headline && (
          <h2
            className="animate-hero-fade-up text-4xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.02em] leading-[1.1] drop-shadow-[0_2px_18px_rgba(0,0,0,0.6)]"
            style={{ animationDelay: "0.1s" }}
          >
            {headline}
          </h2>
        )}

        {/* 브랜드 슬로건 (Lake View 손글씨) */}
        <div
          className="animate-hero-fade-up mt-5 sm:mt-7 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
          style={{ animationDelay: "0.5s" }}
        >
          <Image
            src={sloganSrc}
            alt="Lake View"
            width={480}
            height={180}
            priority
            sizes="(max-width: 640px) 60vw, 360px"
            className="block h-auto w-[50vw] max-w-[300px] sm:max-w-[360px] brightness-0 invert opacity-90"
          />
        </div>

        {/* 얇은 골드 디바이더 */}
        {rest.length > 0 && (
          <span
            aria-hidden="true"
            className="animate-hero-fade-up mt-8 sm:mt-10 block h-px w-12 bg-[#b08d57]"
            style={{ animationDelay: "0.85s" }}
          />
        )}

        {/* 서브 라인들 */}
        {rest.map((line, i) => (
          <p
            key={i}
            className="animate-hero-fade-up mt-4 sm:mt-5 text-lg sm:text-2xl md:text-3xl tracking-[0.12em] font-medium text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.6)]"
            style={{ animationDelay: `${1.05 + i * 0.25}s` }}
          >
            {line}
          </p>
        ))}
      </div>

      {/* 스크롤 인디케이터 */}
      <div
        aria-hidden="true"
        className="animate-hero-fade-up absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70"
        style={{ animationDelay: "1.8s" }}
      >
        <span className="block h-8 w-px bg-white/60 mx-auto" />
        <span className="mt-2 block text-[10px] tracking-[0.35em]">SCROLL</span>
      </div>
    </section>
  );
}
