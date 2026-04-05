---
name: post-change-cypress-sweep
description: "Run and summarize the full Cypress suite after a change in this repo. Use when: running the full E2E sweep, validating a change after targeted test updates, checking repo-wide Cypress health, or summarizing failures by feature area in the Game Mastery app. Uses a GPT-5.4 subagent, full-suite execution, and explicit waiting for terminal completion."
argument-hint: "Describe the change that was made and any feature areas that are most likely to be affected."
---

# Post-Change Cypress Sweep

## When to Use

- Targeted Cypress work is done and you want the full suite status
- A feature change may have affected multiple E2E flows
- You want a repo-wide Cypress health check after app changes
- You need a concise summary of failures grouped by feature area

## Scope

This skill is workspace-specific for the Game Mastery monorepo.

Repo facts to include in the workflow:
- App code lives in `packages/app`
- Cypress code lives in `packages/e2e`
- Full suite command is `npm.cmd run test:e2e` from the repo root
- Test ids use the `cy-` prefix
- Hydration-aware tests wait for `cy-app-shell`

## Required Outcome

Run the full Cypress suite, wait for it to actually finish, and produce a useful summary.

The skill should:
1. Launch a GPT-5.4 subagent with the repo-specific execution workflow
2. Start the app if needed and confirm it is ready
3. Run the full Cypress suite from the repo root
4. Wait for command completion before drawing conclusions
5. Summarize passing and failing specs by feature area
6. Suggest the most likely next debugging targets without editing code

## Procedure

### 1. Clarify only the change context if needed

If the request is vague, ask only for:
- what changed
- which feature areas are suspected to be affected

If the change context is already clear, do not ask more questions.

### 2. Launch a GPT-5.4 subagent

Use `runSubagent` and tell it to perform execution and read-only triage.

### 3. Give the subagent a complete prompt

Use a prompt in this shape and fill in the change details:

```text
You are a GPT-5.4 coding subagent working in the Game Mastery repo on Windows.

Task:
Run a full post-change Cypress sweep for: <change summary>

Context:
- <changed feature area 1>
- <changed feature area 2>

Constraints:
- Do not edit code.
- Run the full Cypress suite and summarize the result.
- If failures occur, inspect related source and spec files read-only and suggest likely next steps.

Repo structure:
- App: packages/app
- Cypress: packages/e2e

Search commands to run before summarizing failures:
- rg --files packages/app/src packages/e2e/cypress/e2e
- rg -n "data-testid|cy-|visitAndWait|cy-app-shell|data-hydrated|tools=|sidebar=|area=" packages/app/src packages/e2e/cypress/e2e

Execution steps:
1. Start the app if it is not already running: npm.cmd run dev --workspace app
2. If the app runs in a background terminal, confirm readiness from terminal output before starting Cypress.
3. From the repo root, run the full suite: npm.cmd run test:e2e
4. Wait for the Cypress command to fully complete. Do not infer final status from partial output.
5. Capture the final summary and exit code.
6. If failures occur, inspect the failing spec files and nearby app files with `rg` and file reads.
7. Group results by feature area and suggest the most likely next debugging targets.
8. Stop any background dev server before finishing.

Terminal waiting rules:
- Prefer a blocking terminal for the full Cypress run when practical.
- If a background terminal is used, explicitly wait for completion with the terminal-waiting tool.
- Do not report pass or fail until the command has exited and the final summary is available.
- Use a generous timeout or an explicit wait without timeout guessing.

Return format:
- Full suite status
- Passing specs
- Failing specs
- Failures grouped by feature area
- Likely next files to inspect
- Residual risk
```

### 4. Decision points

- The app server is not running:
  Start it and confirm readiness before Cypress.
- The full suite passes:
  Report that repo-wide E2E validation is clean.
- One or more specs fail:
  Summarize failures by feature area and inspect only the relevant source files read-only.
- The run output is incomplete:
  Keep waiting. Do not report a result from partial output.

### 5. Completion criteria

The task is complete only when all of the following are true:

- The app server was confirmed ready before Cypress ran
- The full Cypress command fully completed
- Final status is based on command completion and final summary
- Passing and failing specs are listed clearly
- Failures are grouped by feature area when present
- Any background dev server started by the task is stopped before finishing

## Quality Bar

- Never confuse in-progress output with final results
- Prefer concise failure triage over raw log dumping
- Group failures by user-visible feature area when possible
- Keep the skill focused on validation and triage, not implementation

## Example Prompts

- `/post-change-cypress-sweep run the full suite after the initiative tracker changes and summarize any failures`
- `/post-change-cypress-sweep validate the repo after updating area sidebar selectors`
- `/post-change-cypress-sweep run a repo-wide Cypress sweep after tool sidebar changes`