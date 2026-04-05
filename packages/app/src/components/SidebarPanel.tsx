"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type SidebarPanelProps = {
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  isResizable?: boolean;
  resizeHandleSide?: "left" | "right";
  onClose: () => void;
  onWidthChange?: (width: number) => void;
  closeButtonTestId?: string;
  panelTestId?: string;
  resizeHandleTestId?: string;
  children: ReactNode;
};

export default function SidebarPanel({
  width = 340,
  minWidth = 280,
  maxWidth = 560,
  isResizable = false,
  resizeHandleSide = "right",
  onClose,
  onWidthChange,
  closeButtonTestId,
  panelTestId,
  resizeHandleTestId,
  children,
}: SidebarPanelProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"), { noSsr: true });
  const [isResizing, setIsResizing] = useState(false);
  const resizeStateRef = useRef({ startX: 0, startWidth: width });
  const canResize = isResizable && isDesktop && typeof onWidthChange === "function";

  useEffect(() => {
    resizeStateRef.current.startWidth = width;
  }, [width]);

  useEffect(() => {
    if (!isResizing) {
      return undefined;
    }

    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handlePointerMove = (event: PointerEvent) => {
      const deltaX = event.clientX - resizeStateRef.current.startX;
      const nextWidth =
        resizeHandleSide === "left"
          ? resizeStateRef.current.startWidth - deltaX
          : resizeStateRef.current.startWidth + deltaX;

      onWidthChange?.(Math.max(minWidth, Math.min(nextWidth, maxWidth)));
    };

    const handlePointerUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isResizing, maxWidth, minWidth, onWidthChange, resizeHandleSide]);

  const startResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!canResize) {
      return;
    }

    event.preventDefault();
    resizeStateRef.current = {
      startX: event.clientX,
      startWidth: width,
    };
    setIsResizing(true);
  };

  return (
    <Box
      component="aside"
      data-testid={panelTestId}
      sx={{
        width: { xs: "100%", lg: width },
        flexShrink: 0,
        alignSelf: { lg: "flex-start" },
        position: { lg: "sticky" },
        top: { lg: 104 },
        minWidth: { lg: canResize ? minWidth : width },
        maxWidth: { lg: maxWidth },
        zIndex: isResizing ? 2 : "auto",
      }}
    >
      {canResize ? (
        <Box
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize sidebar"
          data-testid={resizeHandleTestId}
          onPointerDown={startResize}
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            [resizeHandleSide]: -8,
            width: 16,
            cursor: "col-resize",
            zIndex: 3,
            touchAction: "none",
            "&::after": {
              content: '""',
              position: "absolute",
              top: 12,
              bottom: 12,
              left: "50%",
              width: 2,
              transform: "translateX(-50%)",
              borderRadius: 999,
              backgroundColor: isResizing ? "primary.main" : "sidebar.border",
              transition: "background-color 120ms ease",
            },
            "&:hover::after": {
              backgroundColor: "primary.main",
            },
          }}
        />
      ) : null}
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          border: 1,
          borderColor: "sidebar.border",
          backgroundColor: "sidebar.background",
          color: "sidebar.text",
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
            color: "sidebar.text",
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
