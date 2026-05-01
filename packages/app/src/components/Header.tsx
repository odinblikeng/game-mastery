"use client";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useColorScheme } from "@mui/material/styles";
import { useGameStore } from "@/store/useGameStore";
import { buildUrlFromState } from "@/store/urlSync";

export default function Header() {
  const { mode, setMode } = useColorScheme();
  const areaSidebarOpen = useGameStore((s) => s.areaSidebarOpen);
  const toolsParam = useGameStore((s) => s.toolsParam);
  const openAreaSidebar = useGameStore((s) => s.openAreaSidebar);
  const closeAreaSidebar = useGameStore((s) => s.closeAreaSidebar);
  const closeTools = useGameStore((s) => s.closeTools);
  const setToolsParam = useGameStore((s) => s.setToolsParam);
  const closeStatBlock = useGameStore((s) => s.closeStatBlock);
  const router = useRouter();

  const navigateHome = () => {
    closeAreaSidebar();
    closeTools();
    closeStatBlock();
    router.push("/");
  };

  const handleToggleAreaSidebar = () => {
    if (areaSidebarOpen) {
      closeAreaSidebar();
      router.push(buildUrlFromState({ areaSidebarOpen: false, selectedAreaSlug: null, toolsParam }));
    } else {
      openAreaSidebar();
    }
  };

  const toggleToolsSidebar = () => {
    if (toolsParam !== null) {
      closeTools();
    } else {
      setToolsParam("menu");
    }
  };

  const toggleColorMode = () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
  };

  const isToolsSidebarOpen = toolsParam !== null;

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "chrome.border",
        backdropFilter: "blur(18px)",
        boxShadow: (t) => t.palette.chrome.shadow,
        "&::after": {
          content: '""',
          position: "absolute",
          insetInline: 0,
          bottom: 0,
          height: "1px",
          pointerEvents: "none",
          background: (t) => t.palette.chrome.borderGlow,
        },
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: 1600, px: { xs: 2, md: 3 } }}>
        <Toolbar disableGutters sx={{ gap: 2, minHeight: 84 }}>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 1.5,
                display: "grid",
                placeItems: "center",
                border: 1,
                borderColor: "chrome.logoBorder",
                background: (t) => t.palette.chrome.logoBg,
                color: "chrome.logoText",
                fontFamily: "var(--font-display), serif",
                fontSize: "1rem",
                letterSpacing: "0.12em",
              }}
            >
              GM
            </Box>
            <Box>
              <Typography
                component="button"
                type="button"
                onClick={navigateHome}
                variant="h6"
                sx={{
                  border: 0,
                  background: "transparent",
                  color: "chrome.text",
                  cursor: "pointer",
                  p: 0,
                  textAlign: "left",
                }}
              >
                Game Mastery
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "chrome.mutedText", letterSpacing: "0.18em" }}
              >
                Campaign Command Screen
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 1, md: 1.25 }}
            alignItems={{ xs: "stretch", md: "center" }}
            sx={{
              width: { xs: "100%", md: "auto" },
              py: { xs: 1.5, md: 0 },
            }}
          >
            <Button
              color="inherit"
              onClick={navigateHome}
              variant="outlined"
              data-testid="cy-header-dashboard-button"
              sx={{
                color: "chrome.text",
                whiteSpace: "nowrap",
              }}
            >
              Dashboard
            </Button>
            <Button
              onClick={handleToggleAreaSidebar}
              variant={areaSidebarOpen ? "contained" : "outlined"}
              data-testid="cy-header-area-button"
              sx={{
                color: areaSidebarOpen ? undefined : "chrome.text",
                whiteSpace: "nowrap",
              }}
            >
              Area Compendium
            </Button>
            <Button
              onClick={toggleToolsSidebar}
              variant={isToolsSidebarOpen ? "contained" : "outlined"}
              data-testid="cy-header-tools-button"
              sx={{
                color: isToolsSidebarOpen ? undefined : "chrome.text",
                whiteSpace: "nowrap",
              }}
            >
              Session Tools
            </Button>
            <IconButton
              onClick={toggleColorMode}
              aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              data-testid="cy-header-theme-toggle"
              sx={{
                alignSelf: { xs: "flex-start", md: "center" },
                color: "chrome.text",
                border: 1,
                borderColor: "chrome.border",
              }}
            >
              {mode === "dark" ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}