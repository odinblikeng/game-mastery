"use client";

import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";
import { useId, useRef, useState } from "react";
import type { MonsterSummary } from "@/types/monster";
import type { Character, ResolvedCharacter } from "@/types/initiative";
import { isCharDead, renumberMonsterCopies } from "@/lib/initiative";

export default function useInitiativeTracker(monsters: MonsterSummary[]) {
  const baseId = useId();
  const nextIdRef = useRef(0);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const shouldRefocusNameInputRef = useRef(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [resolved, setResolved] = useState<ResolvedCharacter[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [totalTurns, setTotalTurns] = useState(0);
  const [newName, setNewName] = useState("");
  const [newBonus, setNewBonus] = useState("");
  const [monsterMenuAnchor, setMonsterMenuAnchor] = useState<HTMLElement | null>(null);

  const monsterNameBySlug = new Map(monsters.map((monster) => [monster.slug, monster.name]));

  const nextId = () => {
    nextIdRef.current += 1;
    return `${baseId}-${nextIdRef.current}`;
  };

  const handleColumnTab = (
    e: React.KeyboardEvent,
    col: string,
    index: number,
  ) => {
    if (e.key !== "Tab" || e.shiftKey) return;
    const container = listRef.current;
    if (!container) return;

    const nextInCol = container.querySelector<HTMLInputElement>(
      `[data-col="${col}"][data-row="${index + 1}"]`,
    );
    if (nextInCol) {
      e.preventDefault();
      nextInCol.focus();
      return;
    }

    const nextCol = col === "bonus" ? "roll" : null;
    if (nextCol) {
      const first = container.querySelector<HTMLInputElement>(
        `[data-col="${nextCol}"][data-row="0"]`,
      );
      if (first) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const addCharacter = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setCharacters((prev) => [
      ...prev,
      {
        id: nextId(),
        name: trimmed,
        bonus: newBonus === "" ? 0 : Number(newBonus),
        roll: "",
      },
    ]);
    setNewName("");
    setNewBonus("");
    nameInputRef.current?.focus();
  };

  const addMonsterCharacter = (monster: MonsterSummary) => {
    setCharacters((prev) =>
      renumberMonsterCopies(
        [
          ...prev,
          {
            id: nextId(),
            name: monster.name,
            bonus: monster.dexModifier,
            roll: "",
            maxHp: monster.hp,
            monsterSlug: monster.slug,
          },
        ],
        monsterNameBySlug,
      ),
    );
    shouldRefocusNameInputRef.current = true;
    setMonsterMenuAnchor(null);
  };

  const handleMonsterMenuExited = () => {
    if (!shouldRefocusNameInputRef.current) {
      return;
    }

    shouldRefocusNameInputRef.current = false;
    nameInputRef.current?.focus();
  };

  const updateCharacter = (
    id: string,
    field: "name" | "bonus" | "roll",
    value: string,
  ) => {
    setCharacters((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        if (field === "name") return { ...c, name: value };
        if (field === "bonus")
          return { ...c, bonus: value === "" ? 0 : Number(value) };
        return { ...c, roll: value === "" ? "" : Number(value) };
      }),
    );
  };

  const deleteCharacter = (id: string) => {
    if (isReady) {
      setResolved((prev) => {
        const next = renumberMonsterCopies(
          prev.filter((c) => c.id !== id),
          monsterNameBySlug,
        );
        setActiveIndex((i) =>
          next.length === 0 ? 0 : Math.min(i, next.length - 1),
        );
        return next;
      });
    } else {
      setCharacters((prev) =>
        renumberMonsterCopies(
          prev.filter((c) => c.id !== id),
          monsterNameBySlug,
        ),
      );
    }
  };

  const handleReady = () => {
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
    setResolved(sorted);
    setIsReady(true);
  };

  const handleReset = () => {
    setIsReady(false);
    setResolved([]);
    setCharacters([]);
    setActiveIndex(0);
    setRound(1);
    setTotalTurns(0);
  };

  const toggleDying = (id: string) => {
    setResolved((prev) =>
      prev.map((c) =>
        c.id === id && typeof c.maxHp !== "number"
          ? { ...c, dying: !c.dying, successes: 0, failures: 0 }
          : c,
      ),
    );
  };

  const setHp = (id: string, value: string) => {
    setResolved((prev) =>
      prev.map((c) => {
        if (c.id !== id || typeof c.maxHp !== "number") {
          return c;
        }

        const nextValue = value === "" ? 0 : Number(value);

        if (Number.isNaN(nextValue)) {
          return c;
        }

        return {
          ...c,
          hp: Math.max(0, Math.min(c.maxHp, nextValue)),
        };
      }),
    );
  };

  const updateSaves = (
    id: string,
    field: "successes" | "failures",
    delta: number,
  ) => {
    setResolved((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const val = Math.max(0, Math.min(3, c[field] + delta));
        return { ...c, [field]: val };
      }),
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setResolved((prev) => {
        const oldIndex = prev.findIndex((c) => c.id === active.id);
        const newIndex = prev.findIndex((c) => c.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const previousTurn = () => {
    const len = resolved.length;
    let next = activeIndex;
    for (let step = 0; step < len; step++) {
      next = next <= 0 ? len - 1 : next - 1;
      if (next === len - 1) setRound((r) => Math.max(1, r - 1));
      if (!isCharDead(resolved[next])) break;
    }
    setActiveIndex(next);
    setTotalTurns((t) => Math.max(0, t - 1));
  };

  const nextTurn = () => {
    const len = resolved.length;
    let next = activeIndex;
    for (let step = 0; step < len; step++) {
      next = next >= len - 1 ? 0 : next + 1;
      if (next === 0) setRound((r) => r + 1);
      if (!isCharDead(resolved[next])) break;
    }
    setActiveIndex(next);
    setTotalTurns((t) => t + 1);
  };

  const openMonsterMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMonsterMenuAnchor(event.currentTarget);
  };

  const closeMonsterMenu = () => {
    setMonsterMenuAnchor(null);
  };

  return {
    nameInputRef,
    listRef,
    characters,
    resolved,
    isReady,
    activeIndex,
    round,
    totalTurns,
    newName,
    newBonus,
    monsterMenuAnchor,
    setNewName,
    setNewBonus,
    addCharacter,
    addMonsterCharacter,
    handleMonsterMenuExited,
    updateCharacter,
    deleteCharacter,
    handleReady,
    handleReset,
    toggleDying,
    setHp,
    updateSaves,
    handleDragEnd,
    handleColumnTab,
    previousTurn,
    nextTurn,
    openMonsterMenu,
    closeMonsterMenu,
  };
}
