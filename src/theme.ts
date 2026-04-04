import { alpha, createTheme } from "@mui/material/styles";

const ember = "#a43d24";
const gold = "#b68b46";
const parchment = "#f3ead8";
const ink = "#2c1b11";

const headingStyles = {
  fontFamily: "var(--font-display), serif",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
};

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "class",
  },
  colorSchemes: {
    light: {
      palette: {
        mode: "light",
        primary: {
          main: ember,
          dark: "#7a2817",
          light: "#ca6548",
          contrastText: "#fff6eb",
        },
        secondary: {
          main: gold,
          dark: "#86632c",
          light: "#d1af6f",
          contrastText: "#26180d",
        },
        background: {
          default: "#130d0a",
          paper: parchment,
        },
        text: {
          primary: ink,
          secondary: "#6f5a47",
        },
        divider: "#d8c3a6",
        success: {
          main: "#4a744a",
        },
        warning: {
          main: "#bd7a1a",
        },
      },
    },
    dark: {
      palette: {
        mode: "dark",
        primary: {
          main: "#d56e46",
          dark: "#8d4227",
          light: "#e59a76",
          contrastText: "#140d09",
        },
        secondary: {
          main: "#c59b5c",
          dark: "#8e6d3a",
          light: "#e3be83",
          contrastText: "#1a120b",
        },
        background: {
          default: "#0d0907",
          paper: "#1b1511",
        },
        text: {
          primary: "#f3e9db",
          secondary: "#c6b7a2",
        },
        divider: "#5a4738",
        success: {
          main: "#7cc17f",
        },
        warning: {
          main: "#e0a343",
        },
      },
    },
  },
  shape: {
    borderRadius: 20,
  },
  typography: {
    fontFamily: "var(--font-body), sans-serif",
    h1: {
      ...headingStyles,
      fontSize: "3.5rem",
      lineHeight: 1.02,
    },
    h2: {
      ...headingStyles,
      fontSize: "2.5rem",
      lineHeight: 1.08,
    },
    h3: {
      ...headingStyles,
      fontSize: "1.7rem",
      lineHeight: 1.15,
    },
    h6: {
      ...headingStyles,
      fontSize: "0.95rem",
      lineHeight: 1.2,
    },
    body1: {
      fontSize: "1.05rem",
      lineHeight: 1.75,
    },
    body2: {
      lineHeight: 1.65,
    },
    button: {
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage:
            "linear-gradient(180deg, rgba(16, 11, 8, 0.98), rgba(30, 20, 14, 0.94))",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme: currentTheme }) => ({
          backgroundImage:
            currentTheme.palette.mode === "light"
              ? `linear-gradient(180deg, ${alpha("#ffffff", 0.28)}, rgba(255,255,255,0)), radial-gradient(circle at top, ${alpha(gold, 0.14)}, transparent 42%)`
              : `linear-gradient(180deg, ${alpha("#ffffff", 0.04)}, rgba(255,255,255,0)), radial-gradient(circle at top, ${alpha(gold, 0.08)}, transparent 40%)`,
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme: currentTheme }) => ({
          borderRadius: 999,
          boxShadow: "none",
          paddingInline: currentTheme.spacing(2.5),
          paddingBlock: currentTheme.spacing(1.15),
        }),
        containedPrimary: {
          backgroundImage:
            "linear-gradient(180deg, #b85231 0%, #8d311c 100%)",
          border: `1px solid ${alpha(gold, 0.5)}`,
          boxShadow: `0 14px 28px ${alpha("#000000", 0.22)}`,
          "&:hover": {
            backgroundImage:
              "linear-gradient(180deg, #c76342 0%, #9b3922 100%)",
            boxShadow: `0 18px 32px ${alpha("#000000", 0.28)}`,
          },
        },
        outlined: ({ theme: currentTheme }) => ({
          borderWidth: 1.5,
          borderColor: alpha(currentTheme.palette.secondary.main, 0.5),
          color:
            currentTheme.palette.mode === "light"
              ? currentTheme.palette.text.primary
              : currentTheme.palette.text.primary,
          "&:hover": {
            borderWidth: 1.5,
            borderColor: currentTheme.palette.secondary.main,
            backgroundColor: alpha(currentTheme.palette.secondary.main, 0.08),
          },
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme: currentTheme }) => ({
          borderRadius: 14,
          backgroundColor:
            currentTheme.palette.mode === "light"
              ? alpha("#ffffff", 0.52)
              : alpha("#221914", 0.92),
          "& fieldset": {
            borderColor: alpha(currentTheme.palette.secondary.main, 0.4),
          },
          "&:hover fieldset": {
            borderColor: alpha(currentTheme.palette.primary.main, 0.6),
          },
          "&.Mui-focused fieldset": {
            borderColor: currentTheme.palette.primary.main,
            borderWidth: 1.5,
          },
        }),
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme: currentTheme }) => ({
          transition: currentTheme.transitions.create(
            ["border-color", "background-color", "transform"],
            { duration: currentTheme.transitions.duration.shorter },
          ),
        }),
      },
    },
  },
});

export default theme;