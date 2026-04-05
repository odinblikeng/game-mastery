"use client";

import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import type { AreaMeta } from "@/lib/areas";
import useQueryParams from "@/hooks/useQueryParams";
import AreaListItem from "@/components/AreaListItem";

type AreaSidebarProps = {
  areas: AreaMeta[];
  selectedSlug?: string;
};

export default function AreaSidebar({ areas, selectedSlug }: AreaSidebarProps) {
  const { buildHref } = useQueryParams();
  const [search, setSearch] = useState("");

  const filtered = areas.filter((area) => {
    const q = search.toLowerCase();
    return (
      area.code.toLowerCase().includes(q) ||
      area.title.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <Stack spacing={0.5} sx={{ mb: 2, pr: 4 }}>
        <Typography variant="h6">Area Compendium</Typography>
        <Typography variant="body2" sx={{ color: "sidebar.mutedText" }}>
          Search room codes, titles, and load encounter notes.
        </Typography>
      </Stack>
      <TextField
        placeholder="Search by code or title"
        size="small"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{ htmlInput: { "data-testid": "cy-area-search-input" } }}
        sx={{ mb: 1.5 }}
      />
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        sx={{ mb: 1.5 }}
      >
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
      </Stack>
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
              href={buildHref({ sidebar: "areas", area: area.slug })}
            />
          ))}
        </List>
      )}
    </>
  );
}
