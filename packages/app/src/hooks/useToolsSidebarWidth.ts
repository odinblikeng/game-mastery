"use client";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState, useSyncExternalStore } from "react";

const DEFAULT_TOOLS_SIDEBAR_WIDTH = 360;
export const MIN_TOOLS_SIDEBAR_WIDTH = 320;
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

export default function useToolsSidebarWidth(showAreaSidebar: boolean) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const storedToolsSidebarWidth = useSyncExternalStore(
    () => () => {},
    getStoredToolsSidebarWidth,
    getInitialToolsSidebarWidth,
  );
  const [viewportWidth, setViewportWidth] = useState(APP_SHELL_MAX_WIDTH);
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

  return {
    effectiveWidth: effectiveToolsSidebarWidth,
    maxWidth: toolsSidebarMaxWidth,
    minWidth: MIN_TOOLS_SIDEBAR_WIDTH,
    onWidthChange: handleToolsSidebarWidthChange,
  };
}
