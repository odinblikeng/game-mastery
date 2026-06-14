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
- Area content lives as MDX files in `src/content/areas/*.mdx` with exported `metadata` objects for structured data (code, title, description, monsters, treasures).
- MDX rendering uses `@next/mdx` with the app package root `mdx-components.tsx` that maps markdown elements to MUI components, including `<Monster>` and `<Treasure>`.
- The area loader in `src/lib/areas.ts` auto-discovers MDX files from `src/content/areas/` and expects each file to export a default MDX component plus `metadata` with `code`, `title`, `description`, `monsters`, and `treasures`.
- When adding or replacing areas, keep the same MDX export shape and place the files in `src/content/areas/`; no registry edits should be required.
- Monsters are defined under `src/content/monsters/[slug]/index.json` and treasures are defined under `src/content/treasures/[slug]/index.json`.

## UI / Layout Preferences
- The app shell is a single-page layout — avoid dedicated routes for content that should live in a sidebar or panel.
- Sidebar panels (like the area browser) belong in the global app shell (`src/components/AppShell.tsx`), not inside individual pages.
- Sidebars should be toggleable from the header and should stick to the viewport on desktop so they remain accessible while scrolling.
- Use query parameters (e.g. `?sidebar=areas&area=m1`) for panel state instead of route navigation — keep the user on the same page.
- Keep the app shell stable: header at the top, optional sidebar, main content, footer at the bottom.
- The left sidebar (`sidebar` param) is for content browsing (areas). The right sidebar (`tools` param) is for session tools (initiative, etc.). Both are independent and can be open simultaneously.
- Header buttons for sidebars should only toggle their sidebar open/closed via query params — never navigate to a hash or change the content view.

## Tools Sidebar
- Session tools live in a right sidebar toggled via the `tools` query parameter (`tools=menu`, `tools=initiative`, etc.).
- `src/components/ToolsSidebar.tsx` is the shell and source of truth for tool registration.
- Each tool is its own component (e.g. `src/components/InitiativeTracker.tsx`) rendered inside the tools sidebar.
- Tool views include a back button (arrow-left icon) to return to the tools menu.
- Register tools through the typed `toolRegistry` in `src/components/ToolsSidebar.tsx`; the menu and active-tool view both render from that registry.
- When adding a new tool: create the component, import its icon/component in `ToolsSidebar`, and add one registry entry. Do not add per-tool gating in `AppShell`.
- Unknown `tools` query values should degrade gracefully by showing the tools menu rather than breaking the sidebar.

## Drag and Drop
- Use `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities` for drag-and-drop reordering. MUI has no built-in DnD.
- Use `useSortable` with `verticalListSortingStrategy` for simple list reorder.

## Form UX Patterns
- When a form adds items to a list (e.g. adding characters), refocus the first input after submission so the user can immediately add another.
- For tabular input across multiple rows, use columnar tab order (down the column, then to the next column) instead of row-by-row. Implement with `data-col`/`data-row` attributes and a `handleColumnTab` helper that intercepts Tab key events.
- Remove non-essential buttons (like per-row delete icons) from tab order with `tabIndex={-1}`.

## Icons
- MUI Icons (`@mui/icons-material`) does not include a skull icon. Use a custom `SvgIcon` wrapper with an inline SVG path when needed.

## State Management
- All shared runtime and UI state lives in a single Zustand store at `src/store/useGameStore.ts`. No React Context for shared state.
- Three slices: **static data** (monsters/monsterDataMap, server-injected once), **initiative** (combat tracker), **UI** (sidebars, stat block dialog, tools param, color mode).
- Always use named store actions — never call `set()` or `setState()` from components.
- `StoreHydrator` (client component in `AppShell`) hydrates the store from server-loaded props and syncs URL→store via `useSearchParams`.
- Area navigation (selecting an area, closing area sidebar) uses `router.push()` so that `page.tsx` (server component) re-renders with the correct `searchParams`. Tools sidebar state uses `window.history.pushState` (store action) — no server re-render needed.
- See `.github/instructions/state-management.instructions.md` for full detail on slices, URL sync, and patterns.

## Instruction Maintenance
- **Updating Instructions**: Whenever you start or implement a feature that changes the rules, conventions, or architectures described in these instructions, you **MUST** update these instruction files (`CLAUDE.md`, `.github/copilot-instructions.md`, or `.github/instructions/state-management.instructions.md`) to reflect the new state. This ensures instructions do not drift from the actual codebase behavior.

## Project Notes
- Respect the existing strict TypeScript and Next.js ESLint setup.

