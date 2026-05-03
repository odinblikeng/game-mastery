import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

type PanelHeaderProps = {
  title: string;
  children?: ReactNode;
};

export default function PanelHeader({ title, children }: PanelHeaderProps) {
  return (
    <Box sx={{ mb: 1.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "sidebar.mutedText",
          }}
        >
          {title}
        </Typography>
        {children}
      </Box>
      <Divider />
    </Box>
  );
}
