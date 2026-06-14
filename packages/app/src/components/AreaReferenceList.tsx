"use client";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useGameStore } from "@/store/useGameStore";

type AreaReferenceListProps = {
  title: string;
  slugs: string[];
  type: "monster" | "treasure";
};

export default function AreaReferenceList({ title, slugs, type }: AreaReferenceListProps) {
  const monsterDataMap = useGameStore((s) => s.monsterDataMap);
  const treasureDataMap = useGameStore((s) => s.treasureDataMap);
  const openStatBlock = useGameStore((s) => s.openStatBlock);
  const openTreasure = useGameStore((s) => s.openTreasure);

  const isMonster = type === "monster";
  const dataMap = isMonster ? monsterDataMap : treasureDataMap;
  const handleClick = isMonster ? openStatBlock : openTreasure;
  const testIdPrefix = isMonster ? "cy-area-monster" : "cy-area-treasure";

  const validSlugs = slugs.filter((slug) => Boolean(dataMap[slug]));

  if (validSlugs.length === 0) {
    return null;
  }

  return (
    <Stack spacing={1}>
      <Typography variant="overline" color="text.secondary">
        {title}
      </Typography>
      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
        {validSlugs.map((slug) => (
          <Button
            key={slug}
            variant="outlined"
            size="small"
            onClick={() => handleClick(slug)}
            data-testid={`${testIdPrefix}-${slug}`}
          >
            {dataMap[slug].name}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
}
