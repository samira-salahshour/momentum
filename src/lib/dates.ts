const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function toDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateKey(value: string): Date | null {
  if (!DATE_PATTERN.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  date.setHours(0, 0, 0, 0);
  return date;
}

export function shiftDateKey(dateKey: string, days: number): string {
  const date = parseDateKey(dateKey);
  if (!date) {
    return dateKey;
  }

  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

export function formatDate(dateKey: string): string {
  const date = parseDateKey(dateKey);
  if (!date) {
    return dateKey;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
