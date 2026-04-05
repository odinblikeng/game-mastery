"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

function buildUrl(params: URLSearchParams): string {
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export default function useQueryParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const get = useCallback(
    (key: string) => searchParams.get(key),
    [searchParams],
  );

  const has = useCallback(
    (key: string) => searchParams.has(key),
    [searchParams],
  );

  const set = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        params.set(key, value);
      }
      router.push(buildUrl(params));
    },
    [router, searchParams],
  );

  const remove = useCallback(
    (...keys: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const key of keys) {
        params.delete(key);
      }
      router.push(buildUrl(params));
    },
    [router, searchParams],
  );

  const buildHref = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        params.set(key, value);
      }
      return buildUrl(params);
    },
    [searchParams],
  );

  return { get, has, set, remove, buildHref } as const;
}
