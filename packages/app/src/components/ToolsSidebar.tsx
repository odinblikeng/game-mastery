"use client";

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
import InitiativeTracker from "@/components/InitiativeTracker";
import useQueryParams from "@/hooks/useQueryParams";
import type { MonsterSummary } from "@/types/monster";
import type { ToolDefinition } from "@/types/tools";

type ToolsSidebarProps = {
    tool?: string;
    monsters: MonsterSummary[];
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

export default function ToolsSidebar({ tool, monsters }: ToolsSidebarProps) {
    const { set } = useQueryParams();
    const activeTool = toolRegistry.find(({ slug }) => slug === tool);
    
    const navigate = (toolValue: string) => set({ tools: toolValue });
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
            data-testid="cy-tools-back-button"
            sx={{ border: 1, borderColor: "sidebar.border", color: "sidebar.text" }}
            >
            <ArrowBackRoundedIcon />
            </IconButton>
            <Typography variant="h6">{activeTool.label}</Typography>
            </Stack>
            <Typography variant="body2" sx={{ mb: 2.5, color: "sidebar.mutedText" }}>
            {activeTool.description}
            </Typography>
            <ActiveTool monsters={monsters} />
            </>
        );
    }
    
    return (
        <>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2, pr: 4 }}>
        <Box>
        <Typography variant="h6">Session Tools</Typography>
        <Typography variant="body2" sx={{ color: "sidebar.mutedText" }}>
        Table-side utilities registered in the command rail.
        </Typography>
        </Box>
        <Chip label="1 Live" size="small" color="secondary" variant="outlined" sx={{ color: "sidebar.text" }} />
        </Stack>
        <List disablePadding data-testid="cy-tools-menu" sx={{ display: "grid", gap: 1 }}>
        {toolRegistry.map(({ slug, label, description, icon: Icon }) => (
            <ListItemButton
            key={slug}
            data-testid={`cy-tool-item-${slug}`}
            sx={{
                borderRadius: 3,
                border: 1,
                borderColor: "sidebar.itemBorder",
                px: 1.5,
                py: 1.25,
                "&:hover": {
                    borderColor: "sidebar.itemBorderHover",
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
            primaryTypographyProps={{ color: "sidebar.text", fontWeight: 700 }}
            secondaryTypographyProps={{ color: "sidebar.mutedText", lineHeight: 1.5 }}
            />
            </ListItemButton>
        ))}
        </List>
        </>
    );
}
