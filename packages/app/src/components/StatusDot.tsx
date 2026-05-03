import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type StatusDotProps = {
  color?: "success" | "primary" | "warning";
  label?: string;
  size?: number;
};

export default function StatusDot({ color = "success", label, size = 8 }: StatusDotProps) {
  const dot = (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: `${color}.main`,
        flexShrink: 0,
        filter: (t) =>
          t.palette.mode === "dark" ? "drop-shadow(0 0 4px currentColor)" : "none",
      }}
    />
  );

  if (!label) return dot;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
      {dot}
      <Typography
        variant="caption"
        sx={{ color: `${color}.main`, fontWeight: 600, lineHeight: 1 }}
      >
        {label}
      </Typography>
    </Box>
  );
}
