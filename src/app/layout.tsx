import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Suspense } from "react";
import AppShell from "@/components/AppShell";
import ThemeRegistry from "@/components/ThemeRegistry";
import { getAreaList } from "@/lib/areas";
import "./globals.css";

const roboto = Roboto({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Game Mastery",
  description: "A GM workspace for running tabletop roleplaying campaigns.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const areas = getAreaList();

  return (
    <html lang="en" className={roboto.variable} suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="class" />
        <ThemeRegistry>
          <Suspense fallback={<main className="app-main">{children}</main>}>
            <AppShell areas={areas}>{children}</AppShell>
          </Suspense>
        </ThemeRegistry>
      </body>
    </html>
  );
}
