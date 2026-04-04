import "server-only";
import type { ComponentType } from "react";
import M1Content, { metadata as m1Metadata } from "@/content/areas/m1.mdx";
import M2Content, { metadata as m2Metadata } from "@/content/areas/m2.mdx";
import M3Content, { metadata as m3Metadata } from "@/content/areas/m3.mdx";

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
  Content: ComponentType;
  metadata: AreaDocumentMetadata;
};

const areaModules = {
  m1: {
    Content: M1Content,
    metadata: m1Metadata as AreaDocumentMetadata,
  },
  m2: {
    Content: M2Content,
    metadata: m2Metadata as AreaDocumentMetadata,
  },
  m3: {
    Content: M3Content,
    metadata: m3Metadata as AreaDocumentMetadata,
  },
} satisfies Record<string, AreaModule>;

export type AreaSlug = keyof typeof areaModules;

const areaEntries: AreaEntry[] = Object.entries(areaModules)
  .map(([slug, area]) => ({
    ...area.metadata,
    slug,
    Content: area.Content,
  }))
  .sort((a, b) => a.code.localeCompare(b.code));

export function getAreaList(): AreaMeta[] {
  return areaEntries.map(({ Content: _content, ...metadata }) => metadata);
}

export function getArea(slug: string): AreaEntry | null {
  return areaEntries.find((area) => area.slug === slug) ?? null;
}
