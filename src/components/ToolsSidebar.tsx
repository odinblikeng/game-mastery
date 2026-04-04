"use client";

import type { SvgIconComponent } from "@mui/icons-material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CasinoRoundedIcon from "@mui/icons-material/CasinoRounded";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter, useSearchParams } from "next/navigation";
import type { ComponentType } from "react";
import InitiativeTracker from "@/components/InitiativeTracker";

type ToolsSidebarProps = {
  tool?: string;
};

type ToolDefinition = {
  slug: string;
  label: string;
  icon: SvgIconComponent;
  component: ComponentType;
};

const toolRegistry: ToolDefinition[] = [
  {
    slug: "initiative",
    label: "Initiative",
    icon: CasinoRoundedIcon,
    component: InitiativeTracker,
  },
];

export default function ToolsSidebar({ tool }: ToolsSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTool = toolRegistry.find(({ slug }) => slug === tool);

  const navigate = (toolValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tools", toolValue);
    router.push(`?${params.toString()}`);
  };

  const goBack = () => navigate("menu");

  if (activeTool) {
    const ActiveTool = activeTool.component;

    return (
      <>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <IconButton size="small" onClick={goBack} aria-label="Back to tools">
            <ArrowBackRoundedIcon />
          </IconButton>
          <Typography variant="h6">{activeTool.label}</Typography>
        </Stack>
        <ActiveTool />
      </>
    );
  }

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Tools
      </Typography>
      <List disablePadding>
        {toolRegistry.map(({ slug, label, icon: Icon }) => (
          <ListItemButton
            key={slug}
            sx={{ borderRadius: 2 }}
            onClick={() => navigate(slug)}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Icon color="primary" />
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>
    </>
  );
}
