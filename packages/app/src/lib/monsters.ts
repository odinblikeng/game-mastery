import "server-only";

import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { MonsterData, MonsterSummary } from "@/types/monster";

const monsterDirectoryPath = join(process.cwd(), "src", "content", "monsters");

let cachedMonsterListPromise: Promise<MonsterSummary[]> | null = null;

function isMonsterData(value: unknown): value is MonsterData {
  if (!value || typeof value !== "object") {
    return false;
  }

  const monster = value as Record<string, unknown>;
  const abilityScores = monster.abilityScores as Record<string, unknown> | undefined;
  const dex = abilityScores?.DEX as Record<string, unknown> | undefined;
  const hitPoints = monster.hitPoints as Record<string, unknown> | undefined;

  return (
    typeof monster.name === "string" &&
    typeof hitPoints?.value === "number" &&
    typeof dex?.modifier === "number"
  );
}

async function importMonster(slug: string): Promise<MonsterData> {
  const monsterModule = (await import(`../content/monsters/${slug}/index.json`)) as {
    default: unknown;
  };

  if (!isMonsterData(monsterModule.default)) {
    throw new Error(
      `Monster file "${slug}/index.json" must include name, hitPoints.value, and abilityScores.DEX.modifier.`,
    );
  }

  return monsterModule.default;
}

async function buildMonsterList(): Promise<MonsterSummary[]> {
  const monsterSlugs = readdirSync(monsterDirectoryPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((slug) => {
      try {
        return readdirSync(join(monsterDirectoryPath, slug)).includes("index.json");
      } catch {
        return false;
      }
    });

  const monsters = await Promise.all(
    monsterSlugs.map(async (slug) => {
      const monster = await importMonster(slug);

      return {
        slug,
        name: monster.name,
        dexModifier: monster.abilityScores.DEX.modifier,
        hp: monster.hitPoints.value,
      } satisfies MonsterSummary;
    }),
  );

  return monsters.sort((a, b) => a.name.localeCompare(b.name));
}

async function loadMonsterList(): Promise<MonsterSummary[]> {
  if (process.env.NODE_ENV !== "production") {
    return buildMonsterList();
  }

  cachedMonsterListPromise ??= buildMonsterList();

  return cachedMonsterListPromise;
}

export async function getMonsterList(): Promise<MonsterSummary[]> {
  return loadMonsterList();
}