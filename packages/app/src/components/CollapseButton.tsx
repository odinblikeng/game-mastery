import IconButton from "@mui/material/IconButton";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import type { SxProps, Theme } from "@mui/material/styles";

type CollapseButtonProps = {
  direction: "left" | "right";
  onClick: () => void;
  testId?: string;
  sx?: SxProps<Theme>;
};

export default function CollapseButton({
  direction,
  onClick,
  testId,
  sx,
}: CollapseButtonProps) {
  const Icon = direction === "left" ? ChevronLeftRoundedIcon : ChevronRightRoundedIcon;

  return (
    <IconButton
      size="small"
      onClick={onClick}
      aria-label="Collapse sidebar"
      data-testid={testId}
      sx={[
        {
          color: "sidebar.mutedText",
          "&:hover": {
            color: "text.primary",
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Icon />
    </IconButton>
  );
}
