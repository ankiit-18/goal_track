export const SITE_NAME = "GoalTrack";
export const SITE_DESCRIPTION =
  "GoalTrack helps you plan long-term goals, break them into stages, and keep progress steady with a weekly routine.";

export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return "https://goaltrack.in";
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}
