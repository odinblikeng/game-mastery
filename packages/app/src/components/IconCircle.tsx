import Box from "@mui/material/Box";
import type { ReactNode } from "react";

type IconCircleProps = {
  size?: number;
  children: ReactNode;
};

export default function IconCircle({ size = 36, children }: IconCircleProps) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "1px solid",
        borderColor: "divider",
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        backgroundColor: (t) =>
          t.palette.mode === "dark"
            ? "rgba(143,140,255,0.06)"
            : `${t.palette.primary.main}0f`,
      }}
    >
      {children}
    </Box>
  );
}
