"use client";

import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useState } from "react";
import type { AreaMeta } from "@/lib/areas";

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
    <>
      <TextField
        placeholder="Search areas…"
        size="small"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 1 }}
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
        <List disablePadding>
          {filtered.map((area) => (
            <ListItemButton
              key={area.slug}
              component={Link}
              href={`/?sidebar=areas&area=${area.slug}#areas`}
              selected={selectedSlug === area.slug}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <Chip
                label={area.code}
                size="small"
                color="primary"
                sx={{ mr: 1.5, fontWeight: 700 }}
              />
              <ListItemText primary={area.title} />
            </ListItemButton>
          ))}
        </List>
      )}
    </>
  );
}
