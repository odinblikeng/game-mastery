"use client";

import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useColorScheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/useGameStore";
import { buildUrlFromState } from "@/store/urlSync";

type NavItemId = "dashboard" | "areas" | "tools";

const navItems = [
  { id: "dashboard" as NavItemId, icon: HomeRoundedIcon, label: "Dashboard", testId: "cy-rail-dashboard" },
  { id: "areas" as NavItemId, icon: MenuBookRoundedIcon, label: "Area Compendium", testId: "cy-rail-areas" },
  { id: "tools" as NavItemId, icon: ConstructionRoundedIcon, label: "Session Tools", testId: "cy-rail-tools" },
];

export default function LeftRail() {
  const { mode, setMode, colorScheme } = useColorScheme();
  const areaSidebarOpen = useGameStore((s) => s.areaSidebarOpen);
  const selectedAreaSlug = useGameStore((s) => s.selectedAreaSlug);
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
      router.push(buildUrlFromState({ areaSidebarOpen: false, selectedAreaSlug, toolsParam }));
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

  const isDark = colorScheme === "dark" ?? mode === "dark";

  const toggleColorMode = () => {
    setMode(isDark ? "light" : "dark");
  };

  const isActive = (id: NavItemId): boolean => {
    if (id === "areas") return areaSidebarOpen;
    if (id === "tools") return toolsParam !== null;
    return false;
  };

  const handleNav = (id: NavItemId) => {
    if (id === "dashboard") navigateHome();
    else if (id === "areas") handleToggleAreaSidebar();
    else if (id === "tools") toggleToolsSidebar();
  };

  return (
    <Box
      component="nav"
      sx={{
        width: { xs: 72, lg: 4 },
        overflow: "hidden",
        transition: "width 0.2s ease",
        "&:hover": { width: 72 },
        height: "100vh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexShrink: 0,
        borderRight: "1px solid",
        borderColor: "chrome.railBorder",
        backgroundColor: "chrome.railBg",
        zIndex: 100,
      }}
    >
      {/* GM Badge */}
      <Box
        sx={{
          mt: 2,
          mb: 3,
          width: 42,
          height: 42,
          borderRadius: 1.5,
          border: "1px solid",
          borderColor: "chrome.railBorder",
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--font-display), serif",
          fontSize: "0.85rem",
          letterSpacing: "0.12em",
          color: "primary.main",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={navigateHome}
        data-testid="cy-rail-logo"
      >
        GM
      </Box>

      {/* Nav icons */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        {navItems.map(({ id, icon: Icon, label, testId }) => {
          const active = isActive(id);
          return (
            <Box key={id} sx={{ position: "relative", width: 48, display: "flex", justifyContent: "center" }}>
              {/* Active marker — 3px bar on right edge */}
              {active && (
                <Box
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 3,
                    height: 28,
                    borderRadius: "2px 0 0 2px",
                    backgroundColor: "chrome.railActiveMark",
                    boxShadow: "chrome.railActiveGlow",
                  }}
                />
              )}
              <Tooltip title={label} placement="right">
                <IconButton
                  onClick={() => handleNav(id)}
                  data-testid={testId}
                  aria-label={label}
                  sx={{
                    color: active ? "chrome.railActiveIcon" : "chrome.mutedText",
                    transition: "transform 0.15s ease, color 0.15s ease",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      backgroundColor: "transparent",
                    },
                    ...(active && {
                      filter: (t: { palette: { mode: string } }) =>
                        t.palette.mode === "dark"
                          ? "drop-shadow(0 0 6px currentColor)"
                          : "none",
                    }),
                  }}
                >
                  <Icon />
                </IconButton>
              </Tooltip>
            </Box>
          );
        })}
      </Box>

      {/* Theme toggle */}
      <Tooltip title={colorScheme === "dark" ? "Light mode" : "Dark mode"} placement="right">
        <IconButton
          onClick={toggleColorMode}
          aria-label={colorScheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          data-testid="cy-rail-theme-toggle"
          sx={{
            mb: 2,
            color: "chrome.mutedText",
            transition: "transform 0.15s ease",
            "&:hover": {
              transform: "translateY(-1px)",
              backgroundColor: "transparent",
            },
          }}
        >
          {colorScheme === "dark" ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
