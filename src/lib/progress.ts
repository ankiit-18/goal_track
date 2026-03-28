export function goalProgressPercent(stages: { status: string }[]): number {
  if (stages.length === 0) return 0;
  const done = stages.filter((s) => s.status === "COMPLETED").length;
  return Math.round((done / stages.length) * 100);
}
