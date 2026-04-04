"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import type { AreaMeta } from "@/lib/areas";
import AreaSidebar from "@/components/AreaSidebar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ToolsSidebar from "@/components/ToolsSidebar";

type AppShellProps = {
  areas: AreaMeta[];
  children: ReactNode;
};

export default function AppShell({ areas, children }: AppShellProps) {
  const searchParams = useSearchParams();
  const selectedSlug = searchParams.get("area") ?? undefined;
  const showAreaSidebar =
    searchParams.get("sidebar") === "areas" || Boolean(selectedSlug);
  const toolsParam = searchParams.get("tools") ?? undefined;
  const showToolsSidebar = Boolean(toolsParam);

  return (
    <div className="app-shell">
      <Header />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        {showAreaSidebar ? (
          <Box
            component="aside"
            sx={{
              width: { xs: "100%", lg: 320 },
              flexShrink: 0,
              alignSelf: { lg: "flex-start" },
              position: { lg: "sticky" },
              top: { lg: 88 },
              borderRight: { lg: 1 },
              borderBottom: { xs: 1, lg: 0 },
              borderColor: "divider",
              p: 2,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                border: 1,
                borderColor: "divider",
                p: 2,
                maxHeight: { lg: "calc(100vh - 104px)" },
                overflowY: { lg: "auto" },
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Areas
              </Typography>
              <AreaSidebar areas={areas} selectedSlug={selectedSlug} />
            </Paper>
          </Box>
        ) : null}
        <Box component="main" className="app-main" sx={{ minWidth: 0, flex: 1 }}>
          {children}
        </Box>
        {showToolsSidebar ? (
          <Box
            component="aside"
            sx={{
              width: { xs: "100%", lg: 340 },
              flexShrink: 0,
              alignSelf: { lg: "flex-start" },
              position: { lg: "sticky" },
              top: { lg: 88 },
              borderLeft: { lg: 1 },
              borderBottom: { xs: 1, lg: 0 },
              borderColor: "divider",
              p: 2,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                border: 1,
                borderColor: "divider",
                p: 2,
                maxHeight: { lg: "calc(100vh - 104px)" },
                overflowY: { lg: "auto" },
              }}
            >
              <ToolsSidebar tool={toolsParam} />
            </Paper>
          </Box>
        ) : null}
      </Box>
      <Footer />
    </div>
  );
}