export type SectionConfig = {
  /** 폴더명. public/images/sections/<id>/ 안의 이미지를 자동으로 불러옴 */
  id: string;
  /** 화면에 표시할 섹션 제목 (선택, 현재는 접근성/SEO용) */
  title?: string;
  /**
   * 표시 방식
   * - 'stack'    (기본): 이미지를 세로로 나열
   * - 'carousel': 좌우 스와이프 캐러셀 (평형타입 등 여러 장 비교용)
   */
  type?: "stack" | "carousel";
  /**
   * 섹션 상단에 임베드할 영상 URL (선택).
   * 예: Vimeo 플레이어 URL. 헤딩 바로 아래 16:9 박스로 표시되고 이미지가 그 아래 이어짐.
   */
  videoSrc?: string;
};

/**
 * 메인 페이지에 표시할 섹션 목록.
 *
 * ★ 이 배열의 순서가 곧 페이지에서 위→아래 표시 순서입니다.
 *   순서를 바꾸려면 항목을 재배치하기만 하면 됩니다.
 *
 * 새 섹션 추가:
 *   1) public/images/sections/<id>/ 폴더를 만들고 이미지를 넣기
 *   2) 아래 배열에 { id, title, type? } 추가
 *
 * 폴더가 비어있거나 존재하지 않는 섹션은 자동으로 skip 됩니다.
 */
export const sections: SectionConfig[] = [
  { id: "프리미엄7",   title: "프리미엄 7" },
  { id: "입지환경",     title: "입지 환경" },
  { id: "단지배치도",   title: "단지 배치도" },
  { id: "배치도",       title: "평형 안내", type: "carousel" },
  {
    id: "커뮤니티",
    title: "커뮤니티",
    videoSrc:
      "https://player.vimeo.com/video/1181111791?autopause=0&title=0&byline=0&portrait=0&loop=1&background=1",
  },
  { id: "오시는길",     title: "오시는 길" },
];
