"use client";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useGameStore } from "@/store/useGameStore";

type AreaTreasureListProps = {
  slugs: string[];
};

export default function AreaTreasureList({ slugs }: AreaTreasureListProps) {
  const treasureDataMap = useGameStore((s) => s.treasureDataMap);
  const openTreasure = useGameStore((s) => s.openTreasure);
  const areaTreasures = slugs.filter((slug) => Boolean(treasureDataMap[slug]));

  if (areaTreasures.length === 0) {
    return null;
  }

  return (
    <Stack spacing={1}>
      <Typography variant="overline" color="text.secondary">
        Treasures in This Area
      </Typography>
      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
        {areaTreasures.map((slug) => (
          <Button
            key={slug}
            variant="outlined"
            size="small"
            onClick={() => openTreasure(slug)}
            data-testid={`cy-area-treasure-${slug}`}
          >
            {treasureDataMap[slug].name}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
}
