"use client";

import Button from "@mui/material/Button";
import MonsterStatBlock from "@/components/MonsterStatBlock";
import OverlayDialog from "@/components/OverlayDialog";
import { useMonsterOverlay } from "@/contexts/MonsterOverlayContext";

export default function MonsterStatBlockDialog() {
  const { openSlug, monsterDataMap, closeStatBlock, addToInitiative } = useMonsterOverlay();
  const monster = openSlug ? monsterDataMap[openSlug] : null;

  return (
    <OverlayDialog
      open={Boolean(monster)}
      onClose={closeStatBlock}
      title={monster?.name ?? "Monster details"}
      testId="cy-monster-stat-dialog"
      actions={
        monster ? (
          <Button variant="contained" onClick={() => addToInitiative(openSlug!)} data-testid="cy-monster-add-initiative">
            Add to Initiative
          </Button>
        ) : null
      }
    >
      {monster ? <MonsterStatBlock monster={monster} /> : null}
    </OverlayDialog>
  );
}