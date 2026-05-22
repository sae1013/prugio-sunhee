import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import type { SectionConfig } from "@/config/sections";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const SECTIONS_ROOT = path.join(process.cwd(), "public", "images", "sections");

export type SectionImage = {
  /** 브라우저에서 사용할 src 경로 (예: /images/sections/overview/01.jpg) */
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type LoadedSection = {
  id: string;
  title?: string;
  type?: SectionConfig["type"];
  videoSrc?: SectionConfig["videoSrc"];
  images: SectionImage[];
};

/**
 * config로부터 한 섹션을 로드.
 * - 폴더가 없거나 이미지가 없으면 null 반환 (페이지에서 skip 처리)
 * - dimension은 image-size로 측정해서 next/image의 width/height에 그대로 전달 (CLS 방지)
 */
export function loadSection(config: SectionConfig): LoadedSection | null {
  const dir = path.join(SECTIONS_ROOT, config.id);

  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    return null;
  }

  const files = fs
    .readdirSync(dir)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (files.length === 0) return null;

  const images: SectionImage[] = files.map((file) => {
    const absolute = path.join(dir, file);
    const buffer = fs.readFileSync(absolute);
    const dim = imageSize(buffer);
    return {
      src: `/images/sections/${config.id}/${file}`,
      width: dim.width,
      height: dim.height,
      alt: config.title ? `${config.title} - ${file}` : file,
    };
  });

  return {
    id: config.id,
    title: config.title,
    type: config.type,
    videoSrc: config.videoSrc,
    images,
  };
}
