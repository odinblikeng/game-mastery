"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import type { AreaMeta } from "@/lib/areas";

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
        alignItems: "flex-start",
        borderRadius: 3,
        border: 1,
        borderColor: "sidebar.itemBorder",
        backgroundColor: selected ? "sidebar.itemBgActive" : "sidebar.itemBg",
        px: 1.5,
        py: 1.25,
        "&.Mui-selected": {
          borderColor: "sidebar.itemBorderActive",
          backgroundColor: "sidebar.itemBgActive",
        },
        "&.Mui-selected:hover": {
          backgroundColor: "sidebar.itemBgActiveHover",
        },
        "&:hover": {
          borderColor: "sidebar.itemBorderHover",
          transform: "translateX(2px)",
        },
      }}
    >
      <Box sx={{ minWidth: 0, maxWidth: "100%", overflow: "hidden" }}>
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 0.75, minWidth: 0, maxWidth: "100%" }}>
          <Chip
            label={area.code}
            size="small"
            color="primary"
            sx={{ fontWeight: 700, flexShrink: 0 }}
          />
          <Typography
            variant="subtitle2"
            noWrap
            sx={{ color: "sidebar.text", fontWeight: 700, minWidth: 0 }}
          >
            {area.title}
          </Typography>
        </Stack>
        <ListItemText
          primary={null}
          secondary={area.description}
          secondaryTypographyProps={{
            color: "sidebar.mutedText",
            lineHeight: 1.55,
            sx: {
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              maxWidth: "80%",
              marginLeft: "5%", 
            },
          }}
          sx={{ m: 0 }}
        />
      </Box>
    </ListItemButton>
  );
}
