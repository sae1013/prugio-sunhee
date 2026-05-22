type Props = {
  title: string;
  /** 1부터 시작하는 섹션 번호 (자동으로 두 자리 padding) */
  index: number;
};

/**
 * 섹션 상단의 세련된 가운데 정렬 타이틀.
 *
 * 구성 (위 → 아래):
 *   1) 짧은 가로 디바이더
 *   2) 두 자리 인덱스 (얇은 모노스페이스 느낌, 넓은 트래킹)
 *   3) 큰 세리프-스타일 한글 타이틀
 *   4) 얇은 가로 디바이더
 */
export default function SectionHeading({ title, index }: Props) {
  const paddedIndex = String(index).padStart(2, "0");

  return (
    <div className="mx-auto flex w-full max-w-screen-lg flex-col items-center px-6 py-12 sm:py-16">
      <span className="h-px w-8 bg-zinc-300" aria-hidden="true" />
      <span className="mt-5 text-[11px] sm:text-xs font-medium tracking-[0.35em] text-zinc-400 tabular-nums">
        {paddedIndex}
      </span>
      <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 text-center">
        {title}
      </h2>
      <span className="mt-6 h-px w-12 bg-zinc-800" aria-hidden="true" />
    </div>
  );
}
