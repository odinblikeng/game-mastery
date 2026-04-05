import type { MonsterNamedEntry, ResolvedCharacter } from "@/types/initiative";

export const toTestId = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const renumberMonsterCopies = <T extends MonsterNamedEntry>(
  items: T[],
  monsterNameBySlug: Map<string, string>,
): T[] => {
  const totals = new Map<string, number>();

  for (const item of items) {
    if (!item.monsterSlug) {
      continue;
    }

    totals.set(item.monsterSlug, (totals.get(item.monsterSlug) ?? 0) + 1);
  }

  const seen = new Map<string, number>();

  return items.map((item) => {
    if (!item.monsterSlug) {
      return item;
    }

    const total = totals.get(item.monsterSlug) ?? 0;
    const baseName = monsterNameBySlug.get(item.monsterSlug) ?? item.name.replace(/ \d+$/, "");
    const index = (seen.get(item.monsterSlug) ?? 0) + 1;
    const nextName = total > 1 ? `${baseName} ${index}` : baseName;
    const nextCopyIndex = total > 1 ? index : undefined;

    seen.set(item.monsterSlug, index);

    return item.name === nextName && item.copyIndex === nextCopyIndex
      ? item
      : { ...item, name: nextName, copyIndex: nextCopyIndex };
  });
};

export const isCharDead = (c: ResolvedCharacter) =>
  typeof c.maxHp === "number" ? (c.hp ?? c.maxHp) <= 0 : c.dying && c.failures >= 3;

export const formatTime = (turns: number) => {
  const seconds = turns * 6;
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
};
