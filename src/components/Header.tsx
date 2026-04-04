"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter, useSearchParams } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAreaSidebarOpen =
    searchParams.get("sidebar") === "areas" || searchParams.has("area");
  const isToolsSidebarOpen = searchParams.has("tools");

  const buildUrl = (params: URLSearchParams) => {
    const query = params.toString();

    return query ? `/?${query}` : "/";
  };

  const navigateHome = () => {
    router.push("/");
  };

  const toggleAreasSidebar = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (isAreaSidebarOpen) {
      params.delete("sidebar");
      params.delete("area");
      router.push(buildUrl(params));
      return;
    }

    params.set("sidebar", "areas");
    router.push(buildUrl(params));
  };

  const toggleToolsSidebar = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.has("tools")) {
      params.delete("tools");
    } else {
      params.set("tools", "menu");
    }

    router.push(buildUrl(params));
  };

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "rgba(182, 139, 70, 0.35)",
        backdropFilter: "blur(18px)",
        boxShadow: "0 18px 40px rgba(0, 0, 0, 0.28)",
        "&::after": {
          content: '""',
          position: "absolute",
          insetInline: 0,
          bottom: 0,
          height: "1px",
          pointerEvents: "none",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(182, 139, 70, 0.45) 18%, rgba(182, 139, 70, 0.8) 50%, rgba(182, 139, 70, 0.45) 82%, transparent 100%)",
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
                border: "1px solid rgba(182, 139, 70, 0.55)",
                background:
                  "linear-gradient(180deg, rgba(174, 59, 33, 0.28), rgba(34, 22, 16, 0.92))",
                color: "secondary.light",
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
                  color: "common.white",
                  cursor: "pointer",
                  p: 0,
                  textAlign: "left",
                }}
              >
                Game Mastery
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(243, 233, 219, 0.72)", letterSpacing: "0.18em" }}
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
              sx={{
                color: "common.white",
                whiteSpace: "nowrap",
              }}
            >
              Dashboard
            </Button>
            <Button
              onClick={toggleAreasSidebar}
              variant={isAreaSidebarOpen ? "contained" : "outlined"}
              sx={{
                color: isAreaSidebarOpen ? undefined : "common.white",
                whiteSpace: "nowrap",
              }}
            >
              Area Compendium
            </Button>
            <Button
              onClick={toggleToolsSidebar}
              variant={isToolsSidebarOpen ? "contained" : "outlined"}
              sx={{
                color: isToolsSidebarOpen ? undefined : "common.white",
                whiteSpace: "nowrap",
              }}
            >
              Session Tools
            </Button>
            <Chip
              label="Live Table"
              color="secondary"
              variant="outlined"
              sx={{ alignSelf: { xs: "flex-start", md: "center" }, color: "common.white" }}
            />
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}