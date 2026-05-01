"use client";

import Button from "@mui/material/Button";
import MonsterStatBlock from "@/components/MonsterStatBlock";
import OverlayDialog from "@/components/OverlayDialog";
import { useGameStore } from "@/store/useGameStore";

export default function MonsterStatBlockDialog() {
  const openMonsterSlug = useGameStore((s) => s.openMonsterSlug);
  const monsterDataMap = useGameStore((s) => s.monsterDataMap);
  const closeStatBlock = useGameStore((s) => s.closeStatBlock);
  const addMonster = useGameStore((s) => s.addMonster);
  const setToolsParam = useGameStore((s) => s.setToolsParam);
  const monster = openMonsterSlug ? monsterDataMap[openMonsterSlug] : null;

  const handleAddToInitiative = () => {
    if (!openMonsterSlug) return;
    addMonster(openMonsterSlug);
    closeStatBlock();
    setToolsParam("initiative");
  };

  return (
    <OverlayDialog
      open={Boolean(monster)}
      onClose={closeStatBlock}
      title={monster?.name ?? "Monster details"}
      testId="cy-monster-stat-dialog"
      actions={
        monster ? (
          <Button variant="contained" onClick={handleAddToInitiative} data-testid="cy-monster-add-initiative">
            Add to Initiative
          </Button>
        ) : null
      }
    >
      {monster ? <MonsterStatBlock monster={monster} /> : null}
    </OverlayDialog>
  );
}