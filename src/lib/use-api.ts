"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, apiGet } from "./api";

interface UseApiResult<T, M> {
  data: T | null;
  meta: M | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

/** Loads an authenticated API resource and exposes a manual reload. */
export function useApi<T, M = unknown>(path: string | null): UseApiResult<T, M> {
  const [data, setData] = useState<T | null>(null);
  const [meta, setMeta] = useState<M | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    // Reset before every fetch so switching a filter shows a loading state
    // instead of the previous filter's rows (or a stale error message).
    setLoading(true);
    setError(null);
    if (!path) {
      setData(null);
      setMeta(null);
      setLoading(false);
      return;
    }
    try {
      const response = await apiGet<T, M>(path);
      setData(response.data);
      setMeta(response.meta ?? null);
    } catch (requestError) {
      setError(
        requestError instanceof ApiError ? requestError.message : "Could not load this data"
      );
    } finally {
      setLoading(false);
    }
  }, [path]);

  /** Manual refresh used by buttons; shows the loading state immediately. */
  const reload = useCallback(async () => {
    await load();
  }, [load]);

  useEffect(() => {
    // Data fetching belongs in an async task, not in the effect body itself.
    void (async () => {
      await load();
    })();
  }, [load]);

  return { data, meta, loading, error, reload };
}
