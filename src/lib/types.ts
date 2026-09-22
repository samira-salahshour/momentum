export const GOAL_METRICS = [
  "steps",
  "water",
  "reading",
  "workout",
  "meditation",
  "custom",
] as const;

export type GoalMetric = (typeof GOAL_METRICS)[number];

export type Goal = {
  id: string;
  title: string;
  metric: GoalMetric;
  target: number;
  unit: string;
  startDate: string;
  endDate: string;
};

export type ProgressEntry = {
  id: string;
  goalId: string;
  date: string;
  value: number;
};
