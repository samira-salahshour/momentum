import { shiftDateKey, toDateKey } from "@/src/lib/dates";
import type { ProgressEntry } from "@/src/lib/types";

export function progressPercentage(value: number, target: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(target) || target <= 0) {
    return 0;
  }

  return Math.max(0, Math.round((value / target) * 100));
}

export function currentStreak(
  entries: ProgressEntry[],
  target: number,
  today = toDateKey(),
): number {
  if (!Number.isFinite(target) || target <= 0) {
    return 0;
  }

  const completedDates = new Set(
    entries
      .filter((entry) => entry.value >= target)
      .map((entry) => entry.date),
  );

  let cursor = completedDates.has(today) ? today : shiftDateKey(today, -1);
  let streak = 0;

  while (completedDates.has(cursor)) {
    streak += 1;
    cursor = shiftDateKey(cursor, -1);
  }

  return streak;
}

export function weeklyAverage(
  entries: ProgressEntry[],
  today = toDateKey(),
): number {
  const startDate = shiftDateKey(today, -6);
  const total = entries
    .filter((entry) => entry.date >= startDate && entry.date <= today)
    .reduce((sum, entry) => sum + entry.value, 0);

  return Math.round((total / 7) * 10) / 10;
}
