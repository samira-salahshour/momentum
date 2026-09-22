# Momentum

Momentum is a lightweight consistency and goal-tracking application built with Next.js and TypeScript.

It allows users to create measurable goals, log daily progress, track streaks, view weekly averages, and review progress history.

## Features

- Create measurable goals
- Track daily progress
- Update progress for the same goal and date without duplicates
- View current streak
- View weekly average
- View recent activity and history
- Persistent local storage
- Empty, validation, loading, and success states
- Responsive UI

## Supported goal types

- Steps
- Water
- Reading
- Workout
- Meditation
- Custom

## Tech stack

- Next.js
- React
- TypeScript
- App Router
- Tailwind CSS
- `@samira-salahshour/ui`

## UI component library

Momentum consumes my reusable React UI package:

`@samira-salahshour/ui`

The package is published separately and contains reusable components such as:

- Button
- Input
- Card
- Modal

This keeps generic UI components separate from application-specific business logic.

## Architecture

The application keeps persistence, business logic, and presentation separate.

Key areas:

- `src/lib/storage.ts` - localStorage persistence
- `src/lib/analytics.ts` - progress, streak, and weekly average calculations
- `src/lib/dates.ts` - date-related utilities
- `src/components/` - application-specific interactive components

Local storage is intentionally isolated behind a small persistence layer so it can later be replaced with an API or database without coupling the rest of the application to browser storage.

## Data model

```ts
type Goal = {
  id: string;
  title: string;
  metric: GoalMetric;
  target: number;
  unit: string;
  startDate: string;
  endDate: string;
};

type ProgressEntry = {
  id: string;
  goalId: string;
  date: string;
  value: number;
};