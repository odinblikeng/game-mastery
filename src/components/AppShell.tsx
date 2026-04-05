"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSlug = searchParams.get("area") ?? undefined;
  const showAreaSidebar =
    searchParams.get("sidebar") === "areas" || Boolean(selectedSlug);
  const toolsParam = searchParams.get("tools") ?? undefined;
  const showToolsSidebar = Boolean(toolsParam);

  const closeSidebar = (keys: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    keys.forEach((k) => params.delete(k));
    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
  };

  return (
    <div className="app-shell">
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
            <Box
              component="aside"
              sx={{
                width: { xs: "100%", lg: 340 },
                flexShrink: 0,
                alignSelf: { lg: "flex-start" },
                position: { lg: "sticky" },
                top: { lg: 104 },
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid rgba(182, 139, 70, 0.34)",
                  backgroundColor: "rgba(24, 17, 13, 0.84)",
                  color: "common.white",
                  p: 2,
                  boxShadow: "0 20px 44px rgba(0, 0, 0, 0.25)",
                  maxHeight: { lg: "calc(100vh - 122px)" },
                  overflowY: { lg: "auto" },
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Stack spacing={0.5}>
                    <Typography variant="h6">Area Compendium</Typography>
                    <Typography variant="body2" sx={{ color: "rgba(243, 233, 219, 0.72)" }}>
                      Search room codes, titles, and load encounter notes.
                    </Typography>
                  </Stack>
                  <IconButton
                    size="small"
                    onClick={() => closeSidebar(["sidebar", "area"])}
                    aria-label="Close area sidebar"
                    sx={{ color: "common.white", flexShrink: 0 }}
                  >
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                </Stack>
                <AreaSidebar areas={areas} selectedSlug={selectedSlug} />
              </Paper>
            </Box>
          ) : null}
          <Box component="main" className="app-main" sx={{ flex: 1, minWidth: 0 }}>
            {children}
          </Box>
          {showToolsSidebar ? (
            <Box
              component="aside"
              sx={{
                width: { xs: "100%", lg: 360 },
                flexShrink: 0,
                alignSelf: { lg: "flex-start" },
                position: { lg: "sticky" },
                top: { lg: 104 },
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid rgba(182, 139, 70, 0.34)",
                  backgroundColor: "rgba(24, 17, 13, 0.84)",
                  color: "common.white",
                  p: 2,
                  boxShadow: "0 20px 44px rgba(0, 0, 0, 0.25)",
                  maxHeight: { lg: "calc(100vh - 122px)" },
                  overflowY: { lg: "auto" },
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="h6">Session Tools</Typography>
                  <IconButton
                    size="small"
                    onClick={() => closeSidebar(["tools"])}
                    aria-label="Close tools sidebar"
                    sx={{ color: "common.white" }}
                  >
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                </Stack>
                <ToolsSidebar tool={toolsParam} />
              </Paper>
            </Box>
          ) : null}
        </Box>
      </Box>
      <Footer />
    </div>
  );
}