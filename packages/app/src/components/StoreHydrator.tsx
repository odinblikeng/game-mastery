"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useColorScheme } from "@mui/material/styles";
import { useGameStore } from "@/store/useGameStore";
import type { MonsterDataMap, MonsterSummary } from "@/types/monster";
import type { TreasureDataMap, TreasureSummary } from "@/types/treasure";

type StoreHydratorProps = {
  monsters: MonsterSummary[];
  monsterDataMap: MonsterDataMap;
  treasures: TreasureSummary[];
  treasureDataMap: TreasureDataMap;
};

/**
 * Registers server-loaded static data in the Zustand store and keeps UI
 * state in sync with Next.js navigation events.
 *
 * Area sidebar + selected area state is driven by Next.js URL navigation
 * (so that page.tsx server components receive the correct searchParams for
 * area content). This component subscribes to useSearchParams to sync the
 * store whenever that URL-driven navigation occurs.
 *
 * Tools sidebar state is store-owned (no server re-render needed); it is
 * only seeded from URL on the initial mount for deep-link support.
 *
 * Must be a client component — rendered once inside AppShell.
 * Renders nothing.
 */
export default function StoreHydrator({
  monsters,
  monsterDataMap,
  treasures,
  treasureDataMap,
}: StoreHydratorProps) {
  const searchParams = useSearchParams();
  const { mode } = useColorScheme();
  const registerStaticData = useGameStore((s) => s.registerStaticData);
  const setColorMode = useGameStore((s) => s.setColorMode);
  const openAreaSidebar = useGameStore((s) => s.openAreaSidebar);
  const selectArea = useGameStore((s) => s.selectArea);
  const closeAreaSidebar = useGameStore((s) => s.closeAreaSidebar);
  const setToolsParam = useGameStore((s) => s.setToolsParam);

  // Register static data on mount — runs once per page session.
  useEffect(() => {
    registerStaticData(monsters, monsterDataMap, treasures, treasureDataMap);
  }, [monsters, monsterDataMap, treasures, treasureDataMap, registerStaticData]);

  // Sync area sidebar and selected area from URL on every Next.js navigation.
  // Area content is server-rendered by page.tsx based on URL searchParams,
  // so area selection always goes through Next.js router.push (Link clicks).
  // This effect keeps the store in sync with those URL-driven navigations.
  useEffect(() => {
    const sidebar = searchParams.get("sidebar");
    const area = searchParams.get("area");

    const store = useGameStore.getState();
    const nextAreaSidebarOpen = sidebar === "areas" || Boolean(area);
    const nextSelectedAreaSlug = area ?? null;

    if (nextSelectedAreaSlug && store.selectedAreaSlug !== nextSelectedAreaSlug) {
      selectArea(nextSelectedAreaSlug);
    } else if (!nextSelectedAreaSlug && nextAreaSidebarOpen && !store.areaSidebarOpen) {
      openAreaSidebar();
    } else if (!nextAreaSidebarOpen && store.areaSidebarOpen) {
      closeAreaSidebar();
    }
  }, [searchParams, selectArea, openAreaSidebar, closeAreaSidebar]);

  // Seed tools param from URL on initial mount only (deep-link support).
  // After mount, tools param is owned by the store and synced to URL via
  // window.history.pushState — no Next.js re-render needed for tools.
  useEffect(() => {
    const tools = searchParams.get("tools");
    const store = useGameStore.getState();
    if (store.toolsParam === null && tools) {
      setToolsParam(tools);
    } else if (store.toolsParam !== null && !tools) {
      // URL has no tools but store does — store wins, do nothing.
    }
    // Intentionally run only once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync MUI color mode to store whenever it changes.
  useEffect(() => {
    if (mode === "light" || mode === "dark" || mode === "system") {
      setColorMode(mode);
    }
  }, [mode, setColorMode]);

  return null;
}

