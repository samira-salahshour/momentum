"use client";

import { Card, CardBody } from "@samira-salahshour/ui";
import Link from "next/link";

import { useStoredData } from "@/src/hooks/use-stored-data";
import { progressPercentage } from "@/src/lib/analytics";
import { formatDate } from "@/src/lib/dates";
import { getGoals, getProgressEntries } from "@/src/lib/storage";

export function HistoryClient() {
  const goals = useStoredData(getGoals);
  const entries = useStoredData(getProgressEntries);

  if (!goals || !entries) {
    return <p className="text-sm text-slate-500">Loading your history…</p>;
  }

  const goalMap = new Map(goals.map((goal) => [goal.id, goal]));
  const history = [...entries]
    .filter((entry) => goalMap.has(entry.goalId))
    .sort((a, b) => b.date.localeCompare(a.date));

  if (history.length === 0) {
    return (
      <Card className="empty-card">
        <CardBody className="py-14 text-center">
          <h2 className="text-lg font-semibold text-slate-950">
            No history yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Your saved daily progress will appear here.
          </p>
          <Link className="primary-link mt-6" href="/log">
            Log today
          </Link>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Goal</th>
                <th className="px-5 py-3">Value</th>
                <th className="px-5 py-3 text-right">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {history.map((entry) => {
                const goal = goalMap.get(entry.goalId)!;
                return (
                  <tr key={entry.id}>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                      {formatDate(entry.date)}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-950">{goal.title}</p>
                      <p className="mt-1 text-xs capitalize text-slate-400">
                        {goal.metric}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-900">
                      {entry.value.toLocaleString()} {goal.unit}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="metric-pill">
                        {progressPercentage(entry.value, goal.target)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}
