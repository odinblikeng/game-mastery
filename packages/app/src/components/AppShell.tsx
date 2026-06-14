"use client";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { useMediaQuery } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import type { AreaMeta } from "@/lib/areas";
import MonsterStatBlockDialog from "@/components/MonsterStatBlockDialog";
import StoreHydrator from "@/components/StoreHydrator";
import AreaSidebar from "@/components/AreaSidebar";
import LeftRail from "@/components/LeftRail";
import PanelColumn from "@/components/PanelColumn";
import ToolsSidebar from "@/components/ToolsSidebar";
import { useGameStore } from "@/store/useGameStore";
import { buildUrlFromState } from "@/store/urlSync";
import type { MonsterDataMap, MonsterSummary } from "@/types/monster";
import type { TreasureDataMap, TreasureSummary } from "@/types/treasure";
import TreasureDetailDialog from "@/components/TreasureDetailDialog";

type AppShellProps = {
  areas: AreaMeta[];
  monsters: MonsterSummary[];
  monsterDataMap: MonsterDataMap;
  treasures: TreasureSummary[];
  treasureDataMap: TreasureDataMap;
  children: ReactNode;
};

export default function AppShell({
  areas,
  monsters,
  monsterDataMap,
  treasures,
  treasureDataMap,
  children,
}: AppShellProps) {
  const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up("lg"), { defaultMatches: true });
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const areaSidebarOpen = useGameStore((s) => s.areaSidebarOpen);
  const selectedAreaSlug = useGameStore((s) => s.selectedAreaSlug) ?? undefined;
  const toolsParam = useGameStore((s) => s.toolsParam) ?? undefined;
  const closeAreaSidebar = useGameStore((s) => s.closeAreaSidebar);
  const closeTools = useGameStore((s) => s.closeTools);
  const router = useRouter();

  const handleCloseAreaSidebar = () => {
    closeAreaSidebar();
    router.push(buildUrlFromState({ areaSidebarOpen: false, selectedAreaSlug: selectedAreaSlug ?? null, toolsParam: toolsParam ?? null }));
  };

  return (
    <>
      <StoreHydrator
        monsters={monsters}
        monsterDataMap={monsterDataMap}
        treasures={treasures}
        treasureDataMap={treasureDataMap}
      />
      <div className="app-shell" data-testid="cy-app-shell" data-hydrated={isHydrated ? "true" : "false"}>
        <LeftRail />

        {/* Desktop: Areas panel */}
        <PanelColumn
          width={320}
          side="left"
          sx={{ display: areaSidebarOpen ? { xs: "none", lg: "flex" } : "none" }}
        >
          <AreaSidebar areas={areas} selectedSlug={selectedAreaSlug} />
        </PanelColumn>

        {/* Mobile: Areas Drawer */}
        <Drawer
          anchor="left"
          open={!isDesktop && areaSidebarOpen}
          onClose={handleCloseAreaSidebar}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": { ml: "72px", width: 320 },
          }}
        >
          <AreaSidebar areas={areas} selectedSlug={selectedAreaSlug} />
        </Drawer>

        {/* Main content */}
        <Box component="main" className="app-main">
          {children}
        </Box>

        {/* Desktop: Session panel */}
        <PanelColumn
          width={300}
          side="right"
          sx={{ display: toolsParam != null ? { xs: "none", lg: "flex" } : "none", p: 2 }}
        >
          <ToolsSidebar tool={toolsParam ?? "menu"} />
        </PanelColumn>

        {/* Mobile: Tools Drawer */}
        <Drawer
          anchor="right"
          open={!isDesktop && Boolean(toolsParam)}
          onClose={closeTools}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": { width: 300 },
          }}
        >
          <ToolsSidebar tool={toolsParam ?? "menu"} />
        </Drawer>
      </div>
      <MonsterStatBlockDialog />
      <TreasureDetailDialog />
    </>
  );
}
