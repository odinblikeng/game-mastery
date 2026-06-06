---
applyTo: "packages/app/src/store/**,packages/app/src/components/**,packages/app/src/hooks/**"
---

# State Management

Game Mastery uses a single [Zustand](https://github.com/pmndrs/zustand) store (`useGameStore`) as the primary source of truth for all runtime and UI state. There is no React Context for shared state; context is only used for component-local concerns within a single feature.

## Store location

```
packages/app/src/store/
  useGameStore.ts   — single Zustand store, three logical slices
  urlSync.ts        — pure URL utility functions (no React hooks)
```

## Three slices

| Slice | Fields | Responsibility |
|---|---|---|
| **Static data** | `monsters`, `monsterDataMap` | Server-loaded reference data injected once via `StoreHydrator`. Never changes after hydration. |
| **Initiative** | `characters`, `isReady`, `queuedSetupCount` | Full combat tracker state. All mutations go through explicit store actions. |
| **UI** | `openMonsterSlug`, `areaSidebarOpen`, `selectedAreaSlug`, `toolsParam`, `colorMode` | Sidebar visibility, active tool, stat block dialog, color mode. |

## How to read state

Use `useGameStore` with a selector. Prefer narrow selectors to minimise re-renders:

```ts
const characters = useGameStore((s) => s.characters);
const addCharacter = useGameStore((s) => s.addCharacter);
```

For non-reactive reads (inside event handlers, outside React):

```ts
const state = useGameStore.getState();
```

## How to write state

Always use a named store action. Do not call `set()` directly from components:

```ts
// Good — explicit action
useGameStore.getState().addMonster("imp");

// Bad — bypasses encapsulation
useGameStore.setState({ characters: [] });
```

## Adding new state

1. Add the field(s) to the `GameStore` type in `useGameStore.ts`.
2. Add the initial value in the `create(...)` object.
3. Add one or more named action methods with clear intent names.
4. Export a typed selector helper at the bottom of the file if needed.

## URL synchronisation

URL state serves two purposes:
1. **Deep-link support** — users can share / bookmark a URL that opens a specific area or tool.
2. **Server component hydration** — `page.tsx` reads `searchParams.area` to server-render area content.

### URL patterns

| State | URL mechanism | Reason |
|---|---|---|
| `toolsParam` | `window.history.pushState` via `pushUrlFromState` | No server re-render needed for tools sidebar. |
| `areaSidebarOpen` (open) | `window.history.pushState` via `pushUrlFromState` in `openAreaSidebar()` | No server re-render needed to show the sidebar. |
| `areaSidebarOpen` (close) | `router.push(buildUrlFromState(...))` in the calling component | Clears `?area=` param, triggering `page.tsx` to re-render without area content. |
| `selectedAreaSlug` | Next.js `Link` href (`/?sidebar=areas&area=slug`) | `page.tsx` must re-render on the server to load area content. |

### StoreHydrator

`StoreHydrator` (client component, rendered once in `AppShell`) is the synchronisation bridge:

- **On mount** — seeds `toolsParam` from `?tools=` (deep-link for tools sidebar only).
- **On every Next.js navigation** (via `useSearchParams`) — syncs `areaSidebarOpen` and `selectedAreaSlug` from URL after Link-driven navigations so the store reflects the current page URL.
- **On color mode change** — mirrors the MUI `useColorScheme` value to the store.

`window.history.pushState()` does **not** trigger `useSearchParams`, so store-initiated URL updates (for tools, open sidebar) never create a sync loop.

### `urlSync.ts` helpers

| Function | Purpose |
|---|---|
| `buildUrlFromState(partial)` | Constructs a URL string from partial UI state. |
| `pushUrlFromState(partial)` | Calls `buildUrlFromState` then `window.history.pushState`. |
| `readInitialUrlState()` | Reads the current URL (SSR-safe) — kept for testing / utilities. |

## Color mode

MUI's `useColorScheme` remains the source of truth for the actual color mode applied to the theme. The store's `colorMode` field mirrors it for non-MUI consumers. `InitColorSchemeScript` in `layout.tsx` prevents flash-of-incorrect-theme; do not remove it.

To change the color mode, call `setMode` from `useColorScheme()` directly (as in `Header.tsx`). `StoreHydrator` forwards mode changes to the store automatically.

## Monster stat block dialog

`openMonsterSlug` in the UI slice drives the `MonsterStatBlockDialog`. Open via `openStatBlock(slug)`, dismiss via `closeStatBlock()`. Both actions are in the store.

## Initiative tracker

All initiative state lives in the initiative slice. Key rules:
- `addMonster(slug)` adds a character. If combat is already live (`isReady === true`), it increments `queuedSetupCount` and shows the "X monsters added" alert. No queue array — state is direct.
- `clearInitiative()` fully resets all initiative state to defaults. It is idempotent.
- `setReady(true)` starts combat. Once live, new monsters can still be added via `addMonster`.

## What NOT to do

- Do not add React Context providers for shared state. Use the store.
- Do not use `window.history.pushState` for navigations that need `page.tsx` to re-render with new `searchParams`. Use `router.push()` from the component.
- Do not read from `useSearchParams()` in arbitrary components to drive UI. Let `StoreHydrator` sync once and read from the store.
- Do not reach into the store from server components. The store is client-only.

## Instruction Maintenance
- **Updating Instructions**: Whenever you start or implement a feature that changes the rules, conventions, or architectures described in these instructions, you **MUST** update these instruction files (`CLAUDE.md`, `.github/copilot-instructions.md`, or `.github/instructions/state-management.instructions.md`) to reflect the new state. This ensures instructions do not drift from the actual codebase behavior.

