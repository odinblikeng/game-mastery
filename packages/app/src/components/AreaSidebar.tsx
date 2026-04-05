"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useState } from "react";
import type { AreaMeta } from "@/lib/areas";
import useQueryParams from "@/hooks/useQueryParams";

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
          sx={{ color: "common.white", borderColor: "sidebar.border" }}
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
            <ListItemButton
              key={area.slug}
              component={Link}
              href={buildHref({ sidebar: "areas", area: area.slug })}
              selected={selectedSlug === area.slug}
              data-testid={`cy-area-item-${area.slug}`}
              sx={{
                alignItems: "flex-start",
                borderRadius: 3,
                border: "1px solid rgba(182, 139, 70, 0.18)",
                backgroundColor:
                  selectedSlug === area.slug
                    ? "rgba(164, 61, 36, 0.16)"
                    : "rgba(255, 255, 255, 0.02)",
                px: 1.5,
                py: 1.25,
                "&.Mui-selected": {
                  borderColor: "rgba(182, 139, 70, 0.52)",
                  backgroundColor: "rgba(164, 61, 36, 0.2)",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "rgba(164, 61, 36, 0.24)",
                },
                "&:hover": {
                  borderColor: "rgba(182, 139, 70, 0.4)",
                  transform: "translateX(2px)",
                },
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 0.75 }}>
                  <Chip
                    label={area.code}
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 700 }}
                  />
                  <Typography variant="subtitle2" sx={{ color: "common.white", fontWeight: 700 }}>
                    {area.title}
                  </Typography>
                </Stack>
                <ListItemText
                  primary={null}
                  secondary={area.description}
                  secondaryTypographyProps={{
                    color: "sidebar.mutedText",
                    lineHeight: 1.55,
                  }}
                  sx={{ m: 0 }}
                />
              </Box>
            </ListItemButton>
          ))}
        </List>
      )}
    </>
  );
}
