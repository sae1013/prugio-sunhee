/**
 * 방문예약 폼 — 검증 + 시간 슬롯 공통 유틸.
 * 서버/클라이언트 양쪽에서 사용. (서버 전용 import 없음)
 */

/** 방문 가능 시간 슬롯: 09:00 ~ 19:00, 1시간 간격 (11개) */
export const TIME_SLOTS: readonly string[] = Array.from(
  { length: 11 },
  (_, i) => `${String(9 + i).padStart(2, "0")}:00`,
);

/** 방문 가능 일자 범위 (오늘부터 +14일까지) */
export const RESERVATION_DAYS_AHEAD = 14;

export type ReservationPayload = {
  name: string;
  /** 010-XXXX-XXXX 형식 */
  phone: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:00 (TIME_SLOTS 중 하나) */
  time: string;
  agree: boolean;
  /** 전달사항 (선택). 최대 500자 */
  message?: string;
  /** 봇 스팸 honeypot. 정상 사용자라면 항상 빈 문자열 */
  hp?: string;
};

/** 전달사항 최대 길이 */
export const MESSAGE_MAX_LEN = 500;

export type ValidationResult =
  | { ok: true }
  | { ok: false; field: keyof ReservationPayload | "_"; message: string };

const NAME_RE = /^[가-힣A-Za-z\s]{2,20}$/;
const PHONE_RE = /^010-\d{4}-\d{4}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** 휴대폰 입력 시 자동 하이픈. 숫자만 추출 후 010-XXXX-XXXX 형태로 포맷. */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

/** 오늘 날짜 YYYY-MM-DD (로컬 타임존) */
export function todayYMD(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** 오늘 + offset일 (로컬) YYYY-MM-DD */
export function ymdPlus(offsetDays: number, now: Date = new Date()): string {
  const d = new Date(now);
  d.setDate(d.getDate() + offsetDays);
  return todayYMD(d);
}

/**
 * 전체 페이로드 검증. 클라이언트(즉시 피드백) + 서버(우회 방지) 양쪽에서 호출.
 * honeypot 채워져 있으면 정상값처럼 보이지만 별도로 isSpam()으로 가려냄.
 */
export function validateReservation(
  input: Partial<ReservationPayload>,
  now: Date = new Date(),
): ValidationResult {
  const { name, phone, date, time, agree } = input;

  if (typeof name !== "string" || !NAME_RE.test(name.trim())) {
    return { ok: false, field: "name", message: "이름을 2~20자로 입력해주세요." };
  }
  if (typeof phone !== "string" || !PHONE_RE.test(phone)) {
    return {
      ok: false,
      field: "phone",
      message: "휴대폰 번호를 010-0000-0000 형식으로 입력해주세요.",
    };
  }
  if (typeof date !== "string" || !DATE_RE.test(date)) {
    return { ok: false, field: "date", message: "방문일자를 선택해주세요." };
  }
  const min = todayYMD(now);
  const max = ymdPlus(RESERVATION_DAYS_AHEAD, now);
  if (date < min || date > max) {
    return {
      ok: false,
      field: "date",
      message: `방문일자는 ${min} ~ ${max} 사이로 선택해주세요.`,
    };
  }
  if (typeof time !== "string" || !TIME_SLOTS.includes(time)) {
    return { ok: false, field: "time", message: "방문시간을 선택해주세요." };
  }
  if (agree !== true) {
    return {
      ok: false,
      field: "agree",
      message: "개인정보 수집·이용에 동의해주세요.",
    };
  }
  if (
    input.message !== undefined &&
    typeof input.message === "string" &&
    input.message.length > MESSAGE_MAX_LEN
  ) {
    return {
      ok: false,
      field: "message",
      message: `전달사항은 ${MESSAGE_MAX_LEN}자 이내로 입력해주세요.`,
    };
  }
  return { ok: true };
}

/** 봇 스팸 판정: honeypot 필드에 값이 있으면 봇 */
export function isSpam(input: Partial<ReservationPayload>): boolean {
  return typeof input.hp === "string" && input.hp.trim().length > 0;
}
