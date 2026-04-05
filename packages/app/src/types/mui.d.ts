import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    sidebar: {
      background: string;
      border: string;
      shadow: string;
      mutedText: string;
    };
  }

  interface PaletteOptions {
    sidebar?: {
      background?: string;
      border?: string;
      shadow?: string;
      mutedText?: string;
    };
  }
}
