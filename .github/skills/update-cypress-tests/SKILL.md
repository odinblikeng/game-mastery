---
name: update-cypress-tests
description: "Update or extend Cypress coverage for a specific feature in this repo. Use when: updating Cypress tests, adding Cypress coverage, changing E2E specs, refreshing selectors, wiring cy- test ids, or validating feature flows in the Game Mastery app. Uses a GPT-5.4 subagent, repo-specific search commands, and targeted verification for the changed spec."
argument-hint: "Describe the functionality, expected behavior, and any changed files or selectors."
---

# Update Cypress Tests

## When to Use

- A feature changed and the Cypress specs need to be updated
- A new flow needs E2E coverage in `packages/e2e/cypress/e2e`
- Existing selectors broke and need to be re-aligned with the app
- The app needs stable `cy-` test ids to support reliable Cypress assertions

## Scope

This skill is workspace-specific for the Game Mastery monorepo.

Repo facts to include in the workflow:
- App code lives in `packages/app`
- Cypress code lives in `packages/e2e`
- Use `npm.cmd` and `npx.cmd` on Windows in this environment
- Test ids use the `cy-` prefix
- The app shell exposes `data-testid="cy-app-shell"` and `data-hydrated="true"` when client hydration is ready

## Required Outcome

Produce working Cypress coverage for the requested functionality, not just a plan.

The skill should:
1. Gather enough repo context to find the affected feature and current tests
2. Launch a GPT-5.4 subagent with all needed instructions and search commands
3. Have the subagent update or add Cypress specs and any minimal app-side test hooks needed
4. Verify the result with targeted commands for the changed spec
5. Return a concise summary of changed files, verification, and a note that the full suite is still available to the calling agent

## Procedure

### 1. Clarify only the missing behavior

If the user did not specify the feature behavior, ask only for:
- the user-facing flow that must be covered
- the expected result
- whether the change should update an existing spec or add a new one

If those are already clear, do not ask more questions.

### 2. Launch a GPT-5.4 subagent immediately

Use `runSubagent` and let it use the current agent model, which is GPT-5.4 in this environment.

Tell the subagent to do the implementation work, not just research.

### 3. Give the subagent a complete prompt

Use a prompt in this shape and fill in the user-specific details:

```text
You are a GPT-5.4 coding subagent working in the Game Mastery repo on Windows.

Task:
Update Cypress coverage for: <feature or behavior>

Expected behavior:
- <behavior 1>
- <behavior 2>

Implementation requirements:
- Make the smallest source changes needed.
- Prefer updating existing specs when the behavior belongs there.
- Add a new spec only when the behavior is meaningfully separate.
- Add `data-testid` values with the `cy-` prefix by default when they improve test stability or readability.
- Preserve the existing hydration-wait pattern with `cy-app-shell`.
- Keep the existing repo style and avoid unrelated refactors.

Repo structure:
- App: packages/app
- Cypress: packages/e2e
- Main Cypress specs: packages/e2e/cypress/e2e/*.cy.ts

Search commands to run first:
- rg --files packages/app/src packages/e2e/cypress/e2e
- rg -n "<feature keywords>|data-testid|cy-|tools=|sidebar=|area=" packages/app/src packages/e2e/cypress/e2e
- rg -n "cy-app-shell|data-hydrated|visitAndWait" packages/e2e/cypress/e2e packages/app/src
- rg -n "<visible labels, button text, headings, route/query values>" packages/app/src packages/e2e/cypress/e2e

Suggested files to inspect when relevant:
- packages/app/src/components
- packages/app/src/hooks
- packages/app/src/app
- packages/e2e/cypress/e2e
- packages/e2e/cypress/support

Implementation steps:
1. Find the feature entry points and the closest existing spec coverage.
2. Decide whether to edit an existing spec or add a new one.
3. Add or update Cypress assertions and helper flows.
4. Add minimal app-side `cy-` test ids only where semantic selectors are not stable enough.
5. Run targeted verification.
6. Report touched files, commands run, the updated spec path, and any unresolved risk.

Required verification:
- npm.cmd run lint --workspace app
- npx.cmd -w app tsc --noEmit
- npx.cmd -w e2e tsc --noEmit
- Start app: npm.cmd run dev --workspace app
- Run only the changed spec from repo root: npm.cmd -w e2e run cy:run -- --spec "cypress/e2e/<spec-file>.cy.ts"

Important execution notes:
- Use `rg` for searches.
- Run the targeted Cypress spec from the repo root so workspace resolution is correct.
- If the dev server is started in a background terminal, confirm it is actually ready before running Cypress.
- When running Cypress, use a blocking terminal when practical. If a background terminal is used, explicitly wait for completion with the terminal-waiting tool and confirm the exit status.
- Do not treat partial live output as a finished result. A line like `Running: ...` is not completion.
- If a background dev server is started, stop it before finishing.
- Do not edit generated `.next` files.
- Do not run the entire Cypress sweep unless the calling agent explicitly asks for it.

Return format:
- Files changed
- Behavior covered
- Updated spec path
- Verification results
- Ready-for-sweep note
- Open questions or residual risk
```

### 4. Decision points

Choose the path explicitly:

- Existing spec fits the behavior:
  Edit that spec and keep coverage grouped by feature.
- No existing spec fits cleanly:
  Add a new `*.cy.ts` file named after the feature flow.
- Existing selectors are brittle:
  Add `cy-` test ids in app components by default.
- Existing semantic selectors are stable:
  Prefer those instead of adding new hooks.
- The feature depends on client hydration:
  Wait on `[data-testid="cy-app-shell"]` with `data-hydrated="true"` before interaction.

### 5. Completion criteria

The task is complete only when all of the following are true:

- Cypress coverage matches the requested behavior
- Source-side selectors and Cypress selectors agree
- Lint passes for `packages/app`
- TypeScript passes for both workspaces
- The changed or added spec passes against a live dev server
- The Cypress command has fully completed and its result is confirmed from final command status, not partial output
- The final response states that the targeted spec is ready and the full sweep has not been run yet

## Quality Bar

- Favor behavior-focused tests over implementation-detail assertions
- Keep selectors deterministic and readable
- Minimize app code changes outside testability hooks
- Preserve existing Cypress conventions already used in this repo
- Fix the root cause of test breakage, not just the failing assertion

## Example Prompts

- `/update-cypress-tests cover opening the Initiative tool from the Tools menu and returning to the menu`
- `/update-cypress-tests update the area sidebar tests for a new filter flow that matches area descriptions`
- `/update-cypress-tests add coverage for closing the tools sidebar after selecting a tool`