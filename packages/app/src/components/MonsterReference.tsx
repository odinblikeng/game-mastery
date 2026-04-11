"use client";

import Link from "@mui/material/Link";
import type { ReactNode } from "react";
import { useOptionalMonsterOverlay } from "@/contexts/MonsterOverlayContext";

type MonsterReferenceProps = {
  slug: string;
  children?: ReactNode;
};

export default function MonsterReference({ slug, children }: MonsterReferenceProps) {
  const context = useOptionalMonsterOverlay();

  if (!context || !context.monsterDataMap[slug]) {
    return <>{children}</>;
  }

  const { monsterDataMap, openStatBlock } = context;

  return (
    <Link
      component="button"
      type="button"
      underline="hover"
      color="primary"
      onClick={() => openStatBlock(slug)}
      data-testid={`cy-monster-reference-${slug}`}
      sx={{
        cursor: "pointer",
        fontWeight: 700,
        textAlign: "inherit",
      }}
    >
      {children ?? monsterDataMap[slug].name}
    </Link>
  );
}