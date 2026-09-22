"use client";

import { useMemo, useSyncExternalStore } from "react";

import {
  getServerStorageSnapshot,
  getStorageSnapshot,
  subscribeToStorage,
} from "@/src/lib/storage";

export function useStoredData<T>(reader: () => T): T | null {
  const snapshot = useSyncExternalStore(
    subscribeToStorage,
    getStorageSnapshot,
    getServerStorageSnapshot,
  );

  return useMemo(
    () => (snapshot === getServerStorageSnapshot() ? null : reader()),
    [reader, snapshot],
  );
}
