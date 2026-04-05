"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import type { ReactNode } from "react";

type SidebarPanelProps = {
  width?: number;
  onClose: () => void;
  closeButtonTestId?: string;
  children: ReactNode;
};

export default function SidebarPanel({
  width = 340,
  onClose,
  closeButtonTestId,
  children,
}: SidebarPanelProps) {
  return (
    <Box
      component="aside"
      sx={{
        width: { xs: "100%", lg: width },
        flexShrink: 0,
        alignSelf: { lg: "flex-start" },
        position: { lg: "sticky" },
        top: { lg: 104 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          border: 1,
          borderColor: "sidebar.border",
          backgroundColor: "sidebar.background",
          color: "common.white",
          p: 2,
          boxShadow: (t) => t.palette.sidebar.shadow,
          maxHeight: { lg: "calc(100vh - 122px)" },
          overflowY: { lg: "auto" },
        }}
      >
        <IconButton
          size="small"
          onClick={onClose}
          aria-label="Close sidebar"
          data-testid={closeButtonTestId}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "common.white",
            zIndex: 1,
          }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
        {children}
      </Paper>
    </Box>
  );
}
