import TextField from "@mui/material/TextField";
import type { TextFieldProps } from "@mui/material/TextField";

export default function GhostInput(props: TextFieldProps) {
  return (
    <TextField
      size="small"
      {...props}
      sx={[
        {
          "& .MuiOutlinedInput-root": {
            backgroundColor: (t) =>
              t.palette.mode === "dark"
                ? "rgba(255,255,255,0.045)"
                : "#E9E4D8",
            borderRadius: 2,
            "& fieldset": {
              border: (t) =>
                t.palette.mode === "dark"
                  ? "1px solid rgba(196,167,106,0.16)"
                  : "none",
            },
            "&:hover fieldset": {
              borderColor: (t) =>
                t.palette.mode === "dark"
                  ? "rgba(196,167,106,0.28)"
                  : "none",
            },
            "&.Mui-focused fieldset": {
              border: "1.5px solid",
              borderColor: "primary.main",
            },
          },
        },
        ...(Array.isArray(props.sx) ? props.sx : props.sx ? [props.sx] : []),
      ]}
    />
  );
}
