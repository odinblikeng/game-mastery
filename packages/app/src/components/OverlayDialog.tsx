import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import type { DialogProps } from "@mui/material/Dialog";
import type { ReactNode } from "react";

type OverlayDialogProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: DialogProps["maxWidth"];
  testId?: string;
};

export default function OverlayDialog({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = "md",
  testId,
}: OverlayDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth} data-testid={testId}>
      <DialogTitle sx={{ pr: 7 }}>{title}</DialogTitle>
      <IconButton
        aria-label="Close dialog"
        onClick={onClose}
        sx={{ position: "absolute", top: 12, right: 12 }}
      >
        <CloseRoundedIcon />
      </IconButton>
      <DialogContent dividers>{children}</DialogContent>
      {actions ? <DialogActions>{actions}</DialogActions> : null}
    </Dialog>
  );
}