"use client";

import { createContext, useContext, useState } from "react";
import useQueryParams from "@/hooks/useQueryParams";
import type { MonsterDataMap, MonsterSummary } from "@/types/monster";

type MonsterOverlayContextValue = {
  monsterDataMap: MonsterDataMap;
  openSlug: string | null;
  pendingMonsters: MonsterSummary[];
  openStatBlock: (slug: string) => void;
  closeStatBlock: () => void;
  addToInitiative: (slug: string) => void;
};

const MonsterOverlayContext = createContext<MonsterOverlayContextValue | undefined>(undefined);

type MonsterOverlayProviderProps = {
  monsterDataMap: MonsterDataMap;
  children: React.ReactNode;
};

export function MonsterOverlayProvider({ monsterDataMap, children }: MonsterOverlayProviderProps) {
  const { set } = useQueryParams();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [pendingMonsters, setPendingMonsters] = useState<MonsterSummary[]>([]);

  const openStatBlock = (slug: string) => {
    if (!monsterDataMap[slug]) {
      return;
    }

    setOpenSlug(slug);
  };

  const closeStatBlock = () => {
    setOpenSlug(null);
  };

  const addToInitiative = (slug: string) => {
    const monster = monsterDataMap[slug];

    if (!monster) {
      return;
    }

    setPendingMonsters((current) => [
      ...current,
      {
        slug,
        name: monster.name,
        dexModifier: monster.abilityScores.DEX.modifier,
        hp: monster.hitPoints.value,
      },
    ]);
    setOpenSlug(null);
    set({ tools: "initiative" });
  };

  return (
    <MonsterOverlayContext.Provider
      value={{
        monsterDataMap,
        openSlug,
        pendingMonsters,
        openStatBlock,
        closeStatBlock,
        addToInitiative,
      }}
    >
      {children}
    </MonsterOverlayContext.Provider>
  );
}

export function useMonsterOverlay() {
  const context = useContext(MonsterOverlayContext);

  if (!context) {
    throw new Error("useMonsterOverlay must be used within a MonsterOverlayProvider.");
  }

  return context;
}

export function useOptionalMonsterOverlay() {
  return useContext(MonsterOverlayContext);
}