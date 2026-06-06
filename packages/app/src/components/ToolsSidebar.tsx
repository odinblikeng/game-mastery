"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CasinoRoundedIcon from "@mui/icons-material/CasinoRounded";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import InitiativeTracker from "@/components/InitiativeTracker";
import PanelHeader from "@/components/PanelHeader";
import StatusDot from "@/components/StatusDot";
import ToolCard from "@/components/ToolCard";
import CollapseButton from "@/components/CollapseButton";
import { useGameStore } from "@/store/useGameStore";
import type { ToolDefinition } from "@/types/tools";

type ToolsSidebarProps = {
  tool?: string;
};

const toolRegistry: ToolDefinition[] = [
  {
    slug: "initiative",
    label: "Initiative",
    description: "Track turn order, rounds, death saves, and monster HP without leaving the encounter flow.",
    icon: CasinoRoundedIcon,
    component: InitiativeTracker,
  },
];

export default function ToolsSidebar({ tool }: ToolsSidebarProps) {
  const setToolsParam = useGameStore((s) => s.setToolsParam);
  const closeTools = useGameStore((s) => s.closeTools);
  const activeTool = toolRegistry.find(({ slug }) => slug === tool);

  const navigate = (toolValue: string) => setToolsParam(toolValue);
  const goBack = () => navigate("menu");
  const handleCollapse = () => closeTools();

  if (activeTool) {
    const ActiveTool = activeTool.component;
    return (
      <>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              size="small"
              onClick={goBack}
              aria-label="Back to tools"
              data-testid="cy-tools-back-button"
              sx={{ border: "1px solid", borderColor: "divider", color: "sidebar.text" }}
            >
              <ArrowBackRoundedIcon />
            </IconButton>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "sidebar.mutedText",
              }}
            >
              {activeTool.label}
            </Typography>
          </Box>
          <CollapseButton
            direction="right"
            onClick={handleCollapse}
            testId="cy-tools-collapse-button"
          />
        </Box>
        <Typography variant="body2" sx={{ mb: 2.5, color: "sidebar.mutedText", fontSize: "0.8rem" }}>
          {activeTool.description}
        </Typography>
        <ActiveTool />
      </>
    );
  }

  return (
    <>
      <PanelHeader title="Session Tools">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <StatusDot label="Session Active" />
          <CollapseButton
            direction="right"
            onClick={handleCollapse}
            testId="cy-tools-collapse-button"
          />
        </Box>
      </PanelHeader>
      <List disablePadding data-testid="cy-tools-menu" sx={{ display: "grid", gap: 1 }}>
        {toolRegistry.map(({ slug, label, description, icon }) => (
          <ToolCard
            key={slug}
            icon={icon}
            label={label}
            description={description}
            onClick={() => navigate(slug)}
            testId={`cy-tool-item-${slug}`}
          />
        ))}
      </List>
      <Box
        sx={{
          mt: 1,
          p: 2,
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "center",
          cursor: "default",
          transition: "border-color 0.15s ease, background-color 0.15s ease",
          "&:hover": {
            borderColor: (t) =>
              t.palette.mode === "dark"
                ? "rgba(143,140,255,0.45)"
                : "primary.main",
            backgroundColor: (t) =>
              t.palette.mode === "dark"
                ? "rgba(143,140,255,0.04)"
                : "action.hover",
          },
        }}
      >
        <AddRoundedIcon sx={{ color: "text.secondary" }} />
      </Box>
    </>
  );
}
