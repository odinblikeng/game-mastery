import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import type { SvgIconComponent } from "@mui/icons-material";
import IconCircle from "@/components/IconCircle";

type ToolCardProps = {
  icon: SvgIconComponent;
  label: string;
  description: string;
  onClick: () => void;
  testId?: string;
};

export default function ToolCard({ icon: Icon, label, description, onClick, testId }: ToolCardProps) {
  return (
    <ListItemButton
      onClick={onClick}
      data-testid={testId}
      sx={(t) => ({
        borderRadius: "10px",
        border: "1px solid",
        borderColor: "divider",
        p: 2,
        gap: 1.5,
        alignItems: "center",
        boxShadow: t.palette.chrome.shadow,
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow:
            t.palette.mode === "dark"
              ? "0 6px 18px rgba(0,0,0,0.55)"
              : "0 6px 18px rgba(0,0,0,0.08)",
          borderColor:
            t.palette.mode === "dark"
              ? "rgba(143,140,255,0.35)"
              : t.palette.primary.main,
        },
      })}
    >
      <IconCircle size={36}>
        <Icon sx={{ fontSize: 18, color: "primary.main" }} />
      </IconCircle>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: "sidebar.text", mb: 0.25 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: "sidebar.mutedText", fontSize: "0.8rem", lineHeight: 1.4 }}>
          {description}
        </Typography>
      </Box>
      <ChevronRightRoundedIcon sx={{ fontSize: 18, color: "sidebar.mutedText", flexShrink: 0 }} />
    </ListItemButton>
  );
}
