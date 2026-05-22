import { NextResponse } from "next/server";
import {
  isSpam,
  validateReservation,
  type ReservationPayload,
} from "@/lib/reservation";
import {
  formatReservationMessage,
  sendTelegramMessage,
} from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: Partial<ReservationPayload>;
  try {
    body = (await request.json()) as Partial<ReservationPayload>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "잘못된 요청입니다." },
      { status: 400 },
    );
  }

  // 봇 스팸: 조용히 성공 응답 (실제로는 전송 안 함)
  if (isSpam(body)) {
    return NextResponse.json({ ok: true });
  }

  const validation = validateReservation(body);
  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, error: validation.message, field: validation.field },
      { status: 400 },
    );
  }

  try {
    const text = formatReservationMessage(body as ReservationPayload);
    await sendTelegramMessage(text);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[reservation] 전송 실패:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "예약 접수 중 일시적 오류가 발생했습니다. 잠시 후 다시 시도하시거나 041-522-5353 로 연락주세요.",
      },
      { status: 500 },
    );
  }
}
