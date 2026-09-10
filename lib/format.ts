/** 表示用の整形。桁が揃うように、必ず小数第1位まで出す。 */
export const n1 = (x: number): string => (Number.isFinite(x) ? x.toFixed(1) : '—');

/** 整数（％や分など） */
export const n0 = (x: number): string =>
  Number.isFinite(x) ? Math.round(x).toString() : '—';

/**
 * 小数第1位で切り捨て。
 * 月の日数（4.35×5＝21.75 → 21.7）だけは四捨五入ではなく切り捨てで表示する。
 */
export const trunc1 = (x: number): string =>
  Number.isFinite(x) ? (Math.trunc(x * 10) / 10).toFixed(1) : '—';

/** 学習時間の合計。整数で出す */
export const hours = (x: number): string => (Number.isFinite(x) ? Math.round(x).toString() : '—');

/** 到達年月 */
export const ym = (d: Date): string => `${d.getFullYear()}年${d.getMonth() + 1}月`;

/** 月数。1ヶ月未満は切り上げて1ヶ月と数える */
export const monthCount = (m: number | null): string =>
  m === null || !Number.isFinite(m) ? '—' : Math.max(1, Math.ceil(m)).toString();

/** 「◯年◯ヶ月」表記。12ヶ月未満は月だけ */
export function span(m: number | null): string {
  if (m === null || !Number.isFinite(m)) return '—';
  const total = Math.max(1, Math.ceil(m));
  const y = Math.floor(total / 12);
  const mm = total % 12;
  if (y === 0) return `${mm}ヶ月`;
  if (mm === 0) return `${y}年`;
  return `${y}年${mm}ヶ月`;
}

/** 時間を「2時間6分」「30分」の形にする */
export function hm(h: number): string {
  if (!Number.isFinite(h) || h <= 0) return '0分';
  const total = Math.round(h * 60);
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  if (hh === 0) return `${mm}分`;
  if (mm === 0) return `${hh}時間`;
  return `${hh}時間${mm}分`;
}
