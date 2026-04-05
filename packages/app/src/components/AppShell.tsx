"use client";

import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";
import type { AreaMeta } from "@/lib/areas";
import AreaSidebar from "@/components/AreaSidebar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SidebarPanel from "@/components/SidebarPanel";
import ToolsSidebar from "@/components/ToolsSidebar";
import useQueryParams from "@/hooks/useQueryParams";
import useToolsSidebarWidth from "@/hooks/useToolsSidebarWidth";
import type { MonsterSummary } from "@/types/monster";

type AppShellProps = {
  areas: AreaMeta[];
  monsters: MonsterSummary[];
  children: ReactNode;
};

export default function AppShell({ areas, monsters, children }: AppShellProps) {
  const { get, remove } = useQueryParams();
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const selectedSlug = get("area") ?? undefined;
  const showAreaSidebar =
    get("sidebar") === "areas" || Boolean(selectedSlug);
  const toolsParam = get("tools") ?? undefined;
  const showToolsSidebar = Boolean(toolsParam);
  const { effectiveWidth, maxWidth, minWidth, onWidthChange } = useToolsSidebarWidth(showAreaSidebar);

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
              width={effectiveWidth}
              minWidth={minWidth}
              maxWidth={maxWidth}
              isResizable
              resizeHandleSide="left"
              panelTestId="cy-tools-sidebar-panel"
              resizeHandleTestId="cy-tools-sidebar-resize-handle"
              onWidthChange={onWidthChange}
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