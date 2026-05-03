"use client";

import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import Box from "@mui/material/Box";
import ActionCard from "@/components/ActionCard";

export default function HeroActionCards() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 1.5,
        pt: 1,
      }}
    >
      <ActionCard
        icon={MenuBookRoundedIcon}
        label="Browse Areas"
        description="Load area notes, maps, and encounter details."
      />
      <ActionCard
        icon={ConstructionRoundedIcon}
        label="Session Tools"
        description="Track initiative, HP, and turn order."
      />
    </Box>
  );
}
