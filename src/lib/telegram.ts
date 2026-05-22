/**
 * 텔레그램 봇 전송 유틸 (서버 전용).
 * .env.local 에 TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID 가 설정되어 있어야 한다.
 */

import type { ReservationPayload } from "./reservation";

const WEEKDAY_KO = ["일", "월", "화", "수", "목", "금", "토"];

/** HTML 모드 메시지 작성 — 텔레그램은 일부 HTML 태그만 지원 */
export function formatReservationMessage(
  data: ReservationPayload,
  receivedAt: Date = new Date(),
): string {
  const phoneDigits = data.phone.replace(/-/g, "");
  const dayOfWeek = WEEKDAY_KO[new Date(`${data.date}T00:00`).getDay()];
  const received = formatLocal(receivedAt);

  const lines = [
    "🏠 <b>방문예약 신규 접수</b>",
    "",
    `• 이름: <b>${escapeHtml(data.name.trim())}</b>`,
    `• 연락처: <a href="tel:${phoneDigits}">${escapeHtml(data.phone)}</a>`,
    `• 방문: <b>${data.date} (${dayOfWeek}) ${data.time}</b>`,
    `• 접수: ${received}`,
  ];

  const memo = data.message?.trim();
  if (memo) {
    lines.push("", "📝 <b>전달사항</b>", escapeHtml(memo));
  }

  return lines.join("\n");
}

/** 텔레그램으로 메시지 전송. 실패 시 throw. */
export async function sendTelegramMessage(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error(
      "Telegram 환경변수가 설정되지 않았습니다. .env.local 에 TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID 를 추가하세요.",
    );
  }

  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      // Edge/Node fetch 양쪽 안전하게 캐싱 안 함
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Telegram API 오류 (${res.status}): ${body.slice(0, 200)}`,
    );
  }
}

/** YYYY-MM-DD HH:mm (로컬) */
function formatLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
