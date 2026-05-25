import { sections } from "@/config/sections";
import { loadSection } from "@/lib/sections";
import Section from "@/components/Section";
import Hero from "@/components/Hero";

export default function Home() {
  const loaded = sections
    .map(loadSection)
    .filter((s): s is NonNullable<typeof s> => s !== null && s.images.length > 0);

  return (
    <main className="w-full bg-white">
      <Hero
        imageSrc="/images/sections/main-visual.jpg"
        sloganSrc="/images/sections/main_brand_slogan.png"
        lines={[
          "업성 푸르지오 레이크시티",
          "1차 계약금 단 천만원",
          "선착순 로얄 동·호수 분양",
        ]}
      />

      {loaded.length === 0 ? (
        <div className="mx-auto max-w-screen-md p-16 text-center text-zinc-600">
          <p className="mt-4 text-sm leading-relaxed">
            아직 표시할 섹션이 없습니다.
            <br />
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs">
              public/images/sections/&lt;id&gt;/
            </code>{" "}
            폴더를 만들고 이미지를 넣은 뒤,
            <br />
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs">
              src/config/sections.ts
            </code>{" "}
            배열에 추가하세요.
          </p>
        </div>
      ) : (
        loaded.map((s, i) => <Section key={s.id} {...s} index={i + 1} />)
      )}
    </main>
  );
}
