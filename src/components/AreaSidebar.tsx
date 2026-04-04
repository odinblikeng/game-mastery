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
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { AreaMeta } from "@/lib/areas";

type AreaSidebarProps = {
  areas: AreaMeta[];
  selectedSlug?: string;
};

export default function AreaSidebar({ areas, selectedSlug }: AreaSidebarProps) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  const buildAreaHref = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sidebar", "areas");
    params.set("area", slug);

    return `/?${params.toString()}#areas`;
  };

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
        placeholder="Search by code or title"
        size="small"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 1.5 }}
      />
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        sx={{ mb: 1.5 }}
      >
        <Typography variant="overline" sx={{ color: "rgba(243, 233, 219, 0.7)", letterSpacing: "0.16em" }}>
          Ready Rooms
        </Typography>
        <Chip
          label={`${filtered.length} ${filtered.length === 1 ? "entry" : "entries"}`}
          size="small"
          variant="outlined"
          sx={{ color: "common.white", borderColor: "rgba(182, 139, 70, 0.35)" }}
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
              href={buildAreaHref(area.slug)}
              selected={selectedSlug === area.slug}
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
                    color: "rgba(243, 233, 219, 0.7)",
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
