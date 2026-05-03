"use client";

import RoomRoundedIcon from "@mui/icons-material/RoomRounded";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import type { AreaMeta } from "@/lib/areas";
import StatusDot from "@/components/StatusDot";

type AreaListItemProps = {
  area: AreaMeta;
  selected: boolean;
  href: string;
};

export default function AreaListItem({ area, selected, href }: AreaListItemProps) {
  return (
    <ListItemButton
      component={Link}
      href={href}
      selected={selected}
      data-testid={`cy-area-item-${area.slug}`}
      sx={{
        px: 1,
        py: "10px",
        borderRadius: 0,
        borderBottom: "1px solid",
        borderColor: "divider",
        alignItems: "flex-start",
        gap: 1,
        backgroundColor: "transparent",
        boxShadow: selected
          ? "inset 3px 0 0 0 var(--mui-palette-sidebar-itemBorderActive)"
          : "none",
        "&.Mui-selected": {
          backgroundColor: "sidebar.itemBgActive",
        },
        "&.Mui-selected:hover": {
          backgroundColor: "sidebar.itemBgActiveHover",
        },
        "&:hover": {
          backgroundColor: "action.hover",
          borderRadius: 1,
        },
      }}
    >
      <RoomRoundedIcon sx={{ fontSize: 18, color: "sidebar.mutedText", mt: "2px", flexShrink: 0 }} />
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.25 }}>
          <Typography
            sx={{
              fontSize: 11,
              color: "sidebar.mutedText",
              fontWeight: 600,
              letterSpacing: "0.06em",
              flexShrink: 0,
            }}
          >
            {area.code}
          </Typography>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{ fontWeight: 600, color: "sidebar.text", flex: 1, minWidth: 0, fontSize: "0.85rem" }}
          >
            {area.title}
          </Typography>
          <StatusDot size={6} />
        </Box>
        <Typography
          sx={{
            color: "sidebar.mutedText",
            fontSize: "0.78rem",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {area.description}
        </Typography>
      </Box>
    </ListItemButton>
  );
}
