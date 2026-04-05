---
name: import-level-content
description: "Import raw level content (areas and monsters) into the app. Use when: importing level data, migrating area markdown, converting monster stat blocks, adding raw module dumps, bulk content migration, new level folder, restructuring area or monster files. Covers MDX conversion, JSON stat-block creation, image normalization, and build verification."
argument-hint: "Name of the level folder, e.g. level1"
---

# Import Level Content

## When to Use

- A new `level<N>/` folder has been added at the workspace root containing raw area `.md` files and/or `monsters/*.md` stat-block dumps.
- Existing level content needs to be re-imported after source updates.

## Source Layout Expected

```
level<N>/
├── m<X>.md            # Area descriptions (plain Markdown)
└── monsters/
    ├── <Name>.md      # Flat-text stat blocks
    └── <name>-image.{png,jpg,webp}  # Optional monster art (inconsistent naming)
```

## Procedure

Work through five phases **in order**. Complete each phase before starting the next. Do NOT modify or delete the source `level<N>/` folder — it stays as an archive.

---

### Phase 1 — Inventory the source folder

1. List every file in `level<N>/` and `level<N>/monsters/`.
2. For each `.md` file at root level, confirm it is an **area** (starts with `# M<N>. <Title>`).
3. For each `.md` in `monsters/`, confirm it is a **stat block** (name on line 1, type on line 2, ability scores present).
4. For each image file in `monsters/`, note its extension and the monster it belongs to.
5. Present a summary table to the user:
   - **Areas**: file → code, title, one-line description (inferred from content).
   - **Monsters**: file → name, slug (camelCase), CR, HP, DEX mod, has image (y/n).
6. Ask the user to confirm or correct the table before proceeding.

---

### Phase 2 — Copy and normalize images

Destination: `packages/app/public/monsters/`

For every image identified in Phase 1:

1. Derive the **target filename** as `<kebab-case-monster-name>.<original-ext>`.
   - Strip suffixes like `-image`, `Image`, `_Tapole` typos → use the correct monster name.
   - Lowercase everything.
2. Copy (do not move) the file to the destination with the normalized name.
3. Record the mapping so Phase 4 can set the `image` field in each monster JSON.

Monsters without images get no `image` field — do not create placeholders.

---

### Phase 3 — Create area MDX files

Destination: `packages/app/src/content/areas/m<X>.mdx`

For each area `.md` source file:

1. **Create the file** at the destination path, changing the extension to `.mdx`.
2. **Add the metadata export** as the very first lines:
   ```ts
   export const metadata = {
     code: "M<X>",
     title: "<Title>",
     description: "<one-sentence GM-facing summary>",
   };
   ```
   - `code` is uppercase (e.g. `M4`).
   - `title` comes from the `# M<X>. <Title>` heading, without the code prefix.
   - `description` is a concise sentence suitable for the area sidebar list.
3. **Copy the body** from the source. Apply these transformations:
   - Fix mojibake: `â€"` → `—`, `â€™` → `'`, `â€œ` → `"`, `â€` → `"`.
   - Keep `>` blockquotes for **read-aloud** text.
   - Convert GM-sidebar callouts (blockquotes with bold all-caps headers like `> **FISTANDIA'S AND FREYOT'S HOMUNCULI**`) into `<Callout title="...">` components. Wrap the body text in `<p>` tags inside the Callout.
   - Use inline bold (`**Label.**`) for section headers — do **not** add `##` subheadings.
4. **Verify** the `Callout` component is registered in `packages/app/mdx-components.tsx`. If it is missing, add it per the Callout Component section below.

#### Callout Component (add once if missing)

In `packages/app/mdx-components.tsx`:

- Import `type { ReactNode } from "react"`.
- Add a `Callout` function component before `useMDXComponents()`:
  ```tsx
  function Callout({ title, children }: { title?: string; children?: ReactNode }) {
    return (
      <Box sx={{ bgcolor: "warning.50", borderLeft: 4, borderColor: "warning.main", borderRadius: 1, mb: 2, px: 2, py: 1.5 }}>
        {title ? (
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, textTransform: "uppercase" }}>
            {title}
          </Typography>
        ) : null}
        <Box sx={{ "& > :last-child": { mb: 0 } }}>{children}</Box>
      </Box>
    );
  }
  ```
- Add `Callout` to the object returned by `useMDXComponents()`.

---

### Phase 4 — Create monster JSON files

Destination: `packages/app/src/content/monsters/<camelCaseSlug>/index.json`

For each monster `.md` source file:

1. **Derive the slug** as camelCase from the filename (e.g. `AnimatedBroom.md` → `animatedBroom`).
2. **Create the directory and `index.json`** at the destination path.
3. **Parse the flat-text stat block** into the `MonsterData` JSON shape defined in `packages/app/src/types/monster.ts`. Field-by-field rules:

| Field | Source parsing rule |
|---|---|
| `name` | Line 1 of the source file, trimmed. |
| `size` | First word of line 2 (e.g. "Small", "Tiny"). |
| `type` | Rest of line 2, lowercased (e.g. "construct", "fiend (devil)"). |
| `image` | If an image was copied in Phase 2: `"/monsters/<kebab-name>.<ext>"`. Otherwise omit. |
| `armorClass.value` | Integer from `Armor Class <N>`. |
| `armorClass.type` | Parenthetical after AC value, if present (e.g. `"natural armor"`). For dual AC like `10 (13 with mage armor)`, set value to the base and type to the parenthetical. |
| `hitPoints.value` | Integer from `Hit Points <N>`. |
| `hitPoints.formula` | Parenthetical after HP value (e.g. `"5d6"`, `"3d4 + 3"`). |
| `speed` | Parse into `Record<string, string>`. Key is movement type (`walk`, `fly`, `climb`, `swim`); value includes distance and notes (e.g. `"50 ft. (hover)"`). |
| `abilityScores` | All six. `score` is the number, `modifier` is the signed number as an integer. `+3` → `3`, `–5` → `-5`. |
| `damageVulnerabilities` | Array of lowercase strings. Omit if absent. |
| `damageResistances` | Array of strings. Semicolon-delimited entries (e.g. `Cold; Bludgeoning... from Nonmagical Attacks`) become separate array items. |
| `damageImmunities` | Same as resistances. |
| `conditionImmunities` | Array of lowercase strings. |
| `senses` | Single string, cleaned. |
| `languages` | String. `--` or `—` → `"—"`. Fix missing commas. |
| `challenge.rating` | String (e.g. `"1/4"`, `"0"`, `"1"`). |
| `challenge.xp` | Integer. |
| `proficiencyBonus` | Integer. |
| `traits` | Array of `{ name, description }`. Include: named traits, Skills (if present as `"Skills": "..."` line), Saving Throws, Spellcasting. |
| `actions` | Array of `{ name, description }`. Include Reactions here with the reaction label embedded in the name: `"Shield (Reaction, 3/Day)"`. |

4. **Clean up artifacts**: Remove `[Tooltip Not Found]`, fix mojibake, normalize dashes.
5. **Validate the JSON** is syntactically correct before moving on.

---

### Phase 5 — Build and verify

1. Run `npm.cmd run build` in `packages/app/`. Must complete with **zero errors**.
   - If there are TypeScript errors, fix them and re-run.
   - If there are MDX parse errors, fix the offending `.mdx` file and re-run.
2. Confirm area count: `ls packages/app/src/content/areas/*.mdx | Measure-Object` should equal the previous count plus the newly added files.
3. Confirm monster count: `ls packages/app/src/content/monsters/*/index.json | Measure-Object` should equal the previous count plus the newly added files.
4. Confirm image count: `ls packages/app/public/monsters/* | Measure-Object` should equal the previous count plus the newly copied images.

---

## Data Cleaning Quick-Reference

| Source artifact | Fix |
|---|---|
| `â€"` | `—` (em dash) |
| `â€™` | `'` (right single quote, or use ASCII `'`) |
| `â€œ` / `â€` | `"` / `"` (or use ASCII `"`) |
| `--` in Languages | `"—"` |
| `[Tooltip Not Found]` | Delete entirely |
| Semicolon in resistances | Split into separate array items |
| `+N` modifier | Integer `N` |
| `–N` or `(-N)` modifier | Integer `-N` |

## Checklist

- [ ] Phase 1 inventory confirmed by user
- [ ] Images copied with normalized kebab-case names
- [ ] Callout component exists in `mdx-components.tsx` (if any area needs it)
- [ ] All area `.mdx` files have `export const metadata` with `code`, `title`, `description`
- [ ] All monster `index.json` files have at minimum `name`, `hitPoints.value`, `abilityScores.DEX.modifier`
- [ ] Mojibake and artifacts cleaned from all generated files
- [ ] `npm.cmd run build` passes with zero errors
- [ ] File counts verified
- [ ] Source `level<N>/` folder left untouched
