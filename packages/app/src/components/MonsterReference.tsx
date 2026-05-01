"use client";

import Link from "@mui/material/Link";
import type { ReactNode } from "react";
import { useGameStore } from "@/store/useGameStore";

type MonsterReferenceProps = {
  slug: string;
  children?: ReactNode;
};

export default function MonsterReference({ slug, children }: MonsterReferenceProps) {
  const monsterDataMap = useGameStore((s) => s.monsterDataMap);
  const openStatBlock = useGameStore((s) => s.openStatBlock);
  const monster = monsterDataMap[slug];

  if (!monster) {
    return <>{children}</>;
  }

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
      {children ?? monster.name}
    </Link>
  );
}