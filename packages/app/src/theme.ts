import { alpha, createTheme } from "@mui/material/styles";

export const ember = "#a43d24";
export const gold = "#b68b46";
export const parchment = "#f3ead8";
export const ink = "#2c1b11";

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
          default: "#faf6f0",
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
        chrome: {
          text: ink,
          mutedText: "#6f5a47",
          dimText: alpha(ink, 0.48),
          border: alpha(gold, 0.35),
          borderStrong: alpha(gold, 0.55),
          borderGlow: `linear-gradient(90deg, transparent 0%, ${alpha(gold, 0.25)} 18%, ${alpha(gold, 0.45)} 50%, ${alpha(gold, 0.25)} 82%, transparent 100%)`,
          shadow: `0 8px 24px ${alpha("#000000", 0.08)}`,
          headerBg: `linear-gradient(180deg, ${alpha("#ffffff", 0.92)}, ${alpha(parchment, 0.88)})`,
          footerBg: `linear-gradient(180deg, ${alpha(parchment, 0.4)}, ${alpha(parchment, 0.7)})`,
          logoBg: `linear-gradient(180deg, ${alpha(ember, 0.14)}, ${alpha(ink, 0.08)})`,
          logoBorder: alpha(gold, 0.45),
          logoText: ember,
        },
        sidebar: {
          background: alpha(parchment, 0.92),
          border: alpha(gold, 0.3),
          shadow: `0 20px 44px ${alpha("#000000", 0.1)}`,
          mutedText: "#6f5a47",
          text: ink,
          itemBg: alpha("#ffffff", 0.4),
          itemBgActive: alpha(ember, 0.1),
          itemBgActiveHover: alpha(ember, 0.16),
          itemBorder: alpha(gold, 0.18),
          itemBorderActive: alpha(gold, 0.45),
          itemBorderHover: alpha(gold, 0.35),
        },
        hero: {
          background: `linear-gradient(135deg, ${alpha(parchment, 0.95)}, ${alpha("#ffffff", 0.9)})`,
          overlay: `radial-gradient(circle at top right, ${alpha(gold, 0.1)}, transparent 32%), radial-gradient(circle at left, ${alpha(ember, 0.08)}, transparent 34%)`,
          border: alpha(gold, 0.35),
          shadow: `0 12px 32px ${alpha("#000000", 0.06)}`,
          text: ink,
          mutedText: "#6f5a47",
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
        chrome: {
          text: "#ffffff",
          mutedText: alpha(parchment, 0.72),
          dimText: alpha(parchment, 0.48),
          border: alpha(gold, 0.35),
          borderStrong: alpha(gold, 0.55),
          borderGlow: `linear-gradient(90deg, transparent 0%, ${alpha(gold, 0.45)} 18%, ${alpha(gold, 0.8)} 50%, ${alpha(gold, 0.45)} 82%, transparent 100%)`,
          shadow: `0 18px 40px ${alpha("#000000", 0.28)}`,
          headerBg: "linear-gradient(180deg, rgba(16, 11, 8, 0.98), rgba(30, 20, 14, 0.94))",
          footerBg: "linear-gradient(180deg, rgba(18, 12, 9, 0.2), rgba(9, 7, 6, 0.7))",
          logoBg: "linear-gradient(180deg, rgba(174, 59, 33, 0.28), rgba(34, 22, 16, 0.92))",
          logoBorder: alpha(gold, 0.55),
          logoText: "#d1af6f",
        },
        sidebar: {
          background: "rgba(24, 17, 13, 0.84)",
          border: alpha(gold, 0.34),
          shadow: `0 20px 44px ${alpha("#000000", 0.25)}`,
          mutedText: alpha(parchment, 0.72),
          text: "#ffffff",
          itemBg: alpha("#ffffff", 0.02),
          itemBgActive: alpha(ember, 0.16),
          itemBgActiveHover: alpha(ember, 0.24),
          itemBorder: alpha(gold, 0.18),
          itemBorderActive: alpha(gold, 0.52),
          itemBorderHover: alpha(gold, 0.4),
        },
        hero: {
          background: "linear-gradient(135deg, rgba(22, 15, 11, 0.98), rgba(45, 31, 22, 0.95))",
          overlay: `radial-gradient(circle at top right, ${alpha(gold, 0.18)}, transparent 32%), radial-gradient(circle at left, rgba(164, 61, 36, 0.22), transparent 34%)`,
          border: alpha(gold, 0.4),
          shadow: `0 26px 60px ${alpha("#000000", 0.28)}`,
          text: "#ffffff",
          mutedText: alpha(parchment, 0.78),
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
        root: ({ theme: currentTheme }) => ({
          backgroundImage: currentTheme.palette.chrome.headerBg,
        }),
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
        outlinedSuccess: ({ theme: currentTheme }) => ({
          borderColor: alpha(currentTheme.palette.success.main, 0.6),
          color: currentTheme.palette.success.main,
          "&:hover": {
            borderColor: currentTheme.palette.success.main,
            backgroundColor: alpha(currentTheme.palette.success.main, 0.1),
          },
        }),
        outlinedError: ({ theme: currentTheme }) => ({
          borderColor: alpha(currentTheme.palette.error.main, 0.6),
          color: currentTheme.palette.error.main,
          "&:hover": {
            borderColor: currentTheme.palette.error.main,
            backgroundColor: alpha(currentTheme.palette.error.main, 0.1),
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