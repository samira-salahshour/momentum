import { parseDateKey } from "@/src/lib/dates";
import {
  GOAL_METRICS,
  type Goal,
  type GoalMetric,
  type ProgressEntry,
} from "@/src/lib/types";

const GOALS_STORAGE_KEY = "momentum.goals.v1";
const PROGRESS_STORAGE_KEY = "momentum.progress.v1";
const STORAGE_CHANGE_EVENT = "momentum-storage-change";
const SERVER_SNAPSHOT = "server";

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function readArray(key: string): unknown[] {
  const storage = getStorage();
  if (!storage) {
    return [];
  }

  try {
    const value: unknown = JSON.parse(storage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeArray(key: string, value: unknown[]): boolean {
  const storage = getStorage();
  if (!storage) {
    return false;
  }

  try {
    storage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function getStorageSnapshot(): string {
  const storage = getStorage();
  if (!storage) {
    return SERVER_SNAPSHOT;
  }

  try {
    return JSON.stringify([
      storage.getItem(GOALS_STORAGE_KEY),
      storage.getItem(PROGRESS_STORAGE_KEY),
    ]);
  } catch {
    return "unavailable";
  }
}

export function getServerStorageSnapshot(): string {
  return SERVER_SNAPSHOT;
}

export function subscribeToStorage(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(STORAGE_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(STORAGE_CHANGE_EVENT, onStoreChange);
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isGoalMetric(value: unknown): value is GoalMetric {
  return (
    typeof value === "string" &&
    GOAL_METRICS.some((metric) => metric === value)
  );
}

function isGoal(value: unknown): value is Goal {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    isGoalMetric(value.metric) &&
    typeof value.target === "number" &&
    Number.isFinite(value.target) &&
    value.target > 0 &&
    typeof value.unit === "string" &&
    typeof value.startDate === "string" &&
    parseDateKey(value.startDate) !== null &&
    typeof value.endDate === "string" &&
    parseDateKey(value.endDate) !== null &&
    value.endDate >= value.startDate
  );
}

function isProgressEntry(value: unknown): value is ProgressEntry {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.goalId === "string" &&
    typeof value.date === "string" &&
    parseDateKey(value.date) !== null &&
    typeof value.value === "number" &&
    Number.isFinite(value.value) &&
    value.value >= 0
  );
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getGoals(): Goal[] {
  return readArray(GOALS_STORAGE_KEY).filter(isGoal);
}

export function saveGoal(goal: Omit<Goal, "id">): Goal | null {
  const savedGoal: Goal = { ...goal, id: createId() };
  return writeArray(GOALS_STORAGE_KEY, [...getGoals(), savedGoal])
    ? savedGoal
    : null;
}

export function updateGoal(goal: Goal): boolean {
  const goals = getGoals();
  const index = goals.findIndex((item) => item.id === goal.id);
  if (index === -1 || !isGoal(goal)) {
    return false;
  }

  goals[index] = goal;
  return writeArray(GOALS_STORAGE_KEY, goals);
}

export function deleteGoal(goalId: string): boolean {
  const goalsSaved = writeArray(
    GOALS_STORAGE_KEY,
    getGoals().filter((goal) => goal.id !== goalId),
  );
  const entriesSaved = writeArray(
    PROGRESS_STORAGE_KEY,
    getProgressEntries().filter((entry) => entry.goalId !== goalId),
  );
  return goalsSaved && entriesSaved;
}

export function getProgressEntries(): ProgressEntry[] {
  return readArray(PROGRESS_STORAGE_KEY).filter(isProgressEntry);
}

export function saveProgressEntry(
  entry: Omit<ProgressEntry, "id">,
): ProgressEntry | null {
  const entries = getProgressEntries();
  const existing = entries.find(
    (item) => item.goalId === entry.goalId && item.date === entry.date,
  );
  const savedEntry: ProgressEntry = {
    ...entry,
    id: existing?.id ?? createId(),
  };

  const nextEntries = [
    ...entries.filter(
      (item) => item.goalId !== entry.goalId || item.date !== entry.date,
    ),
    savedEntry,
  ];

  return writeArray(PROGRESS_STORAGE_KEY, nextEntries) ? savedEntry : null;
}

export function getProgressForGoal(goalId: string): ProgressEntry[] {
  return getProgressEntries().filter((entry) => entry.goalId === goalId);
}
