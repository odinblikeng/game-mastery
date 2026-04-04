"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter, useSearchParams } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigateHomeSection = (hash: string) => {
    router.push(`/#${hash}`);
  };

  const toggleAreasSidebar = () => {
    const params = new URLSearchParams(searchParams.toString());
    const isAreaSidebarOpen =
      params.get("sidebar") === "areas" || params.has("area");

    if (isAreaSidebarOpen) {
      router.push("/#overview");
      return;
    }

    params.set("sidebar", "areas");
    params.delete("area");
    router.push(`/?${params.toString()}#areas`);
  };

  const toggleToolsSidebar = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.has("tools")) {
      params.delete("tools");
    } else {
      params.set("tools", "menu");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        backdropFilter: "blur(16px)",
        backgroundColor: "background.paper",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2, minHeight: 72 }}>
          <Typography
            component="a"
            href="/"
            variant="h6"
            sx={{
              color: "text.primary",
              flexShrink: 0,
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            Game Mastery
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Stack
            direction="row"
            spacing={1}
            sx={{
              overflowX: "auto",
              pb: 0.5,
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
            }}
          >
            <Button
              color="inherit"
              onClick={() => navigateHomeSection("overview")}
              sx={{
                borderRadius: 999,
                color: "text.secondary",
                px: 1.75,
                whiteSpace: "nowrap",
              }}
            >
              Overview
            </Button>
            <Button
              color="inherit"
              onClick={toggleAreasSidebar}
              sx={{
                borderRadius: 999,
                color: "text.secondary",
                px: 1.75,
                whiteSpace: "nowrap",
              }}
            >
              Areas
            </Button>
            <Button
              color="inherit"
              onClick={toggleToolsSidebar}
              sx={{
                borderRadius: 999,
                color: "text.secondary",
                px: 1.75,
                whiteSpace: "nowrap",
              }}
            >
              Tools
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}