import "server-only";

import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { TreasureData, TreasureDataMap, TreasureSummary } from "@/types/treasure";

const treasureDirectoryPath = join(process.cwd(), "src", "content", "treasures");

let cachedTreasureListPromise: Promise<TreasureSummary[]> | null = null;

function isTreasureData(value: unknown): value is TreasureData {
  if (!value || typeof value !== "object") {
    return false;
  }

  const treasure = value as Record<string, unknown>;

  return (
    typeof treasure.name === "string" &&
    typeof treasure.description === "string"
  );
}

async function importTreasure(slug: string): Promise<TreasureData> {
  const treasureModule = (await import(`../content/treasures/${slug}/index.json`)) as {
    default: unknown;
  };

  if (!isTreasureData(treasureModule.default)) {
    throw new Error(
      `Treasure file "${slug}/index.json" must include name and description.`,
    );
  }

  return treasureModule.default;
}

async function buildTreasureList(): Promise<TreasureSummary[]> {
  const treasureSlugs = readdirSync(treasureDirectoryPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((slug) => {
      try {
        return readdirSync(join(treasureDirectoryPath, slug)).includes("index.json");
      } catch {
        return false;
      }
    });

  const treasures = await Promise.all(
    treasureSlugs.map(async (slug) => {
      const treasure = await importTreasure(slug);

      return {
        slug,
        name: treasure.name,
        value: treasure.value,
      } satisfies TreasureSummary;
    }),
  );

  return treasures.sort((a, b) => a.name.localeCompare(b.name));
}

async function loadTreasureList(): Promise<TreasureSummary[]> {
  if (process.env.NODE_ENV !== "production") {
    return buildTreasureList();
  }

  cachedTreasureListPromise ??= buildTreasureList();

  return cachedTreasureListPromise;
}

export async function getTreasureList(): Promise<TreasureSummary[]> {
  return loadTreasureList();
}

export async function getTreasure(slug: string): Promise<TreasureData> {
  return importTreasure(slug);
}

export async function getTreasureDataMap(slugs: string[]): Promise<TreasureDataMap> {
  const uniqueSlugs = [...new Set(slugs)];
  const treasures = await Promise.all(
    uniqueSlugs.map(async (slug) => [slug, await getTreasure(slug)] as const),
  );

  return Object.fromEntries(treasures);
}
