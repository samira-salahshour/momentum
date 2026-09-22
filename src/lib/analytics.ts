import { parseDateKey, shiftDateKey, toDateKey } from "./dates.ts";
import type { ProgressEntry } from "./types.ts";

export function progressPercentage(value: number, target: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(target) || target <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round((value / target) * 100)));
}

export function currentStreak(
  entries: ProgressEntry[],
  today = toDateKey(),
): number {
  const loggedDates = new Set(entries.map((entry) => entry.date));

  let cursor = loggedDates.has(today) ? today : shiftDateKey(today, -1);
  let streak = 0;

  while (loggedDates.has(cursor)) {
    streak += 1;
    cursor = shiftDateKey(cursor, -1);
  }

  return streak;
}

export function weeklyAverage(
  entries: ProgressEntry[],
  today = toDateKey(),
): number {
  const todayDate = parseDateKey(today);
  if (!todayDate) {
    return 0;
  }

  const daysSinceMonday = (todayDate.getDay() + 6) % 7;
  const startDate = shiftDateKey(today, -daysSinceMonday);
  const weekEntries = entries.filter(
    (entry) => entry.date >= startDate && entry.date <= today,
  );

  if (weekEntries.length === 0) {
    return 0;
  }

  const total = weekEntries.reduce((sum, entry) => sum + entry.value, 0);
  return Math.round((total / weekEntries.length) * 10) / 10;
}
