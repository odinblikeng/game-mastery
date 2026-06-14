"use client";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import OverlayDialog from "@/components/OverlayDialog";
import { useGameStore } from "@/store/useGameStore";

export default function TreasureDetailDialog() {
  const openTreasureSlug = useGameStore((s) => s.openTreasureSlug);
  const treasureDataMap = useGameStore((s) => s.treasureDataMap);
  const closeTreasure = useGameStore((s) => s.closeTreasure);
  const treasure = openTreasureSlug ? treasureDataMap[openTreasureSlug] : null;

  return (
    <OverlayDialog
      open={Boolean(treasure)}
      onClose={closeTreasure}
      title={treasure?.name ?? "Treasure details"}
      testId="cy-treasure-detail-dialog"
      maxWidth="sm"
    >
      {treasure ? (
        <Stack spacing={2} sx={{ py: 1 }}>
          <Stack direction="row" spacing={1}>
            {treasure.type ? (
              <Chip
                label={treasure.type}
                color="secondary"
                size="small"
                sx={{ fontWeight: 700, textTransform: "uppercase" }}
              />
            ) : null}
            {treasure.value ? (
              <Chip
                label={treasure.value}
                color="success"
                variant="outlined"
                size="small"
                sx={{ fontWeight: 700 }}
              />
            ) : null}
          </Stack>
          <Typography variant="body1" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
            {treasure.description}
          </Typography>
        </Stack>
      ) : null}
    </OverlayDialog>
  );
}
