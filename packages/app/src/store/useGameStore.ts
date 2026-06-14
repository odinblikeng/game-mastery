"use client";

import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";
import { renumberMonsterCopies, isCharDead } from "@/lib/initiative";
import { pushUrlFromState } from "@/store/urlSync";
import type { Character, ResolvedCharacter } from "@/types/initiative";
import type { MonsterDataMap, MonsterSummary } from "@/types/monster";
import type { TreasureDataMap, TreasureSummary } from "@/types/treasure";

// Module-scoped ID counter — safe to use outside React render.
let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `char-${idCounter}`;
}

// ---------------------------------------------------------------------------
// Slice types
// ---------------------------------------------------------------------------

type StaticDataSlice = {
  monsters: MonsterSummary[];
  monsterDataMap: MonsterDataMap;
  treasures: TreasureSummary[];
  treasureDataMap: TreasureDataMap;
  registerStaticData: (
    monsters: MonsterSummary[],
    monsterDataMap: MonsterDataMap,
    treasures: TreasureSummary[],
    treasureDataMap: TreasureDataMap,
  ) => void;
};

type InitiativeSlice = {
  characters: Character[];
  resolved: ResolvedCharacter[];
  isReady: boolean;
  activeIndex: number;
  round: number;
  totalTurns: number;
  queuedSetupCount: number;

  addCharacter: (name: string, bonus: number) => void;
  addMonster: (slug: string) => void;
  updateCharacter: (id: string, field: "name" | "bonus" | "roll", value: string) => void;
  deleteCharacter: (id: string) => void;
  ready: () => void;
  reset: () => void;
  nextTurn: () => void;
  previousTurn: () => void;
  toggleDying: (id: string) => void;
  setHp: (id: string, value: string) => void;
  updateSaves: (id: string, field: "successes" | "failures", delta: number) => void;
  reorder: (activeId: string, overId: string) => void;
  clearQueuedSetupCount: () => void;
};

type UISlice = {
  openMonsterSlug: string | null;
  openTreasureSlug: string | null;
  areaSidebarOpen: boolean;
  selectedAreaSlug: string | null;
  toolsParam: string | null;
  colorMode: "light" | "dark" | "system";

  openStatBlock: (slug: string) => void;
  closeStatBlock: () => void;
  openTreasure: (slug: string) => void;
  closeTreasure: () => void;
  openAreaSidebar: () => void;
  closeAreaSidebar: () => void;
  selectArea: (slug: string) => void;
  setToolsParam: (value: string) => void;
  closeTools: () => void;
  setColorMode: (mode: "light" | "dark" | "system") => void;
};

export type GameStore = StaticDataSlice & InitiativeSlice & UISlice;

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useGameStore = create<GameStore>((set, get) => ({
  // -------------------------------------------------------------------------
  // Static data
  // -------------------------------------------------------------------------
  monsters: [],
  monsterDataMap: {},
  treasures: [],
  treasureDataMap: {},

  registerStaticData(monsters, monsterDataMap, treasures, treasureDataMap) {
    set({ monsters, monsterDataMap, treasures, treasureDataMap });
  },

  // -------------------------------------------------------------------------
  // Initiative
  // -------------------------------------------------------------------------
  characters: [],
  resolved: [],
  isReady: false,
  activeIndex: 0,
  round: 1,
  totalTurns: 0,
  queuedSetupCount: 0,

  addCharacter(name, bonus) {
    const trimmed = name.trim();
    if (!trimmed) return;
    set((state) => ({
      characters: [
        ...state.characters,
        { id: nextId(), name: trimmed, bonus, roll: "" },
      ],
    }));
  },

  addMonster(slug) {
    const { monsterDataMap, isReady } = get();
    const monster = monsterDataMap[slug];
    if (!monster) return;

    const monsterNameBySlug = new Map(
      get().monsters.map((m) => [m.slug, m.name]),
    );

    set((state) => {
      const newChar: Character = {
        id: nextId(),
        name: monster.name,
        bonus: monster.abilityScores.DEX.modifier,
        roll: "",
        maxHp: monster.hitPoints.value,
        monsterSlug: slug,
      };

      if (isReady) {
        // Already in combat — queue for next reset
        return { queuedSetupCount: state.queuedSetupCount + 1 };
      }

      return {
        characters: renumberMonsterCopies(
          [...state.characters, newChar],
          monsterNameBySlug,
        ),
      };
    });
  },

  updateCharacter(id, field, value) {
    set((state) => ({
      characters: state.characters.map((c) => {
        if (c.id !== id) return c;
        if (field === "name") return { ...c, name: value };
        if (field === "bonus") return { ...c, bonus: value === "" ? 0 : Number(value) };
        return { ...c, roll: value === "" ? "" : Number(value) };
      }),
    }));
  },

  deleteCharacter(id) {
    const { isReady, monsters } = get();
    const monsterNameBySlug = new Map(monsters.map((m) => [m.slug, m.name]));

    if (isReady) {
      set((state) => {
        const next = renumberMonsterCopies(
          state.resolved.filter((c) => c.id !== id),
          monsterNameBySlug,
        );
        return {
          resolved: next,
          activeIndex:
            next.length === 0 ? 0 : Math.min(state.activeIndex, next.length - 1),
        };
      });
    } else {
      set((state) => ({
        characters: renumberMonsterCopies(
          state.characters.filter((c) => c.id !== id),
          monsterNameBySlug,
        ),
      }));
    }
  },

  ready() {
    const { characters } = get();
    const sorted = characters
      .map((c) => ({
        id: c.id,
        name: c.name,
        bonus: c.bonus,
        total: (c.roll === "" ? 0 : c.roll) + c.bonus,
        dying: false,
        successes: 0,
        failures: 0,
        hp: c.maxHp,
        maxHp: c.maxHp,
        monsterSlug: c.monsterSlug,
        copyIndex: c.copyIndex,
      }))
      .sort((a, b) => {
        if (b.total !== a.total) return b.total - a.total;
        return b.bonus - a.bonus;
      });
    set({ resolved: sorted, isReady: true });
  },

  reset() {
    set({
      isReady: false,
      resolved: [],
      characters: [],
      activeIndex: 0,
      round: 1,
      totalTurns: 0,
      queuedSetupCount: 0,
    });
  },

  nextTurn() {
    set((state) => {
      const { resolved, activeIndex, round, totalTurns } = state;
      const len = resolved.length;
      if (len === 0) return {};
      let next = activeIndex;
      let nextRound = round;
      for (let step = 0; step < len; step++) {
        next = next >= len - 1 ? 0 : next + 1;
        if (next === 0) nextRound += 1;
        if (!isCharDead(resolved[next])) break;
      }
      return { activeIndex: next, round: nextRound, totalTurns: totalTurns + 1 };
    });
  },

  previousTurn() {
    set((state) => {
      const { resolved, activeIndex, round, totalTurns } = state;
      const len = resolved.length;
      if (len === 0) return {};
      let next = activeIndex;
      let nextRound = round;
      for (let step = 0; step < len; step++) {
        next = next <= 0 ? len - 1 : next - 1;
        if (next === len - 1) nextRound = Math.max(1, nextRound - 1);
        if (!isCharDead(resolved[next])) break;
      }
      return {
        activeIndex: next,
        round: nextRound,
        totalTurns: Math.max(0, totalTurns - 1),
      };
    });
  },

  toggleDying(id) {
    set((state) => ({
      resolved: state.resolved.map((c) =>
        c.id === id && typeof c.maxHp !== "number"
          ? { ...c, dying: !c.dying, successes: 0, failures: 0 }
          : c,
      ),
    }));
  },

  setHp(id, value) {
    set((state) => ({
      resolved: state.resolved.map((c) => {
        if (c.id !== id || typeof c.maxHp !== "number") return c;
        const next = value === "" ? 0 : Number(value);
        if (Number.isNaN(next)) return c;
        return { ...c, hp: Math.max(0, Math.min(c.maxHp, next)) };
      }),
    }));
  },

  updateSaves(id, field, delta) {
    set((state) => ({
      resolved: state.resolved.map((c) => {
        if (c.id !== id) return c;
        const val = Math.max(0, Math.min(3, c[field] + delta));
        return { ...c, [field]: val };
      }),
    }));
  },

  reorder(activeId, overId) {
    set((state) => {
      const oldIndex = state.resolved.findIndex((c) => c.id === activeId);
      const newIndex = state.resolved.findIndex((c) => c.id === overId);
      if (oldIndex === -1 || newIndex === -1) return {};
      return { resolved: arrayMove(state.resolved, oldIndex, newIndex) };
    });
  },

  clearQueuedSetupCount() {
    set({ queuedSetupCount: 0 });
  },

  // -------------------------------------------------------------------------
  // UI state
  // -------------------------------------------------------------------------
  openMonsterSlug: null,
  openTreasureSlug: null,
  areaSidebarOpen: true,
  selectedAreaSlug: null,
  toolsParam: null,
  colorMode: "system",

  openStatBlock(slug) {
    const { monsterDataMap } = get();
    if (!monsterDataMap[slug]) return;
    set({ openMonsterSlug: slug });
  },

  closeStatBlock() {
    set({ openMonsterSlug: null });
  },

  openTreasure(slug) {
    const { treasureDataMap } = get();
    if (!treasureDataMap[slug]) return;
    set({ openTreasureSlug: slug });
  },

  closeTreasure() {
    set({ openTreasureSlug: null });
  },

  openAreaSidebar() {
    const state = get();
    set({ areaSidebarOpen: true });
    pushUrlFromState({ areaSidebarOpen: true, selectedAreaSlug: state.selectedAreaSlug, toolsParam: state.toolsParam });
  },

  closeAreaSidebar() {
    set({ areaSidebarOpen: false });
  },

  selectArea(slug) {
    set({ selectedAreaSlug: slug, areaSidebarOpen: true });
  },

  setToolsParam(value) {
    const state = get();
    set({ toolsParam: value });
    pushUrlFromState({ areaSidebarOpen: state.areaSidebarOpen, selectedAreaSlug: state.selectedAreaSlug, toolsParam: value });
  },

  closeTools() {
    const state = get();
    set({ toolsParam: null });
    pushUrlFromState({ areaSidebarOpen: state.areaSidebarOpen, selectedAreaSlug: state.selectedAreaSlug, toolsParam: null });
  },

  setColorMode(mode) {
    set({ colorMode: mode });
  },
}));

// ---------------------------------------------------------------------------
// Typed selector helpers
// ---------------------------------------------------------------------------

export const selectMonsters = (s: GameStore) => s.monsters;
export const selectMonsterDataMap = (s: GameStore) => s.monsterDataMap;
export const selectInitiative = (s: GameStore) => ({
  characters: s.characters,
  resolved: s.resolved,
  isReady: s.isReady,
  activeIndex: s.activeIndex,
  round: s.round,
  totalTurns: s.totalTurns,
  queuedSetupCount: s.queuedSetupCount,
});
export const selectUI = (s: GameStore) => ({
  openMonsterSlug: s.openMonsterSlug,
  openTreasureSlug: s.openTreasureSlug,
  areaSidebarOpen: s.areaSidebarOpen,
  selectedAreaSlug: s.selectedAreaSlug,
  toolsParam: s.toolsParam,
  colorMode: s.colorMode,
});
