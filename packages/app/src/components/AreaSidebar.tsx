"use client";

import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AreaMeta } from "@/lib/areas";
import AreaListItem from "@/components/AreaListItem";
import GhostInput from "@/components/GhostInput";
import PanelHeader from "@/components/PanelHeader";
import CollapseButton from "@/components/CollapseButton";
import { useGameStore } from "@/store/useGameStore";
import { buildUrlFromState } from "@/store/urlSync";

type AreaSidebarProps = {
  areas: AreaMeta[];
  selectedSlug?: string;
};

export default function AreaSidebar({ areas, selectedSlug }: AreaSidebarProps) {
  const [search, setSearch] = useState("");
  const closeAreaSidebar = useGameStore((s) => s.closeAreaSidebar);
  const toolsParam = useGameStore((s) => s.toolsParam);
  const router = useRouter();

  const handleCollapse = () => {
    closeAreaSidebar();
    router.push(
      buildUrlFromState({
        areaSidebarOpen: false,
        selectedAreaSlug: selectedSlug ?? null,
        toolsParam,
      })
    );
  };

  const filtered = areas.filter((area) => {
    const q = search.toLowerCase();
    return (
      area.code.toLowerCase().includes(q) ||
      area.title.toLowerCase().includes(q)
    );
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, p: 2 }}>
      <PanelHeader title="Areas">
        <CollapseButton
          direction="left"
          onClick={handleCollapse}
          testId="cy-area-collapse-button"
        />
      </PanelHeader>
      <GhostInput
        placeholder="Search by code or title"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{ htmlInput: { "data-testid": "cy-area-search-input" } }}
        sx={{ mb: 1.5 }}
      />
      {areas.length === 0 ? (
        <Typography color="text.secondary" variant="body2" sx={{ mt: 2 }}>
          No area files were found in src/content/areas.
        </Typography>
      ) : filtered.length === 0 ? (
        <Typography color="text.secondary" variant="body2" sx={{ mt: 2 }}>
          No areas match your search.
        </Typography>
      ) : (
        <List disablePadding sx={{ flex: 1, overflowY: "auto" }}>
          {filtered.map((area) => (
            <AreaListItem
              key={area.slug}
              area={area}
              selected={selectedSlug === area.slug}
              href={`/?sidebar=areas&area=${area.slug}`}
            />
          ))}
        </List>
      )}
    </Box>
  );
}
