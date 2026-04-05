---
name: audit-cypress-coverage
description: "Audit Cypress coverage gaps for a specific feature in this repo. Use when: reviewing E2E coverage, finding missing Cypress scenarios, checking if a flow is already tested, or planning what spec should be added or updated in the Game Mastery app. Uses a GPT-5.4 subagent and repo-specific search commands."
argument-hint: "Describe the feature, user flow, and what you suspect is missing or risky."
---

# Audit Cypress Coverage

## When to Use

- You want to know whether a feature already has Cypress coverage
- You need a gap analysis before editing tests
- A feature changed and you want to know which scenarios are still untested
- You want a concrete recommendation for which spec to update next

## Scope

This skill is workspace-specific for the Game Mastery monorepo.

Repo facts to include in the workflow:
- App code lives in `packages/app`
- Cypress code lives in `packages/e2e`
- Existing specs live in `packages/e2e/cypress/e2e`
- Test ids use the `cy-` prefix
- The app shell hydration marker is `cy-app-shell`

## Required Outcome

Produce an actionable coverage audit for the requested feature.

The audit should identify:
1. Relevant feature entry points in the app
2. Existing Cypress specs that already cover part of the flow
3. Missing scenarios, weak assertions, or brittle selectors
4. Whether the next step should be editing an existing spec or creating a new one
5. The smallest viable follow-up test plan

## Procedure

### 1. Clarify only the feature and expected user behavior

If the request is vague, ask only for:
- the user-facing feature or flow
- the expected outcome

If the feature is clear, do not ask more questions.

### 2. Launch a GPT-5.4 subagent

Use `runSubagent` and have it perform read-only repo analysis.

### 3. Give the subagent a complete prompt

Use a prompt in this shape and fill in the feature details:

```text
You are a GPT-5.4 coding subagent working in the Game Mastery repo on Windows.

Task:
Audit Cypress coverage for: <feature or behavior>

Expected behavior:
- <behavior 1>
- <behavior 2>

Constraints:
- Do read-only analysis only.
- Do not edit files.
- Do not run the full Cypress sweep.

Repo structure:
- App: packages/app
- Cypress: packages/e2e
- Specs: packages/e2e/cypress/e2e/*.cy.ts

Search commands to run first:
- rg --files packages/app/src packages/e2e/cypress/e2e
- rg -n "<feature keywords>|data-testid|cy-|tools=|sidebar=|area=" packages/app/src packages/e2e/cypress/e2e
- rg -n "visitAndWait|cy-app-shell|data-hydrated" packages/e2e/cypress/e2e packages/app/src
- rg -n "<visible labels, button text, headings, route/query values>" packages/app/src packages/e2e/cypress/e2e

Audit steps:
1. Find the feature implementation entry points.
2. Find every related Cypress spec and test block.
3. Map covered behavior versus expected behavior.
4. Identify missing paths, weak assertions, and selector problems.
5. Recommend one of: update an existing spec, add a new spec, or do no work.
6. Suggest likely file targets and selector additions if needed.

Return format:
- Relevant app files
- Relevant Cypress specs
- Covered behavior
- Coverage gaps
- Recommended next change
- Potential selector work
```

### 4. Decision points

- Existing spec already covers the feature well:
  Say no new Cypress work is needed.
- Existing spec partially covers the feature:
  Recommend extending that spec.
- No spec covers the feature:
  Recommend a new `*.cy.ts` file.
- Coverage exists but selectors are brittle:
  Recommend selector maintenance alongside the test change.

### 5. Completion criteria

The task is complete only when all of the following are true:

- Relevant app files are identified
- Relevant Cypress specs are identified
- Missing scenarios are explicitly listed
- The recommended next change is concrete
- The final output is ready for a calling agent to implement

## Quality Bar

- Focus on user-visible behavior, not just internal components
- Prefer concrete gaps over generic “needs more coverage” statements
- Recommend the smallest effective next change
- Distinguish missing tests from brittle tests

## Example Prompts

- `/audit-cypress-coverage review the initiative tracker flow and tell me what interaction paths are still untested`
- `/audit-cypress-coverage check whether the area sidebar search and selection flow is fully covered`
- `/audit-cypress-coverage audit coverage for opening and closing tools from the header`