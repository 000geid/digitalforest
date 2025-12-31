# AGENTS

This file orients agentic coding assistants working in this repository.
Focus on safe, minimal changes that follow existing patterns.

## Project snapshot

- Package manager: npm (package-lock.json present)
- Language: TypeScript (ESM; "type": "module")
- UI runtime: Preact for TSX components
- Build toolchain: Quartz CLI (bootstrap-cli.mjs)
- Formatting: Prettier (no semicolons, 2-space indent)
- Tests: Node test runner via `tsx --test`
- Type checking: `tsc --noEmit` (strict enabled)

## Build, lint, test commands

Run from repo root.

- Install: `npm install`
- Local preview build (hot reload): `npx quartz build --serve`
- Build docs preview (uses docs content): `npm run docs`
- Production build: `npx quartz build`
- Typecheck + format check: `npm run check`
- Format write: `npm run format`
- All tests: `npm test`
- Profile build: `npm run profile`

### Single-test workflows

- Single test file: `npx tsx --test quartz/util/path.test.ts`
- Single test file via npm: `npm test -- quartz/util/path.test.ts`
- Smallest scope for quick feedback: prefer a single test file first

## Quartz CLI notes

- CLI entrypoint: `./quartz/bootstrap-cli.mjs`
- Common flags (see `docs/build.md`):
  - `-d` or `--directory` for content folder
  - `-o` or `--output` for output folder
  - `--serve` to start local preview server
  - `--port` to set preview port
  - `--concurrency` to control parsing threads

## Code style guidelines

Follow repository conventions and keep formatting stable.

### Formatting

- Prettier is the source of truth (`.prettierrc`).
- 2 spaces, `printWidth: 100`, no semicolons, trailing commas.
- Avoid manual alignment; let Prettier do it.

### Imports

- Use ESM `import`/`export`.
- Use `import type` for type-only imports (see `quartz/util/path.ts`).
- Prefer relative imports for local modules; keep paths short and consistent.
- Keep CSS/SCSS imports next to component files when relevant.

### Naming

- `PascalCase` for components, classes, and type aliases.
- `camelCase` for functions, variables, and object keys.
- `SCREAMING_SNAKE_CASE` for constants only when globally shared.
- File names are mixed: components often `PascalCase.tsx`; utilities are `camelCase.ts`.

### Types and TypeScript

- `tsconfig.json` sets `strict: true` and `noUnusedLocals/Parameters`.
- Avoid `any`; use explicit interfaces/types for public APIs.
- Use `satisfies` when returning typed component constructors (see components).
- Prefer narrow union types over broad `string` when modeling fixed values.
- Keep functions small and typed; avoid implicit `any` in callbacks.

### Preact / TSX conventions

- JSX runtime is `preact` (`jsxImportSource: "preact"`).
- Use `class` instead of `className` in TSX (Preact).
- Components often export a default constructor function that returns a component.
- Static component metadata is attached as properties (e.g., `Component.css`).

### Styling and assets

- Sass is used for styling (`.scss`); keep styles near components when possible.
- Global styles live under `quartz/styles/`; prefer `custom.scss` for tweaks.
- Component styles commonly live in `quartz/components/styles/` and are imported.
- Avoid broad selector changes unless required; keep styling scoped.
- Static site output lands in `public/` by default.

### Markdown and Obsidian compatibility

- Quartz supports Obsidian-flavored Markdown via plugins; keep wiki link syntax intact.
- Be careful when changing link resolution or slug rules; many features depend on them.
- Update docs if you change parsing behavior or content expectations.

### Error handling

- Throw `Error` with clear messages for invalid state.
- For fatal CLI/build errors, use `trace(...)` to format and exit.
- Avoid silent failures; prefer explicit guards and early returns.
- Use Node test `assert` in tests when checking invariants.

### Comments

- Use short, purpose-driven comments where logic is non-obvious.
- Keep comments up to date; remove if they become stale.

## Tests

- Tests live alongside source (e.g., `quartz/util/path.test.ts`).
- Use Node test runner semantics via `tsx --test`.
- Keep tests focused and deterministic; avoid filesystem/network unless required.

## Files and modules to know

- `quartz/`: core build logic, plugins, components, and utilities.
- `quartz.config.ts`: site configuration.
- `quartz.layout.ts`: layout configuration.
- `docs/`: documentation content and guides.
- `content/`: user content for the default garden.

## Cursor/Copilot rules

- No `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` found.

## Contribution hygiene for agents

- Prefer minimal, localized diffs.
- Preserve existing public APIs and configuration defaults.
- Keep performance-sensitive utilities allocation-light.
- Do not reorder or reformat unrelated code.
- Validate with `npm run check` and targeted tests when changes affect core logic.

## Reference patterns

- Type-only imports: `import type { Element } from "hast"`
- Branding types with intersections: `type FilePath = string & { __brand: "filepath" }`
- Component defaults: `export default (() => Component) satisfies QuartzComponentConstructor`
- Error trace: `trace("message", err)`

## When unsure

- Search for a nearby example in `quartz/` and mirror it.
- Ask for clarification before making sweeping changes.
- Prefer defensive checks when handling paths and slugs.
