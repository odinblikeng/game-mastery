# Project Guidelines

## Purpose
- Build Game Mastery as a GM-facing application for running tabletop RPG campaigns.
- Prioritize fast access to area descriptions, session prep material, and at-the-table utilities.

## Stack
- Next.js 16 App Router with React 19 and TypeScript.
- Material UI 7 with Emotion and `@mui/material-nextjs` App Router integration.
- Use the `@/*` path alias for imports from `src`.

## Conventions
- Prefer server components by default. Add `"use client"` only when hooks, browser APIs, or client-side interactivity require it.
- Keep shared UI in `src/components` and shared theme configuration in `src/theme.ts`.
- Use Material UI components and theme tokens before adding custom CSS. Avoid adding raw CSS for things MUI can handle with `sx` props or theme overrides.
- Read the relevant Next.js docs under `node_modules/next/dist/docs/` before making framework-specific changes.
- Keep code modern and idiomatic. Avoid filesystem-heavy patterns (readdir/readFile loops) when static imports or build-time resolution work.
- Prefer direct typed imports over runtime file parsing for static content.

## Content Authoring
- Area content lives as MDX files in `src/content/areas/*.mdx` with exported `metadata` objects for structured data (code, title, description).
- MDX rendering uses `@next/mdx` with a root `mdx-components.tsx` that maps markdown elements to MUI components.
- The area registry in `src/lib/areas.ts` uses direct imports from MDX files — keep it simple and typed.
- When adding new areas, create the `.mdx` file and add its import to `src/lib/areas.ts`.

## UI / Layout Preferences
- The app shell is a single-page layout — avoid dedicated routes for content that should live in a sidebar or panel.
- Sidebar panels (like the area browser) belong in the global app shell (`src/components/AppShell.tsx`), not inside individual pages.
- Sidebars should be toggleable from the header and should stick to the viewport on desktop so they remain accessible while scrolling.
- Use query parameters (e.g. `?sidebar=areas&area=m1`) for panel state instead of route navigation — keep the user on the same page.
- Keep the app shell stable: header at the top, optional sidebar, main content, footer at the bottom.

## Project Notes
- Respect the existing strict TypeScript and Next.js ESLint setup.
- Old area markdown files in `public/resources/areas/` have been replaced by MDX under `src/content/areas/`.