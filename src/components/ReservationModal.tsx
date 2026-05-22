"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";
import {
  TIME_SLOTS,
  formatPhone,
  todayYMD,
  ymdPlus,
  validateReservation,
  RESERVATION_DAYS_AHEAD,
  MESSAGE_MAX_LEN,
  type ReservationPayload,
} from "@/lib/reservation";

type Props = {
  open: boolean;
  onClose: () => void;
};

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const COOLDOWN_MS = 15_000;
const COOLDOWN_KEY = "modelhouse:lastReservationAt";

export default function ReservationModal({ open, onClose }: Props) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [agree, setAgree] = useState(false);
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState(""); // honeypot
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const today = todayYMD();
  const maxDate = ymdPlus(RESERVATION_DAYS_AHEAD);

  // 모달 열림: body 스크롤 잠금 + autofocus + ESC 핸들러
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setTimeout(() => firstFieldRef.current?.focus(), 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // 모달 닫힐 때 상태 초기화 (성공 후 다음 열림에서 새 폼)
  useEffect(() => {
    if (!open) {
      setStatus({ kind: "idle" });
      setFieldError(null);
    }
  }, [open]);

  if (!open) return null;

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldError(null);

    // 클라이언트 cooldown
    if (typeof window !== "undefined") {
      const last = Number(sessionStorage.getItem(COOLDOWN_KEY) || 0);
      if (Date.now() - last < COOLDOWN_MS) {
        const sec = Math.ceil((COOLDOWN_MS - (Date.now() - last)) / 1000);
        setStatus({
          kind: "error",
          message: `잠시만요. ${sec}초 후 다시 시도해주세요.`,
        });
        return;
      }
    }

    const payload: ReservationPayload = {
      name: name.trim(),
      phone,
      date,
      time,
      agree,
      message: message.trim() || undefined,
      hp,
    };

    const v = validateReservation(payload);
    if (!v.ok) {
      setFieldError(v.message);
      return;
    }

    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !json.ok) {
        setStatus({
          kind: "error",
          message:
            json.error ??
            "예약 접수에 실패했습니다. 잠시 후 다시 시도하시거나 041-522-5353 로 연락주세요.",
        });
        return;
      }
      sessionStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      setStatus({ kind: "success" });
    } catch {
      setStatus({
        kind: "error",
        message:
          "네트워크 오류가 발생했습니다. 잠시 후 다시 시도하시거나 041-522-5353 로 연락주세요.",
      });
    }
  };

  const isSubmitting = status.kind === "submitting";
  const isSuccess = status.kind === "success";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl max-h-[92svh] overflow-y-auto"
      >
        {/* 닫기 */}
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100"
        >
          ✕
        </button>

        {isSuccess ? (
          <SuccessView onClose={onClose} />
        ) : (
          <form onSubmit={handleSubmit} className="px-5 py-7 sm:px-7 sm:py-8">
            <header className="mb-5 text-center">
              <h2 id={titleId} className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
                방문예약 접수
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-zinc-500">
                접수 후 담당자가 신속히 연락드립니다.
              </p>
            </header>

            <div className="space-y-4">
              <Field label="이름" required>
                <input
                  ref={firstFieldRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                  maxLength={20}
                  autoComplete="name"
                  className={inputCls}
                />
              </Field>

              <Field label="휴대폰" required>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="010-0000-0000"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={13}
                  className={inputCls}
                />
              </Field>

              <Field label="방문일자" required>
                <input
                  type="date"
                  value={date}
                  min={today}
                  max={maxDate}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="방문시간" required>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={inputCls}
                >
                  <option value="">선택</option>
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="전달사항 (선택)">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="관심 평형, 문의사항 등을 자유롭게 적어주세요."
                  maxLength={MESSAGE_MAX_LEN}
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
                <span className="mt-1 block text-right text-[11px] text-zinc-400 tabular-nums">
                  {message.length} / {MESSAGE_MAX_LEN}
                </span>
              </Field>

              <label className="flex items-start gap-2.5 text-xs text-zinc-600 leading-relaxed cursor-pointer">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-zinc-900"
                />
                <span>
                  <b className="text-zinc-900">[필수]</b> 개인정보 수집·이용에 동의합니다.
                  수집항목: 이름·연락처·희망방문일시 / 이용목적: 방문예약 응대 / 보유기간: 응대 완료 후 30일.
                </span>
              </label>

              {/* honeypot — 사용자에겐 보이지 않음 */}
              <input
                type="text"
                name="company"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              {(fieldError || status.kind === "error") && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
                  {fieldError ?? (status.kind === "error" ? status.message : "")}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!agree || isSubmitting}
              className="mt-6 w-full rounded-full bg-zinc-900 py-3.5 text-base font-bold text-white transition disabled:bg-zinc-300 disabled:cursor-not-allowed hover:bg-zinc-800 active:bg-zinc-700"
            >
              {isSubmitting ? "전송 중…" : "예약 접수"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-zinc-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function SuccessView({ onClose }: { onClose: () => void }) {
  return (
    <div className="px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
        ✓
      </div>
      <h2 className="text-xl font-bold text-zinc-900">접수가 완료되었습니다</h2>
      <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
        담당자가 곧 연락드릴 예정입니다.
        <br />
        급한 문의는 아래 번호로 연락주세요.
      </p>
      <a
        href="tel:041-522-5353"
        className="mt-5 inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-bold text-white"
      >
        041-522-5353
      </a>
      <button
        type="button"
        onClick={onClose}
        className="mt-3 block w-full text-sm text-zinc-500 underline-offset-4 hover:underline"
      >
        닫기
      </button>
    </div>
  );
}
