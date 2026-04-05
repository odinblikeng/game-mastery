"use client";

import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import type { ReactNode } from "react";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { AreaMeta } from "@/lib/areas";
import AreaSidebar from "@/components/AreaSidebar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SidebarPanel from "@/components/SidebarPanel";
import ToolsSidebar from "@/components/ToolsSidebar";
import useQueryParams from "@/hooks/useQueryParams";
import type { MonsterSummary } from "@/types/monster";

type AppShellProps = {
  areas: AreaMeta[];
  monsters: MonsterSummary[];
  children: ReactNode;
};

const DEFAULT_TOOLS_SIDEBAR_WIDTH = 360;
const MIN_TOOLS_SIDEBAR_WIDTH = 320;
const MAX_TOOLS_SIDEBAR_WIDTH = 560;
const APP_SHELL_MAX_WIDTH = 1600;
const APP_SHELL_DESKTOP_GAP = 24;
const APP_SHELL_DESKTOP_PADDING = 40;
const MAIN_CONTENT_MIN_WIDTH = 320;
const AREA_SIDEBAR_WIDTH = 340;
const TOOLS_SIDEBAR_STORAGE_KEY = "game-mastery-tools-sidebar-width";

function clampToolsSidebarWidth(
  width: number,
  viewportWidth: number,
  showAreaSidebar: boolean,
) {
  const availableWidth = Math.min(
    APP_SHELL_MAX_WIDTH,
    Math.max(0, viewportWidth - APP_SHELL_DESKTOP_PADDING),
  );
  const reservedWidth =
    MAIN_CONTENT_MIN_WIDTH +
    APP_SHELL_DESKTOP_GAP +
    (showAreaSidebar ? AREA_SIDEBAR_WIDTH + APP_SHELL_DESKTOP_GAP : 0);
  const computedMaxWidth = Math.min(
    MAX_TOOLS_SIDEBAR_WIDTH,
    Math.max(MIN_TOOLS_SIDEBAR_WIDTH, availableWidth - reservedWidth),
  );

  return Math.max(
    MIN_TOOLS_SIDEBAR_WIDTH,
    Math.min(width, computedMaxWidth),
  );
}

function getInitialToolsSidebarWidth() {
  return DEFAULT_TOOLS_SIDEBAR_WIDTH;
}

function getStoredToolsSidebarWidth() {
  if (typeof window === "undefined") {
    return DEFAULT_TOOLS_SIDEBAR_WIDTH;
  }

  const storedValue = window.sessionStorage.getItem(TOOLS_SIDEBAR_STORAGE_KEY);
  const parsedWidth = storedValue ? Number(storedValue) : DEFAULT_TOOLS_SIDEBAR_WIDTH;

  return Number.isNaN(parsedWidth) ? DEFAULT_TOOLS_SIDEBAR_WIDTH : parsedWidth;
}

export default function AppShell({ areas, monsters, children }: AppShellProps) {
  const { get, remove } = useQueryParams();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const storedToolsSidebarWidth = useSyncExternalStore(
    () => () => {},
    getStoredToolsSidebarWidth,
    getInitialToolsSidebarWidth,
  );
  const [viewportWidth, setViewportWidth] = useState(APP_SHELL_MAX_WIDTH);
  const selectedSlug = get("area") ?? undefined;
  const showAreaSidebar =
    get("sidebar") === "areas" || Boolean(selectedSlug);
  const toolsParam = get("tools") ?? undefined;
  const showToolsSidebar = Boolean(toolsParam);
  const [toolsSidebarWidthOverride, setToolsSidebarWidthOverride] = useState<number | null>(null);
  const preferredToolsSidebarWidth = toolsSidebarWidthOverride ?? storedToolsSidebarWidth;
  const toolsSidebarMaxWidth = clampToolsSidebarWidth(
    MAX_TOOLS_SIDEBAR_WIDTH,
    viewportWidth,
    showAreaSidebar,
  );
  const effectiveToolsSidebarWidth = isDesktop
    ? clampToolsSidebarWidth(preferredToolsSidebarWidth, viewportWidth, showAreaSidebar)
    : preferredToolsSidebarWidth;

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleToolsSidebarWidthChange = (nextWidth: number) => {
    const clampedWidth = clampToolsSidebarWidth(nextWidth, viewportWidth, showAreaSidebar);

    setToolsSidebarWidthOverride(clampedWidth);
    window.sessionStorage.setItem(
      TOOLS_SIDEBAR_STORAGE_KEY,
      String(Math.round(clampedWidth)),
    );
  };

  return (
    <div className="app-shell" data-testid="cy-app-shell" data-hydrated={isHydrated ? "true" : "false"}>
      <Header />
      <Box
        sx={{
          flex: 1,
          px: { xs: 1.5, md: 2.5 },
          py: { xs: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            maxWidth: 1600,
            mx: "auto",
            display: "flex",
            minHeight: 0,
            flexDirection: { xs: "column", lg: "row" },
            gap: { xs: 2, lg: 3 },
            alignItems: "flex-start",
          }}
        >
          {showAreaSidebar ? (
            <SidebarPanel
              width={340}
              onClose={() => remove("sidebar", "area")}
              closeButtonTestId="cy-area-sidebar-close"
            >
              <AreaSidebar areas={areas} selectedSlug={selectedSlug} />
            </SidebarPanel>
          ) : null}
          <Box component="main" className="app-main" sx={{ flex: 1, minWidth: 0 }}>
            {children}
          </Box>
          {showToolsSidebar ? (
            <SidebarPanel
              width={effectiveToolsSidebarWidth}
              minWidth={MIN_TOOLS_SIDEBAR_WIDTH}
              maxWidth={toolsSidebarMaxWidth}
              isResizable
              resizeHandleSide="left"
              panelTestId="cy-tools-sidebar-panel"
              resizeHandleTestId="cy-tools-sidebar-resize-handle"
              onWidthChange={handleToolsSidebarWidthChange}
              onClose={() => remove("tools")}
              closeButtonTestId="cy-tools-sidebar-close"
            >
              <ToolsSidebar tool={toolsParam} monsters={monsters} />
            </SidebarPanel>
          ) : null}
        </Box>
      </Box>
      <Footer />
    </div>
  );
}