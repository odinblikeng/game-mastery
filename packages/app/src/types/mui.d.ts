import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface ChromePalette {
    text: string;
    mutedText: string;
    dimText: string;
    border: string;
    borderStrong: string;
    borderGlow: string;
    shadow: string;
    railBg: string;
    railBorder: string;
    railActiveMark: string;
    railActiveIcon: string;
    railActiveGlow: string;
  }

  interface SidebarPalette {
    background: string;
    border: string;
    shadow: string;
    mutedText: string;
    text: string;
    itemBg: string;
    itemBgActive: string;
    itemBgActiveHover: string;
    itemBorder: string;
    itemBorderActive: string;
    itemBorderHover: string;
  }

  interface HeroPalette {
    background: string;
    overlay: string;
    border: string;
    shadow: string;
    text: string;
    mutedText: string;
  }

  interface Palette {
    chrome: ChromePalette;
    sidebar: SidebarPalette;
    hero: HeroPalette;
  }

  interface PaletteOptions {
    chrome?: Partial<ChromePalette>;
    sidebar?: Partial<SidebarPalette>;
    hero?: Partial<HeroPalette>;
  }
}
