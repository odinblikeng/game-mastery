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
- Use Material UI components and theme tokens before adding custom CSS.
- Read the relevant Next.js docs under `node_modules/next/dist/docs/` before making framework-specific changes.

## Project Notes
- Area source files live in `public/resources/areas/*.md` and should stay easy to reference or ingest later.
- Keep the app shell stable: header at the top, main content in the middle, footer at the bottom.
- Respect the existing strict TypeScript and Next.js ESLint setup.