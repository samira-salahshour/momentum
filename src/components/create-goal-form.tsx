"use client";

import { Button, Card, CardBody, Input } from "@samira-salahshour/ui";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { shiftDateKey, toDateKey } from "@/src/lib/dates";
import { saveGoal } from "@/src/lib/storage";
import { GOAL_METRICS, type GoalMetric } from "@/src/lib/types";

type FormErrors = Partial<
  Record<"title" | "target" | "unit" | "startDate" | "endDate" | "form", string>
>;

const DEFAULT_UNITS: Record<GoalMetric, string> = {
  steps: "steps",
  water: "glasses",
  reading: "pages",
  workout: "minutes",
  meditation: "minutes",
  custom: "",
};

export function CreateGoalForm() {
  const router = useRouter();
  const today = toDateKey();
  const [title, setTitle] = useState("");
  const [metric, setMetric] = useState<GoalMetric>("steps");
  const [target, setTarget] = useState("");
  const [unit, setUnit] = useState(DEFAULT_UNITS.steps);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(shiftDateKey(today, 30));
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};
    const numericTarget = Number(target);

    if (!title.trim()) nextErrors.title = "Enter a goal title.";
    if (!Number.isFinite(numericTarget) || numericTarget <= 0) {
      nextErrors.target = "Target must be greater than zero.";
    }
    if (!unit.trim()) nextErrors.unit = "Enter a unit.";
    if (!startDate) nextErrors.startDate = "Choose a start date.";
    if (!endDate) nextErrors.endDate = "Choose an end date.";
    if (startDate && endDate && endDate < startDate) {
      nextErrors.endDate = "End date must be on or after the start date.";
    }

    return nextErrors;
  }

  function handleMetricChange(nextMetric: GoalMetric) {
    setMetric(nextMetric);
    setUnit(DEFAULT_UNITS[nextMetric]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSaving(true);
    const goal = saveGoal({
      title: title.trim(),
      metric,
      target: Number(target),
      unit: unit.trim(),
      startDate,
      endDate,
    });

    if (!goal) {
      setErrors({ form: "Momentum could not save this goal. Try again." });
      setIsSaving(false);
      return;
    }

    router.push("/");
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardBody className="p-6 sm:p-8">
        <form className="space-y-6" noValidate onSubmit={handleSubmit}>
          <Input
            autoComplete="off"
            error={errors.title}
            label="Goal title"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Walk every day"
            value={title}
          />

          <div>
            <label className="field-label" htmlFor="metric">
              Metric
            </label>
            <select
              className="select-field"
              id="metric"
              onChange={(event) =>
                handleMetricChange(event.target.value as GoalMetric)
              }
              value={metric}
            >
              {GOAL_METRICS.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              error={errors.target}
              inputMode="decimal"
              label="Daily target"
              min="0"
              onChange={(event) => setTarget(event.target.value)}
              placeholder="8,000"
              step="any"
              type="number"
              value={target}
            />
            <Input
              error={errors.unit}
              label="Unit"
              onChange={(event) => setUnit(event.target.value)}
              placeholder="steps, pages, minutes…"
              value={unit}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              error={errors.startDate}
              label="Start date"
              onChange={(event) => setStartDate(event.target.value)}
              type="date"
              value={startDate}
            />
            <Input
              error={errors.endDate}
              label="End date"
              min={startDate}
              onChange={(event) => setEndDate(event.target.value)}
              type="date"
              value={endDate}
            />
          </div>

          {errors.form && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {errors.form}
            </p>
          )}

          <div className="flex justify-end border-t border-slate-200 pt-6">
            <Button loading={isSaving} size="lg" type="submit">
              Create goal
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
