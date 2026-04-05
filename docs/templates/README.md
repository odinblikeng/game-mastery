# Content Templates

This repository intentionally ignores local game content so each GM can supply their own data without committing it.

## Required Local Structure

Create the following folders and files under `packages/app`:

```text
packages/app/
|-- public/
|   `-- monsters/
|       `-- your-monster-image.png     # optional, only needed if a monster JSON uses "image"
`-- src/
    `-- content/
        |-- areas/
        |   `-- your-area.mdx
        `-- monsters/
            `-- your-monster-slug/
                `-- index.json
```

## What Is Git-Ignored

The current `.gitignore` excludes these content locations:

- `packages/app/src/content/`
- `packages/app/public/monsters/`

The current app reads content from these ignored paths:

- `packages/app/src/content/areas/*.mdx`
- `packages/app/src/content/monsters/<slug>/index.json`
- `packages/app/public/monsters/*` for optional monster images

## Area Contract

An area file must:

- live at `packages/app/src/content/areas/<slug>.mdx`
- export `metadata` with `code`, `title`, and `description`
- provide default MDX content in the file body

The app derives the area `slug` from the filename. For example, `m4.mdx` becomes slug `m4`.

Use [area-template.mdx](./area-template.mdx) as the starter file.

## Monster Contract

A monster file must:

- live at `packages/app/src/content/monsters/<slug>/index.json`
- include `name` as a string
- include `hitPoints.value` as a number
- include `abilityScores.DEX.modifier` as a number

Those three values are the only fields the current app actually requires to populate the initiative tracker.

The app derives the monster `slug` from the folder name. For example, `src/content/monsters/owlbear/index.json` becomes slug `owlbear`.

Use [monster-template.json](./monster-template.json) as the minimum working starter file.

## Optional Monster Fields

The TypeScript type in `packages/app/src/types/monster.ts` describes a richer monster shape than the current runtime loader enforces. You can include additional fields such as:

- `image`
- `size`
- `type`
- `armorClass`
- full `abilityScores`
- `traits`
- `actions`

Those fields are not required for the current UI to function, but they are reasonable additions if the app grows into a fuller stat block view later.
