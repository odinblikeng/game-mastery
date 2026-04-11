"use client";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useOptionalMonsterOverlay } from "@/contexts/MonsterOverlayContext";

type AreaMonsterListProps = {
  slugs: string[];
};

export default function AreaMonsterList({ slugs }: AreaMonsterListProps) {
  const context = useOptionalMonsterOverlay();

  if (!context) {
    return null;
  }

  const { monsterDataMap, openStatBlock } = context;
  const areaMonsters = slugs.filter((slug) => Boolean(monsterDataMap[slug]));

  if (areaMonsters.length === 0) {
    return null;
  }

  return (
    <Stack spacing={1}>
      <Typography variant="overline" color="text.secondary">
        Monsters in This Area
      </Typography>
      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
        {areaMonsters.map((slug) => (
          <Button
            key={slug}
            variant="outlined"
            size="small"
            onClick={() => openStatBlock(slug)}
            data-testid={`cy-area-monster-${slug}`}
          >
            {monsterDataMap[slug].name}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
}