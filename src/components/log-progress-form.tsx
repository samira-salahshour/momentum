"use client";

import { Button, Card, CardBody, Input } from "@samira-salahshour/ui";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { useStoredData } from "@/src/hooks/use-stored-data";
import { toDateKey } from "@/src/lib/dates";
import {
  getGoals,
  getProgressEntries,
  saveProgressEntry,
} from "@/src/lib/storage";

export function LogProgressForm() {
  const storedGoals = useStoredData(getGoals);
  const entries = useStoredData(getProgressEntries);
  const [goalId, setGoalId] = useState("");
  const [value, setValue] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const today = toDateKey();
  const goals = storedGoals?.filter(
      (goal) => goal.startDate <= today && goal.endDate >= today,
    ) ?? null;
  const effectiveGoalId = goalId || goals?.[0]?.id || "";
  const existingEntry = entries?.find(
    (entry) => entry.goalId === effectiveGoalId && entry.date === today,
  );
  const displayedValue =
    value ?? (existingEntry ? String(existingEntry.value) : "");

  function selectGoal(nextGoalId: string) {
    const existing = entries?.find(
      (entry) => entry.goalId === nextGoalId && entry.date === today,
    );
    setGoalId(nextGoalId);
    setValue(existing ? String(existing.value) : "");
    setError("");
    setIsSaved(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const numericValue = Number(displayedValue);
    if (!effectiveGoalId) {
      setError("Choose a goal.");
      return;
    }
    if (
      !Number.isFinite(numericValue) ||
      numericValue < 0 ||
      displayedValue === ""
    ) {
      setError("Enter a value of zero or more.");
      return;
    }

    const savedEntry = saveProgressEntry({
      goalId: effectiveGoalId,
      date: today,
      value: numericValue,
    });
    if (!savedEntry) {
      setError("Momentum could not save this entry. Try again.");
      return;
    }

    setValue(String(savedEntry.value));
    setError("");
    setIsSaved(true);
  }

  if (!goals || !entries) {
    return <p className="text-sm text-slate-500">Loading your goals…</p>;
  }

  if (goals.length === 0) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardBody className="py-12 text-center">
          <h2 className="text-lg font-semibold text-slate-950">
            No goals to log today
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Create a goal with a date range that includes today before logging
            progress.
          </p>
          <Link className="primary-link mt-6" href="/goals/new">
            Create a goal
          </Link>
        </CardBody>
      </Card>
    );
  }

  const selectedGoal = goals.find((goal) => goal.id === effectiveGoalId);
  const isUpdate = entries.some(
    (entry) => entry.goalId === effectiveGoalId && entry.date === today,
  );

  return (
    <Card className="mx-auto max-w-2xl">
      <CardBody className="p-6 sm:p-8">
        <form className="space-y-6" noValidate onSubmit={handleSubmit}>
          <div>
            <label className="field-label" htmlFor="goal">
              Goal
            </label>
            <select
              className="select-field"
              id="goal"
              onChange={(event) => selectGoal(event.target.value)}
              value={effectiveGoalId}
            >
              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title}
                </option>
              ))}
            </select>
          </div>

          <Input
            error={error}
            helperText={
              selectedGoal
                ? `Daily target: ${selectedGoal.target.toLocaleString()} ${selectedGoal.unit}`
                : undefined
            }
            inputMode="decimal"
            label={`Today's value${selectedGoal ? ` (${selectedGoal.unit})` : ""}`}
            min="0"
            onChange={(event) => {
              setValue(event.target.value);
              setError("");
              setIsSaved(false);
            }}
            step="any"
            type="number"
            value={displayedValue}
          />

          {isSaved && (
            <div
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              role="status"
            >
              Today&apos;s progress was saved.
            </div>
          )}

          <div className="flex justify-end border-t border-slate-200 pt-6">
            <Button size="lg" type="submit">
              {isUpdate ? "Update progress" : "Save progress"}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
