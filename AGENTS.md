<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 프로젝트
업성동 푸르지오 레이크시티 분양정보 단일 페이지(랜딩) 사이트.

# 섹션 시스템
- 메인 페이지는 `src/config/sections.ts` 배열 순서대로 섹션을 렌더링.
- 각 섹션은 `public/images/sections/<id>/` 폴더의 이미지를 파일명 순으로 세로 나열 (한 섹션에 이미지가 여러 장일 수 있음 — 예: 평형정보 84A, 84B, 99A).
- 새 섹션 추가: ①`public/images/sections/<id>/` 폴더 만들어 이미지 넣기 → ②config 배열에 `{ id, title? }` 추가.
- 순서 변경: config 배열 재배치만 하면 됨. 코드 수정 없음.
- 폴더가 비어있거나 없는 섹션은 자동으로 skip.
