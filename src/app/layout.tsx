import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ReservationFab from "@/components/ReservationFab";
import PromoModal from "@/components/PromoModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://업성푸르지오레이크.site";
const SITE_TITLE = "업성 푸르지오 레이크시티 모델하우스";
const SITE_DESCRIPTION =
  "업성 푸르지오 레이크시티 분양정보 · 성성호수공원 · 선착순 로얄 동·호수 분양";
const OG_IMAGE_URL = `${SITE_URL}/images/og/upseong-prugio-lake-og.png?v=20260522`;
const TWITTER_IMAGE_URL = `${SITE_URL}/images/og/upseong-prugio-lake-twitter.png?v=20260522`;
const SOCIAL_IMAGE = {
  width: 1731,
  height: 909,
  alt: SITE_TITLE,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_TITLE,
    images: [
      {
        url: OG_IMAGE_URL,
        ...SOCIAL_IMAGE,
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: TWITTER_IMAGE_URL,
        ...SOCIAL_IMAGE,
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{
          // 하단 고정 CTA 바(약 96px) + iOS safe-area 만큼 본문 아래 여백 확보
          paddingBottom: "calc(96px + env(safe-area-inset-bottom))",
        }}
      >
        <Header />
        {children}
        <ReservationFab />
        <PromoModal />
      </body>
    </html>
  );
}
