import assert from "node:assert/strict";
import test from "node:test";

import {
  currentStreak,
  progressPercentage,
  weeklyAverage,
} from "./analytics.ts";
import type { ProgressEntry } from "./types.ts";

function entry(
  date: string,
  value: number,
  id = `${date}-${value}`,
): ProgressEntry {
  return { id, goalId: "goal-1", date, value };
}

test("progress percentage is visually capped at 100", () => {
  assert.equal(progressPercentage(5, 10), 50);
  assert.equal(progressPercentage(15, 10), 100);
  assert.equal(progressPercentage(-1, 10), 0);
});

test("current streak counts consecutive logged days regardless of value", () => {
  const entries = [
    entry("2026-09-20", 1),
    entry("2026-09-21", 0),
    entry("2026-09-22", 5),
  ];

  assert.equal(currentStreak(entries, "2026-09-22"), 3);
});

test("current streak can continue through yesterday before today's log", () => {
  const entries = [
    entry("2026-09-20", 2),
    entry("2026-09-21", 3),
    entry("2026-09-22", 4),
  ];

  assert.equal(currentStreak(entries, "2026-09-23"), 3);
});

test("current streak stops at the first missing day", () => {
  const entries = [
    entry("2026-09-19", 2),
    entry("2026-09-21", 3),
    entry("2026-09-22", 4),
  ];

  assert.equal(currentStreak(entries, "2026-09-22"), 2);
});

test("weekly average uses only entries from the current Monday-based week", () => {
  const entries = [
    entry("2026-09-20", 100),
    entry("2026-09-21", 10),
    entry("2026-09-22", 20),
    entry("2026-09-23", 30),
  ];

  assert.equal(weeklyAverage(entries, "2026-09-23"), 20);
});

test("weekly average includes a logged zero and ignores unlogged days", () => {
  const entries = [entry("2026-09-21", 0), entry("2026-09-22", 20)];

  assert.equal(weeklyAverage(entries, "2026-09-23"), 10);
  assert.equal(weeklyAverage([], "2026-09-23"), 0);
});
