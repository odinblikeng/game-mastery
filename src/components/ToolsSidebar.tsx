"use client";

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
import InitiativeTracker from "@/components/InitiativeTracker";

type ToolsSidebarProps = {
  tool?: string;
};

export default function ToolsSidebar({ tool }: ToolsSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigate = (toolValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tools", toolValue);
    router.push(`?${params.toString()}`);
  };

  const goBack = () => navigate("menu");

  /* ---- Initiative view ---- */
  if (tool === "initiative") {
    return (
      <>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <IconButton size="small" onClick={goBack} aria-label="Back to tools">
            <ArrowBackRoundedIcon />
          </IconButton>
          <Typography variant="h6">Initiative</Typography>
        </Stack>
        <InitiativeTracker />
      </>
    );
  }

  /* ---- Menu view (default) ---- */
  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Tools
      </Typography>
      <List disablePadding>
        <ListItemButton
          sx={{ borderRadius: 2 }}
          onClick={() => navigate("initiative")}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <CasinoRoundedIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Initiative" />
        </ListItemButton>
      </List>
    </>
  );
}
