import "server-only";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { ComponentType } from "react";

export type AreaMeta = {
  code: string;
  title: string;
  description: string;
  slug: string;
};

export type AreaDocumentMetadata = Omit<AreaMeta, "slug">;

export type AreaEntry = AreaMeta & {
  Content: ComponentType;
};

type AreaModule = {
  default: ComponentType;
  metadata: AreaDocumentMetadata;
};

const areaDirectoryPath = join(process.cwd(), "src", "content", "areas");

let cachedAreaEntriesPromise: Promise<AreaEntry[]> | null = null;

function isAreaDocumentMetadata(value: unknown): value is AreaDocumentMetadata {
  if (!value || typeof value !== "object") {
    return false;
  }

  const metadata = value as Record<string, unknown>;

  return (
    typeof metadata.code === "string" &&
    typeof metadata.title === "string" &&
    typeof metadata.description === "string"
  );
}

async function importAreaModule(slug: string): Promise<AreaModule> {
  const areaModule = (await import(`../content/areas/${slug}.mdx`)) as Partial<AreaModule>;

  if (typeof areaModule.default !== "function" || !isAreaDocumentMetadata(areaModule.metadata)) {
    throw new Error(
      `Area file "${slug}.mdx" must export default MDX content and metadata { code, title, description }.`,
    );
  }

  return {
    default: areaModule.default,
    metadata: areaModule.metadata,
  };
}

async function buildAreaEntries(): Promise<AreaEntry[]> {
  const areaSlugs = readdirSync(areaDirectoryPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => entry.name.slice(0, -4));

  const areaEntries = await Promise.all(
    areaSlugs.map(async (slug) => {
      const areaModule = await importAreaModule(slug);

      return {
        ...areaModule.metadata,
        slug,
        Content: areaModule.default,
      } satisfies AreaEntry;
    }),
  );

  return areaEntries.sort((a, b) => a.code.localeCompare(b.code));
}

async function loadAreas(): Promise<AreaEntry[]> {
  if (process.env.NODE_ENV !== "production") {
    return buildAreaEntries();
  }

  cachedAreaEntriesPromise ??= buildAreaEntries();

  return cachedAreaEntriesPromise;
}

export async function getAreaList(): Promise<AreaMeta[]> {
  const areaEntries = await loadAreas();

  return areaEntries.map(({ code, title, description, slug }) => ({
    code,
    title,
    description,
    slug,
  }));
}

export async function getArea(slug: string): Promise<AreaEntry | null> {
  const areaEntries = await loadAreas();

  return areaEntries.find((area) => area.slug === slug) ?? null;
}
