import { alpha, createTheme } from "@mui/material/styles";

// Light mode tokens
const parchmentTone = "#F4F1EA";
const surfaceWhite = "#FFFFFF";
const primaryText = "#2B2B2B";
const secondaryText = "#6B6B6B";
const indigoAccent = "#5C6BC0";
const goldAccent = "#C2A96A";
const subtleBorder = "#D8D2C4";

// Dark mode tokens
const darkBgMain = "#0d1016";
const darkBgSurface = "#151922";
const darkTextPrimary = "#ece8df";
const darkTextSecondary = "#aaa49a";
const darkTextMuted = "#7d776d";
const darkAccentPrimary = "#8f8cff";
const darkAccentGold = "#c4a76a";
const darkBorderSubtle = "rgba(196, 167, 106, 0.18)";
const darkBorderStrong = "rgba(196, 167, 106, 0.32)";

const headingStyles = {
  fontFamily: "var(--font-display), serif",
  fontWeight: 600,
  letterSpacing: "0.04em",
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
          main: indigoAccent,
          dark: "#3949AB",
          light: "#7986CB",
          contrastText: "#ffffff",
        },
        secondary: {
          main: goldAccent,
          dark: "#8D7540",
          light: "#D4BC8A",
          contrastText: "#2B2B2B",
        },
        background: {
          default: parchmentTone,
          paper: surfaceWhite,
        },
        text: {
          primary: primaryText,
          secondary: secondaryText,
        },
        divider: subtleBorder,
        success: {
          main: "#4a744a",
        },
        warning: {
          main: "#bd7a1a",
        },
        chrome: {
          text: primaryText,
          mutedText: secondaryText,
          dimText: alpha(primaryText, 0.48),
          border: subtleBorder,
          borderStrong: "#BFB9AF",
          borderGlow: "none",
          shadow: "0 4px 12px rgba(0,0,0,0.06)",
          railBg: "transparent",
          railBorder: subtleBorder,
          railActiveMark: indigoAccent,
          railActiveIcon: indigoAccent,
          railActiveGlow: "none",
        },
        sidebar: {
          background: surfaceWhite,
          border: subtleBorder,
          shadow: "0 4px 12px rgba(0,0,0,0.06)",
          mutedText: secondaryText,
          text: primaryText,
          itemBg: "transparent",
          itemBgActive: alpha(indigoAccent, 0.06),
          itemBgActiveHover: alpha(indigoAccent, 0.10),
          itemBorder: "transparent",
          itemBorderActive: indigoAccent,
          itemBorderHover: subtleBorder,
        },
        hero: {
          background: parchmentTone,
          overlay: "none",
          border: subtleBorder,
          shadow: "0 4px 12px rgba(0,0,0,0.06)",
          text: primaryText,
          mutedText: secondaryText,
        },
      },
    },
    dark: {
      palette: {
        mode: "dark",
        primary: {
          main: darkAccentPrimary,
          dark: "#5C5ACC",
          light: "#B0AEFF",
          contrastText: "#0d1016",
        },
        secondary: {
          main: darkAccentGold,
          dark: "#8A6F3A",
          light: "#DBC083",
          contrastText: "#0d1016",
        },
        background: {
          default: darkBgMain,
          paper: darkBgSurface,
        },
        text: {
          primary: darkTextPrimary,
          secondary: darkTextSecondary,
        },
        divider: darkBorderSubtle,
        success: {
          main: "#78a886",
        },
        warning: {
          main: "#e0a343",
        },
        chrome: {
          text: darkTextPrimary,
          mutedText: darkTextSecondary,
          dimText: alpha(darkTextPrimary, 0.48),
          border: darkBorderSubtle,
          borderStrong: darkBorderStrong,
          borderGlow: `linear-gradient(90deg, transparent, ${alpha(darkAccentGold, 0.35)} 50%, transparent)`,
          shadow: "0 18px 40px rgba(0,0,0,0.45)",
          railBg: "transparent",
          railBorder: darkBorderSubtle,
          railActiveMark: darkAccentPrimary,
          railActiveIcon: darkAccentPrimary,
          railActiveGlow: "0 0 16px rgba(143,140,255,0.6)",
        },
        sidebar: {
          background: `linear-gradient(180deg, rgba(27,32,43,0.96), rgba(16,19,27,0.96))`,
          border: darkBorderSubtle,
          shadow: "0 18px 40px rgba(0,0,0,0.45)",
          mutedText: darkTextMuted,
          text: darkTextPrimary,
          itemBg: "transparent",
          itemBgActive: "rgba(143,140,255,0.09)",
          itemBgActiveHover: "rgba(143,140,255,0.13)",
          itemBorder: "transparent",
          itemBorderActive: darkAccentPrimary,
          itemBorderHover: darkBorderSubtle,
        },
        hero: {
          background: `linear-gradient(180deg, ${darkBgSurface}, ${darkBgMain})`,
          overlay: `radial-gradient(circle at 30% 0%, rgba(143,140,255,0.12), transparent 32%), radial-gradient(circle at 80% 20%, rgba(196,167,106,0.08), transparent 28%)`,
          border: darkBorderSubtle,
          shadow: "0 18px 40px rgba(0,0,0,0.45)",
          text: darkTextPrimary,
          mutedText: darkTextSecondary,
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "var(--font-body), sans-serif",
    h1: {
      ...headingStyles,
      fontSize: "3.5rem",
      lineHeight: 1.06,
    },
    h2: {
      ...headingStyles,
      fontSize: "2.5rem",
      lineHeight: 1.1,
    },
    h3: {
      ...headingStyles,
      fontSize: "1.7rem",
      lineHeight: 1.18,
    },
    h6: {
      ...headingStyles,
      fontSize: "0.95rem",
      lineHeight: 1.2,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.7,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      letterSpacing: "0.04em",
      textTransform: "none" as const,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          backgroundColor: t.palette.background.paper,
          backgroundImage: "none",
          borderBottom: `1px solid ${t.palette.divider}`,
          boxShadow: t.palette.chrome.shadow,
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          boxShadow: "none",
          paddingInline: "20px",
          paddingBlock: "9px",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: ({ theme: t }) => ({
          backgroundColor: t.palette.primary.main,
          "&:hover": {
            backgroundColor: t.palette.primary.dark,
            ...(t.palette.mode === "dark" && {
              boxShadow: "0 0 24px rgba(143,140,255,0.25)",
            }),
          },
        }),
        outlined: ({ theme: t }) => ({
          borderWidth: 1,
          borderColor: t.palette.divider,
          color: t.palette.text.primary,
          "&:hover": {
            borderColor: t.palette.primary.main,
            backgroundColor: alpha(t.palette.primary.main, 0.06),
          },
        }),
        outlinedSuccess: ({ theme: t }) => ({
          borderColor: alpha(t.palette.success.main, 0.6),
          color: t.palette.success.main,
          "&:hover": {
            borderColor: t.palette.success.main,
            backgroundColor: alpha(t.palette.success.main, 0.1),
          },
        }),
        outlinedError: ({ theme: t }) => ({
          borderColor: alpha(t.palette.error.main, 0.6),
          color: t.palette.error.main,
          "&:hover": {
            borderColor: t.palette.error.main,
            backgroundColor: alpha(t.palette.error.main, 0.1),
          },
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
          letterSpacing: "0.04em",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          borderRadius: 10,
          backgroundColor:
            t.palette.mode === "dark"
              ? "rgba(255,255,255,0.045)"
              : "transparent",
          "& fieldset": {
            borderColor: t.palette.divider,
          },
          "&:hover fieldset": {
            borderColor: t.palette.primary.main,
          },
          "&.Mui-focused fieldset": {
            borderColor: t.palette.primary.main,
            borderWidth: 1.5,
          },
        }),
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          transition: t.transitions.create(
            ["border-color", "background-color", "transform", "box-shadow"],
            { duration: 150 },
          ),
        }),
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          borderColor: t.palette.divider,
        }),
      },
    },
  },
});

export default theme;
