---
name: extract-treasures
description: "Extract, catalog, and tag treasures from area description files. Use when: cataloging new treasures, adding treasure items to area metadata, wrapping text with <Treasure> components, or importing raw level files containing items/treasures."
---

# Extract Treasures

## When to Use

- A new or existing area file contains descriptions of treasures or valuable items (e.g. silverware, magic items, potions, gold) under a `**Treasure.**` header or mentioned in the text.
- Treasures need to be cataloged into structured JSON database entries under `packages/app/src/content/treasures/` and tagged inside MDX files.

## Procedure

### Phase 1 — Identify the Treasures

1. Scan the area files (either `.md` source files or `.mdx` content files) looking for headers like `**Treasure.**` or mentions of coins, gems, scrolls, potions, magic items, and valuable art pieces.
2. For each identified treasure, compile the following information:
   - **Name**: The display name of the treasure (e.g. "Driftglobes", "Potions of Healing").
   - **Slug**: A unique `camelCase` identifier (e.g. `driftglobes`, `potionsOfHealing`).
   - **Type**: The category of the treasure (e.g. `"item"`, `"magic item"`, `"consumable"`, `"materials"`, `"gear"`).
   - **Value**: The worth in gold pieces or other notations (e.g. `"20 gp"`, `"Varies"`, `"50 gp of alchemical materials"`).
   - **Description**: A brief description extracted directly from the text.

---

### Phase 2 — Create Treasure JSON Database Files

For each treasure identified in Phase 1:

1. Create a directory named after the camelCase slug under `packages/app/src/content/treasures/`.
   Path format: `packages/app/src/content/treasures/<camelCaseSlug>/index.json`
2. Define the JSON structure using the `TreasureData` schema:
   ```json
   {
     "name": "Display Name",
     "description": "Text describing the item.",
     "value": "e.g., 20 gp",
     "type": "item/magic item/consumable/materials"
   }
   ```

---

### Phase 3 — Tag the Treasures in MDX Files

For each area containing a treasure:

1. Update the area file metadata export to declare the treasure slugs:
   ```typescript
   export const metadata = {
     code: "M<X>",
     title: "<Title>",
     description: "<Description>",
     monsters: [...],
     treasures: ["<camelCaseSlug1>", "<camelCaseSlug2>"],
   };
   ```
2. Replace the raw text references to the items in the MDX body with the `<Treasure>` component.
   - Example raw: `...contains silverware and a service for six...`
   - Example tagged: `...contains <Treasure slug="silverware">silverware and a service for six</Treasure>...`

---

### Phase 4 — Build and Verify

1. Run `npm run lint` and `npm run build` in the monorepo root to make sure there are no TypeScript or MDX compilation errors.
2. Open the application, go to the corresponding area, and verify:
   - The treasure is listed in the header under "Treasures in This Area".
   - The inline `<Treasure>` link is clickable.
   - Clicking either of them opens the `TreasureDetailDialog` showing correct details.
