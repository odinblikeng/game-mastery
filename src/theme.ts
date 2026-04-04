import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "class",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#7a3e17",
        },
        secondary: {
          main: "#48616b",
        },
        background: {
          default: "#f4ede3",
          paper: "#fffaf4",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#d7a068",
        },
        secondary: {
          main: "#8fb0bb",
        },
        background: {
          default: "#16120f",
          paper: "#211a15",
        },
      },
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: "var(--font-roboto), system-ui, sans-serif",
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h6: {
      fontWeight: 700,
      letterSpacing: "0.04em",
    },
  },
});

export default theme;