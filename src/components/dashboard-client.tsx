"use client";

import { Card, CardBody, CardHeader } from "@samira-salahshour/ui";
import Link from "next/link";

import { useStoredData } from "@/src/hooks/use-stored-data";
import {
  currentStreak,
  progressPercentage,
  weeklyAverage,
} from "@/src/lib/analytics";
import { formatDate, toDateKey } from "@/src/lib/dates";
import { getGoals, getProgressEntries } from "@/src/lib/storage";

export function DashboardClient() {
  const goals = useStoredData(getGoals);
  const entries = useStoredData(getProgressEntries);

  if (!goals || !entries) {
    return <p className="text-sm text-slate-500">Loading your goals…</p>;
  }

  if (goals.length === 0) {
    return (
      <Card className="empty-card">
        <CardBody className="py-14 text-center">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-indigo-50 text-xl">
            ◎
          </div>
          <h2 className="text-lg font-semibold text-slate-950">
            Start with one goal
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Create a measurable goal, then return each day to log your
            progress and build consistency.
          </p>
          <Link className="primary-link mt-6" href="/goals/new">
            Create your first goal
          </Link>
        </CardBody>
      </Card>
    );
  }

  const today = toDateKey();
  const activeGoals = goals.filter(
    (goal) => goal.startDate <= today && goal.endDate >= today,
  );
  const goalMap = new Map(goals.map((goal) => [goal.id, goal]));
  const recentEntries = [...entries]
    .filter((entry) => goalMap.has(entry.goalId))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Today</p>
            <h2 className="section-title">Active goals</h2>
          </div>
          {activeGoals.length > 0 && (
            <Link className="secondary-link" href="/log">
              Log today
            </Link>
          )}
        </div>

        {activeGoals.length === 0 ? (
          <Card>
            <CardBody>
              <p className="font-medium text-slate-900">
                No goals are active today.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Create a new goal or return during one of your goal periods.
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {activeGoals.map((goal) => {
              const goalEntries = entries.filter(
                (entry) => entry.goalId === goal.id,
              );
              const todayValue =
                goalEntries.find((entry) => entry.date === today)?.value ?? 0;
              const percentage = progressPercentage(todayValue, goal.target);

              return (
                <Card key={goal.id}>
                  <CardHeader className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-slate-950">
                        {goal.title}
                      </p>
                      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                        {goal.metric}
                      </p>
                    </div>
                    <span className="metric-pill">
                      {todayValue.toLocaleString()} /{" "}
                      {goal.target.toLocaleString()} {goal.unit}
                    </span>
                  </CardHeader>
                  <CardBody>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-slate-500">Today&apos;s progress</span>
                      <span className="font-semibold text-slate-900">
                        {percentage}%
                      </span>
                    </div>
                    <div
                      aria-label={`${percentage}% complete`}
                      className="progress-track"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.min(percentage, 100)}
                    >
                      <span
                        className="progress-value"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <dl className="mt-5 grid grid-cols-2 divide-x divide-slate-200 rounded-lg bg-slate-50 py-3">
                      <div className="px-4">
                        <dt className="text-xs text-slate-500">
                          Current streak
                        </dt>
                        <dd className="mt-1 font-semibold text-slate-950">
                          {currentStreak(goalEntries, goal.target, today)} days
                        </dd>
                      </div>
                      <div className="px-4">
                        <dt className="text-xs text-slate-500">
                          Weekly average
                        </dt>
                        <dd className="mt-1 font-semibold text-slate-950">
                          {weeklyAverage(goalEntries, today).toLocaleString()}{" "}
                          {goal.unit}
                        </dd>
                      </div>
                    </dl>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Activity</p>
            <h2 className="section-title">Recent entries</h2>
          </div>
          <Link className="text-link" href="/history">
            View history
          </Link>
        </div>
        <Card>
          <CardBody className="p-0">
            {recentEntries.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-500">
                No progress logged yet.
              </p>
            ) : (
              <ul className="divide-y divide-slate-200">
                {recentEntries.map((entry) => {
                  const goal = goalMap.get(entry.goalId)!;
                  return (
                    <li
                      className="flex items-center justify-between gap-4 px-5 py-4"
                      key={entry.id}
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {goal.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {formatDate(entry.date)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-950">
                        {entry.value.toLocaleString()} {goal.unit}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
