# Game Mastery

Game Mastery is a GM-facing workspace for running tabletop RPG campaigns. The app keeps area notes, session prep, and table-side tools in one place.

This repository is organized as an npm workspaces monorepo and is currently documented for Windows development.

## Prerequisites

- Node.js 20+
- npm 10+
- PowerShell or Command Prompt on Windows

Use `npm.cmd` in terminal commands in this environment. PowerShell can block `npm.ps1` through execution policy, while `npm.cmd` works consistently.

## Repository Structure

```text
game-mastery/
|-- packages/
|   |-- app/            # Next.js 16 application
|   |   |-- public/
|   |   |-- src/
|   |   |-- eslint.config.mjs
|   |   |-- mdx-components.tsx
|   |   |-- next.config.ts
|   |   |-- package.json
|   |   `-- tsconfig.json
|   `-- e2e/            # Cypress end-to-end tests
|       |-- cypress/
|       |   |-- e2e/
|       |   `-- support/
|       |-- cypress.config.ts
|       |-- package.json
|       `-- tsconfig.json
|-- .github/
|-- .vscode/
|-- .gitignore
|-- package.json        # Workspace root commands
`-- README.md
```

## Getting Started

Install dependencies from the repository root:

```powershell
npm.cmd install
```

Start the app:

```powershell
npm.cmd run dev
```

Open `http://localhost:3000` in your browser.

## Root Commands

Run all commands from the repository root unless noted otherwise.

| Command                     | What it does                                                   |
| --------------------------- | -------------------------------------------------------------- |
| `npm.cmd run dev`           | Starts the Next.js app from `packages/app` in development mode |
| `npm.cmd run build`         | Builds the Next.js app for production                          |
| `npm.cmd run start`         | Starts the built Next.js app                                   |
| `npm.cmd run lint`          | Runs ESLint for the app workspace                              |
| `npm.cmd run test:e2e`      | Runs Cypress end-to-end tests in headless mode                 |
| `npm.cmd run test:e2e:open` | Opens the Cypress interactive runner                           |

## Workspace Commands

If you need to target one workspace directly:

```powershell
npm.cmd -w app run dev
npm.cmd -w app run build
npm.cmd -w app run lint
npm.cmd -w e2e run cy:open
npm.cmd -w e2e run cy:run
```

## Running End-to-End Tests

Use two terminals.

Terminal 1:

```powershell
npm.cmd run dev
```

Terminal 2:

```powershell
npm.cmd run test:e2e
```

For the Cypress UI instead of headless mode:

```powershell
npm.cmd run test:e2e:open
```

## Notes

- The Next.js application lives in `packages/app`.
- Cypress specs and support files live in `packages/e2e`.
- The root package only coordinates workspace commands.
- Local content templates and ignored content structure are documented in `docs/templates/README.md`.
