import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

type PanelColumnProps = {
  width: number;
  side: "left" | "right";
  children: ReactNode;
  sx?: SxProps<Theme>;
};

export default function PanelColumn({ width, side, children, sx }: PanelColumnProps) {
  return (
    <Box
      component="aside"
      sx={[
        {
          width,
          flexShrink: 0,
          flexDirection: "column",
          height: "100vh",
          position: "sticky",
          top: 0,
          overflowY: "auto",
          backgroundColor: "background.paper",
          borderLeft: side === "right" ? "1px solid" : "none",
          borderRight: side === "left" ? "1px solid" : "none",
          borderColor: "chrome.railBorder",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}
