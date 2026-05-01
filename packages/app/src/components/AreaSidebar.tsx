"use client";

import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState } from "react";
import type { AreaMeta } from "@/lib/areas";
import AreaListItem from "@/components/AreaListItem";

type AreaSidebarProps = {
  areas: AreaMeta[];
  selectedSlug?: string;
};

export default function AreaSidebar({ areas, selectedSlug }: AreaSidebarProps) {
  const [search, setSearch] = useState("");

  const filtered = areas.filter((area) => {
    const q = search.toLowerCase();
    return (
      area.code.toLowerCase().includes(q) ||
      area.title.toLowerCase().includes(q)
    );
  });

  return (
    <Box sx={{ display: { lg: "flex" }, flexDirection: { lg: "column" }, flex: { lg: 1 }, minHeight: { lg: 0 } }}>
      <Box
        sx={{
          flexShrink: 0,
          padding:{ xs: 1.5, md: 2.5 },
          pb: 0.5,
        }}
      >
        <TextField
          placeholder="Search by code or title"
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{ htmlInput: { "data-testid": "cy-area-search-input" } }}
          sx={{ mb: 1.5 }}
        />

          <Typography variant="overline" sx={{ color: "sidebar.mutedText", letterSpacing: "0.16em" }}>
            Ready Rooms
          </Typography>
          <Chip
            label={`${filtered.length} ${filtered.length === 1 ? "entry" : "entries"}`}
            size="small"
            variant="outlined"
            data-testid="cy-area-count-chip"
            sx={{ color: "sidebar.text", borderColor: "sidebar.border" }}
          />
      </Box>
      <Box sx={{ flex: { lg: 1 }, overflowY: { lg: "auto" }, minHeight: { lg: 0 } }}>
      {areas.length === 0 ? (
        <Typography color="text.secondary" variant="body2" sx={{ mt: 2 }}>
          No area files were found in src/content/areas.
        </Typography>
      ) : filtered.length === 0 ? (
        <Typography color="text.secondary" variant="body2" sx={{ mt: 2 }}>
          No areas match your search.
        </Typography>
      ) : (
        <List disablePadding sx={{ display: "grid", gap: 1 }}>
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
    </Box>
  );
}
