/** Local calendar date key YYYY-MM-DD */
export function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Monday (local) of the week containing `ref` */
export function mondayKeyLocal(ref: Date): string {
  const d = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  const day = d.getDay(); // 0 Sun … 6 Sat
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return localDateKey(d);
}

/** Shift a Monday date key by N weeks (local calendar) */
export function addWeeksToMondayKey(mondayKey: string, weeks: number): string {
  const [y, m, d] = mondayKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d + weeks * 7);
  return localDateKey(dt);
}

/** Inclusive range Mon–Sun as date keys from a Monday key */
export function weekKeysFromMonday(mondayKey: string): string[] {
  const [y, m, d] = mondayKey.split("-").map(Number);
  const out: string[] = [];
  const base = new Date(y, m - 1, d);
  for (let i = 0; i < 7; i++) {
    const x = new Date(base);
    x.setDate(base.getDate() + i);
    out.push(localDateKey(x));
  }
  return out;
}

/** ISO weekday 1=Mon … 7=Sun for the civil calendar date (timezone-safe) */
export function isoWeekdayFromDateKey(dateKey: string): number {
  const [y, m, d] = dateKey.split("-").map(Number);
  const w = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return w === 0 ? 7 : w;
}

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function parseDateKeyParts(dateKey: string): {
  y: number;
  m: number;
  d: number;
} | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!y || mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return { y, m: mo, d };
}

/** Stable label for SSR + client (no locale / timezone drift) */
export function formatDateKeyShort(dateKey: string): string {
  const p = parseDateKeyParts(dateKey);
  if (!p) return dateKey;
  return `${SHORT_MONTHS[p.m - 1]} ${p.d}`;
}

export function formatDateKeyFull(dateKey: string): string {
  const p = parseDateKeyParts(dateKey);
  if (!p) return dateKey;
  return `${SHORT_MONTHS[p.m - 1]} ${p.d}, ${p.y}`;
}

/** Week range title, e.g. "Mar 23 – Mar 29, 2026" */
export function formatWeekRangeLabel(startKey: string, endKey: string): string {
  const a = parseDateKeyParts(startKey);
  const b = parseDateKeyParts(endKey);
  if (!a || !b) return `${startKey} – ${endKey}`;
  if (a.y !== b.y) {
    return `${formatDateKeyFull(startKey)} – ${formatDateKeyFull(endKey)}`;
  }
  return `${formatDateKeyShort(startKey)} – ${formatDateKeyShort(endKey)}, ${a.y}`;
}
