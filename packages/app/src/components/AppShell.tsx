"use client";

import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import type { AreaMeta } from "@/lib/areas";
import MonsterStatBlockDialog from "@/components/MonsterStatBlockDialog";
import StoreHydrator from "@/components/StoreHydrator";
import AreaSidebar from "@/components/AreaSidebar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SidebarPanel from "@/components/SidebarPanel";
import ToolsSidebar from "@/components/ToolsSidebar";
import useToolsSidebarWidth from "@/hooks/useToolsSidebarWidth";
import { useGameStore } from "@/store/useGameStore";
import { buildUrlFromState } from "@/store/urlSync";
import type { MonsterDataMap, MonsterSummary } from "@/types/monster";

type AppShellProps = {
  areas: AreaMeta[];
  monsters: MonsterSummary[];
  monsterDataMap: MonsterDataMap;
  children: ReactNode;
};

export default function AppShell({ areas, monsters, monsterDataMap, children }: AppShellProps) {
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const areaSidebarOpen = useGameStore((s) => s.areaSidebarOpen);
  const selectedAreaSlug = useGameStore((s) => s.selectedAreaSlug) ?? undefined;
  const toolsParam = useGameStore((s) => s.toolsParam) ?? undefined;
  const showToolsSidebar = Boolean(toolsParam);
  const closeAreaSidebar = useGameStore((s) => s.closeAreaSidebar);
  const closeTools = useGameStore((s) => s.closeTools);
  const router = useRouter();

  // Closing the area sidebar may need to clear area content rendered by
  // page.tsx (server component). router.push re-renders the server tree;
  // closeAreaSidebar() updates store state.
  const handleCloseAreaSidebar = () => {
    closeAreaSidebar();
    router.push(buildUrlFromState({ areaSidebarOpen: false, selectedAreaSlug: null, toolsParam: toolsParam ?? null }));
  };
  const { effectiveWidth, maxWidth, minWidth, onWidthChange } = useToolsSidebarWidth(areaSidebarOpen);

  return (
    <>
      <StoreHydrator monsters={monsters} monsterDataMap={monsterDataMap} />
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
            {areaSidebarOpen ? (
              <SidebarPanel
                width={340}
                onClose={handleCloseAreaSidebar}
                closeButtonTestId="cy-area-sidebar-close"
              >
                <AreaSidebar areas={areas} selectedSlug={selectedAreaSlug} />
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
                onClose={closeTools}
                closeButtonTestId="cy-tools-sidebar-close"
              >
                <ToolsSidebar tool={toolsParam} />
              </SidebarPanel>
            ) : null}
          </Box>
        </Box>
        <Footer />
      </div>
      <MonsterStatBlockDialog />
    </>
  );
}