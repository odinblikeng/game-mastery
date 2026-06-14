import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import type { Metadata } from "next";
import { Alegreya_Sans, Cinzel } from "next/font/google";
import { Suspense } from "react";
import AppShell from "@/components/AppShell";
import ThemeRegistry from "@/components/ThemeRegistry";
import { getAreaList } from "@/lib/areas";
import { getMonsterDataMap, getMonsterList } from "@/lib/monsters";
import { getTreasureDataMap, getTreasureList } from "@/lib/treasures";
import "./globals.css";

const bodyFont = Alegreya_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700", "800"],
});

const displayFont = Cinzel({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Game Mastery",
  description: "A GM workspace for running tabletop roleplaying campaigns.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const areas = await getAreaList();
  const monsters = await getMonsterList();
  const monsterDataMap = await getMonsterDataMap(monsters.map((monster) => monster.slug));
  const treasures = await getTreasureList();
  const treasureDataMap = await getTreasureDataMap(treasures.map((treasure) => treasure.slug));

  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable}`}
      suppressHydrationWarning
    >
      <body>
        <InitColorSchemeScript attribute="class" />
        <ThemeRegistry>
          <Suspense fallback={<main className="app-main">{children}</main>}>
            <AppShell
              areas={areas}
              monsters={monsters}
              monsterDataMap={monsterDataMap}
              treasures={treasures}
              treasureDataMap={treasureDataMap}
            >
              {children}
            </AppShell>
          </Suspense>
        </ThemeRegistry>
      </body>
    </html>
  );
}
