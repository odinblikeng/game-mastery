# Game Mastery Guidelines (CLAUDE.md)

Game Mastery is a GM-facing tabletop RPG campaign runner application built as a Next.js monorepo.

## Build and Test Commands

Run these commands from the repository root:
*   **Start development server:** `npm.cmd run dev` (or `npm run dev`)
*   **Build the production app:** `npm.cmd run build` (or `npm run build`)
*   **Run linter:** `npm.cmd run lint` (or `npm run lint`)
*   **Run Cypress tests (headless):** `npm.cmd run test:e2e` (or `npm run test:e2e`)
*   **Run Cypress tests (UI):** `npm.cmd run test:e2e:open` (or `npm run test:e2e:open`)

If targeting a specific workspace package:
*   **App:** `npm.cmd -w app <command>`
*   **E2E:** `npm.cmd -w e2e <command>`

## Guidelines & Architecture

Detailed project guidelines, conventions, and rules are defined in:
*   [.github/copilot-instructions.md](file:///c:/git/game_mastery/game-mastery/.github/copilot-instructions.md) - Main guidelines, code conventions, routing, sidebars, and UI patterns.
*   [.github/instructions/state-management.instructions.md](file:///c:/git/game_mastery/game-mastery/.github/instructions/state-management.instructions.md) - Guidelines for Zustand store structure, named actions, slices, and URL state synchronization.
*   [docs/templates/README.md](file:///c:/git/game_mastery/game-mastery/docs/templates/README.md) - Guidelines for local game content MDX/JSON structures.

## Instruction Maintenance Policy

> [!IMPORTANT]
> **Updating Project Instructions:**
> Whenever you start or implement a feature that changes the rules, conventions, or architectures described in these instructions, you **MUST** update these instruction files (`CLAUDE.md`, `.github/copilot-instructions.md`, or `.github/instructions/state-management.instructions.md`) to reflect the new state. This ensures instructions do not drift from the actual codebase behavior.
