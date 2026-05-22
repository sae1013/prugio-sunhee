import Image from "next/image";
import type { LoadedSection } from "@/lib/sections";
import Carousel from "./Carousel";
import SectionHeading from "./SectionHeading";

type Props = LoadedSection & {
  /** 1부터 시작하는 섹션 번호. heading 인덱스 표시에 사용 */
  index: number;
  /** 첫 섹션 여부 — 첫 이미지를 priority로 로드 (LCP 최적화) */
  isFirst?: boolean;
};

export default function Section({
  id,
  title,
  type,
  videoSrc,
  images,
  index,
  isFirst,
}: Props) {
  return (
    <section id={id} className="w-full">
      {title && <SectionHeading title={title} index={index} />}
      <div className="mx-auto w-full max-w-screen-lg">
        {videoSrc && (
          <div className="mb-6 sm:mb-10 px-4 sm:px-0">
            {/* 16:9 비율 박스 */}
            <div className="relative w-full overflow-hidden rounded-lg sm:rounded-xl bg-black aspect-video shadow-md">
              <iframe
                src={videoSrc}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={title ? `${title} 영상` : "섹션 영상"}
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        )}
        {type === "carousel" ? (
          <Carousel images={images} />
        ) : (
          images.map((img, idx) => (
            <Image
              key={img.src}
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority={isFirst && idx === 0}
              className="block h-auto w-full"
            />
          ))
        )}
      </div>
    </section>
  );
}
