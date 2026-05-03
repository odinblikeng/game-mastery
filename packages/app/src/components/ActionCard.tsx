import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SvgIconComponent } from "@mui/icons-material";
import IconCircle from "@/components/IconCircle";

type ActionCardProps = {
  icon: SvgIconComponent;
  label: string;
  description: string;
};

export default function ActionCard({ icon: Icon, label, description }: ActionCardProps) {
  return (
    <Box
      sx={{
        p: "20px",
        borderRadius: "12px",
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        boxShadow: (t) => t.palette.chrome.shadow,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: (t) =>
            t.palette.mode === "dark"
              ? "0 6px 18px rgba(0,0,0,0.55)"
              : "0 6px 18px rgba(0,0,0,0.08)",
          borderColor: (t) =>
            t.palette.mode === "dark"
              ? "rgba(143,140,255,0.35)"
              : "divider",
        },
      }}
    >
      <IconCircle size={40}>
        <Icon sx={{ fontSize: 20, color: "primary.main" }} />
      </IconCircle>
      <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem", lineHeight: 1.4 }}>
        {description}
      </Typography>
    </Box>
  );
}
