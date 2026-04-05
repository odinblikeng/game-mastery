---
name: maintain-cypress-selectors
description: "Audit and maintain Cypress selectors for this repo. Use when: fixing broken data-testid values, standardizing cy- selectors, renaming selectors in app code and Cypress specs, or repairing brittle E2E selectors in the Game Mastery app. Uses a GPT-5.4 subagent, repo-specific search commands, and targeted verification for affected specs."
argument-hint: "Describe the selector drift, naming goal, or feature whose Cypress selectors need maintenance."
---

# Maintain Cypress Selectors

## When to Use

- Cypress selectors drifted from the app code
- Test ids need to be renamed or standardized
- A feature needs stable `cy-` selectors before new coverage is added
- Existing E2E tests are too dependent on brittle DOM structure or text

## Scope

This skill is workspace-specific for the Game Mastery monorepo.

Repo facts to include in the workflow:
- App code lives in `packages/app`
- Cypress code lives in `packages/e2e`
- Test ids should use the `cy-` prefix
- Existing specs live in `packages/e2e/cypress/e2e`
- Hydration-aware tests wait for `cy-app-shell`

## Required Outcome

Produce aligned, stable Cypress selectors across app code and specs.

The skill should:
1. Find the selector drift or naming inconsistency
2. Launch a GPT-5.4 subagent with repo-specific search guidance
3. Update app-side selectors and Cypress-side selectors together
4. Run targeted verification for affected specs
5. Report what was renamed and whether the full sweep still needs to be run

## Procedure

### 1. Clarify only the selector goal

If needed, ask only for:
- the feature or files affected
- the desired selector convention

If the naming goal is already clear, do not ask more questions.

### 2. Launch a GPT-5.4 subagent immediately

Use `runSubagent` and tell it to perform the implementation work.

### 3. Give the subagent a complete prompt

Use a prompt in this shape and fill in the selector task details:

```text
You are a GPT-5.4 coding subagent working in the Game Mastery repo on Windows.

Task:
Maintain Cypress selectors for: <feature, file set, or selector convention>

Desired outcome:
- <selector goal 1>
- <selector goal 2>

Implementation requirements:
- Update app-side and Cypress-side selectors together.
- Prefer `cy-` prefixed `data-testid` values for stable hooks.
- Make the smallest source changes needed.
- Preserve existing Cypress helper patterns such as hydration waits.
- Avoid unrelated refactors.

Repo structure:
- App: packages/app
- Cypress: packages/e2e

Search commands to run first:
- rg --files packages/app/src packages/e2e/cypress/e2e
- rg -n "data-testid|cy-|<feature keywords>|<old selector>|<new selector>" packages/app/src packages/e2e/cypress/e2e
- rg -n "visitAndWait|cy-app-shell|data-hydrated" packages/e2e/cypress/e2e packages/app/src

Implementation steps:
1. Find every producer and consumer of the relevant selectors.
2. Decide the final selector names.
3. Update source and Cypress specs atomically.
4. Run lint and TypeScript checks.
5. Run only the affected Cypress spec or specs.
6. Report renamed selectors, files changed, and readiness for a full sweep.

Required verification:
- npm.cmd run lint --workspace app
- npx.cmd -w app tsc --noEmit
- npx.cmd -w e2e tsc --noEmit
- Start app: npm.cmd run dev --workspace app
- Run affected spec(s) from repo root: npm.cmd -w e2e run cy:run -- --spec "cypress/e2e/<spec-file>.cy.ts"

Important execution notes:
- Use `rg` for searches.
- If the dev server is started in a background terminal, confirm it is ready before running Cypress.
- When running Cypress, use a blocking terminal when practical. If a background terminal is used, explicitly wait for completion with the terminal-waiting tool and verify the exit status.
- Do not infer success from partial output while the run is still streaming.
- Do not edit generated `.next` files.
- Do not run the full Cypress sweep unless explicitly requested.
- Stop any background dev server before finishing.

Return format:
- Selectors renamed
- Files changed
- Specs verified
- Ready-for-sweep note
- Residual risk
```

### 4. Decision points

- Only one feature area is affected:
  Limit edits and verification to that area.
- Multiple specs consume the same selector pattern:
  Update all of them in the same change.
- Semantic selectors are good enough:
  Do not add new hooks unnecessarily.
- Stable hooks are missing:
  Add `cy-` test ids by default.

### 5. Completion criteria

The task is complete only when all of the following are true:

- Selector producers and consumers are aligned
- Lint passes for `packages/app`
- TypeScript passes for both workspaces
- The affected Cypress spec or specs pass
- The Cypress command has fully completed and the final result is confirmed
- The final response states that targeted verification passed and the full sweep remains available

## Quality Bar

- Prefer deterministic selectors over structure-dependent selectors
- Keep naming patterns consistent across related elements
- Rename selectors atomically to avoid partial drift
- Limit verification to the touched behavior unless asked for more

## Example Prompts

- `/maintain-cypress-selectors standardize the initiative tracker selectors so all test ids use the cy- prefix`
- `/maintain-cypress-selectors fix broken selectors for the tools sidebar flow after a component rename`
- `/maintain-cypress-selectors align the area sidebar data-testid values with the current Cypress spec names`