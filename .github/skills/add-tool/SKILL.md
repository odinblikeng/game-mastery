---
name: add-tool
description: "Add a new session tool to the Tools sidebar. Use when: adding a tool, creating a sidebar tool, new tool component, session utility, tools sidebar feature. Covers component creation, ToolsSidebar registry wiring, and query param behavior."
---

# Add a New Tool to the Tools Sidebar

## When to Use

- Adding a new session tool (e.g. timer, notes, encounter tracker)
- Creating a new component that lives in the right sidebar

## Architecture

Tools live in the right sidebar, toggled via the `tools` query parameter:
- `tools=menu` — shows the tool list
- `tools=<tool-slug>` — shows a specific tool (e.g. `tools=initiative`)
- Absent — sidebar closed

The left sidebar (`sidebar` param) and right sidebar (`tools` param) are independent.

## Procedure

### 1. Create the tool component

Create `src/components/<ToolName>.tsx` as a `"use client"` component.

**Conventions:**
- Use MUI components and `sx` props for styling — no raw CSS
- Use `useState` for tool-local state (not persisted to URL)
- Use `@dnd-kit` if drag-and-drop reordering is needed
- For tabular input, implement columnar tab order with `data-col`/`data-row` attributes
- Remove non-essential buttons from tab order with `tabIndex={-1}`
- Refocus the first input after form submission for rapid entry
- MUI Icons (`@mui/icons-material`) has no skull icon — use a custom `SvgIcon` wrapper

### 2. Add the tool to the registry in ToolsSidebar

Edit `src/components/ToolsSidebar.tsx`:

**a) Import** the new component and icon at the top:
```tsx
import <ToolName> from "@/components/<ToolName>";
import SomeIcon from "@mui/icons-material/<SomeIcon>";
```

**b) Add one registry entry** to `toolRegistry`:
```tsx
const toolRegistry: ToolDefinition[] = [
  {
    slug: "<tool-slug>",
    label: "<Tool Display Name>",
    icon: SomeIcon,
    component: <ToolName>,
  },
];
```

The menu list and tool view both render from the registry, so no additional switch blocks or AppShell changes are needed.

### 3. Verify

1. Run `npm run build` — no TypeScript or build errors
2. Run `npm run lint` — no new lint errors
3. Manual: Click "Tools" in header → menu shows new tool entry
4. Manual: Click the tool → sidebar shows component with back arrow
5. Manual: Back arrow returns to menu
6. Manual: `?tools=<unknown-slug>` falls back to the menu view
7. Manual: Both sidebars can be open simultaneously

## Checklist

- [ ] Component created in `src/components/`
- [ ] `"use client"` directive at top of component
- [ ] Registry entry added to `toolRegistry` in `ToolsSidebar.tsx`
- [ ] Build passes
- [ ] Lint passes
