"use client";

import Link from "@mui/material/Link";
import type { ReactNode } from "react";
import { useGameStore } from "@/store/useGameStore";

type TreasureReferenceProps = {
  slug: string;
  children?: ReactNode;
};

export default function TreasureReference({ slug, children }: TreasureReferenceProps) {
  const treasureDataMap = useGameStore((s) => s.treasureDataMap);
  const openTreasure = useGameStore((s) => s.openTreasure);
  const treasure = treasureDataMap[slug];

  if (!treasure) {
    return <>{children}</>;
  }

  return (
    <Link
      component="button"
      type="button"
      underline="hover"
      color="primary"
      onClick={() => openTreasure(slug)}
      data-testid={`cy-treasure-reference-${slug}`}
      sx={{
        cursor: "pointer",
        fontWeight: 700,
        textAlign: "inherit",
      }}
    >
      {children ?? treasure.name}
    </Link>
  );
}
