"use client";

import type { SvgIconComponent } from "@mui/icons-material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CasinoRoundedIcon from "@mui/icons-material/CasinoRounded";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ComponentType } from "react";
import InitiativeTracker from "@/components/InitiativeTracker";

type ToolsSidebarProps = {
  tool?: string;
};

type ToolDefinition = {
  slug: string;
  label: string;
  description: string;
  icon: SvgIconComponent;
  component: ComponentType;
};

const toolRegistry: ToolDefinition[] = [
  {
    slug: "initiative",
    label: "Initiative",
    description: "Track turn order, rounds, and death saves without leaving the encounter flow.",
    icon: CasinoRoundedIcon,
    component: InitiativeTracker,
  },
];

export default function ToolsSidebar({ tool }: ToolsSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTool = toolRegistry.find(({ slug }) => slug === tool);

  const navigate = (toolValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tools", toolValue);
    router.push(`${pathname || "/"}?${params.toString()}`);
  };

  const goBack = () => navigate("menu");

  if (activeTool) {
    const ActiveTool = activeTool.component;

    return (
      <>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <IconButton
            size="small"
            onClick={goBack}
            aria-label="Back to tools"
            sx={{ border: "1px solid rgba(182, 139, 70, 0.3)", color: "common.white" }}
          >
            <ArrowBackRoundedIcon />
          </IconButton>
          <Typography variant="h6">{activeTool.label}</Typography>
        </Stack>
        <Typography variant="body2" sx={{ mb: 2.5, color: "rgba(243, 233, 219, 0.72)" }}>
          {activeTool.description}
        </Typography>
        <ActiveTool />
      </>
    );
  }

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h6">Session Tools</Typography>
          <Typography variant="body2" sx={{ color: "rgba(243, 233, 219, 0.72)" }}>
            Table-side utilities registered in the command rail.
          </Typography>
        </Box>
        <Chip label="1 Live" size="small" color="secondary" variant="outlined" sx={{ color: "common.white" }} />
      </Stack>
      <List disablePadding sx={{ display: "grid", gap: 1 }}>
        {toolRegistry.map(({ slug, label, description, icon: Icon }) => (
          <ListItemButton
            key={slug}
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(182, 139, 70, 0.18)",
              px: 1.5,
              py: 1.25,
              "&:hover": {
                borderColor: "rgba(182, 139, 70, 0.42)",
                transform: "translateX(2px)",
              },
            }}
            onClick={() => navigate(slug)}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Icon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={label}
              secondary={description}
              primaryTypographyProps={{ color: "common.white", fontWeight: 700 }}
              secondaryTypographyProps={{ color: "rgba(243, 233, 219, 0.72)", lineHeight: 1.5 }}
            />
          </ListItemButton>
        ))}
      </List>
    </>
  );
}
