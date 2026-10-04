---
name: obsidian-to-quartz-publish
description: "Prepare a selected Obsidian vault note for this Quartz site, preserve publication metadata and links, verify the generated page, and hand off for manual deployment. Use when publishing or syncing an article from Obsidian into Quartz."
---

# Publish Obsidian to Quartz

Move one requested article from the user's Obsidian vault into this Quartz repository, validate its metadata and rendered output, and stop before any deployment or remote Git operation.

## Non-negotiable boundary

- Do not deploy, push, commit, create a pull request, or run a hosting-provider command.
- Do not copy the whole vault. Work only on the note and assets needed for the user's request.
- Do not overwrite an existing Quartz note when the destination has unrelated edits. Inspect the diff and ask before resolving a conflict.
- Do not silently change `draft`, `unlisted`, encryption, or other visibility metadata. Explain the effect and ask if a visibility change is needed.
- A successful local build is the stopping point. Give the user the files changed, checks performed, and the manual next step.

## Repository conventions

Use the current repository as the Quartz destination. Read its `AGENTS.md` and `quartz.config.yaml` before editing.

This site currently:

- Uses `content/` as the source directory.
- Ignores `.obsidian`, `private`, and `templates` paths during builds.
- Uses `@quartz-community/created-modified-date` with `defaultDateType: published`.
- Uses the `recent-notes` component with a limit of 5 on the index page.
- Expects published notes to have both `date` and `published` in `YYYY-MM-DD` format. Keep `date` for Obsidian/Quartz compatibility and use `published` as the stable ordering field for Recientes.
- Uses `content/templates/obsidian-note.md` as the local note template.

If the config or template has changed, treat the repository's current files as authoritative and adapt the workflow rather than assuming these values.

## Workflow

### 1. Locate the source note

Identify the vault path from the user's prompt, an explicitly selected file, or an open Obsidian window. If the vault is not known, ask for its path; do not recursively scan broad directories without permission.

Search narrowly with `rg --files` and `rg` for the requested title, filename, or distinctive text. Confirm the exact source note by reading its frontmatter and enough body text to distinguish duplicates.

Before copying, check whether the corresponding destination already exists under `content/`. Prefer the repository's existing year/folder convention, usually `content/YYYY/<note-name>.md`, unless the user specifies another destination. Check for slug and title collisions.

### 2. Prepare metadata

Preserve the note's title, tags, aliases, links, and Obsidian wiki-link syntax. Keep frontmatter valid YAML.

For a published note:

```yaml
date: YYYY-MM-DD
published: YYYY-MM-DD
```

Rules:

- If the source has `published`, preserve it and validate it.
- If it has `date` but no `published`, add `published` with the same value.
- If it has neither, stop and ask for the intended publication date. Never use the filesystem or Git timestamp as a substitute.
- If `draft: true`, report that Quartz will filter it out. Change it only when the user's request clearly authorizes publishing that draft.
- If `unlisted: true`, report that it will not appear in Recientes. Change it only when the user explicitly wants it listed.
- Do not change an article's historical publication date merely because it was edited today.

Use `apply_patch` for Markdown edits. Preserve unrelated working-tree changes.

### 3. Bring over required assets

Inspect the note for local image, audio, PDF, or other attachment references. Copy only required assets to the repository location that existing Quartz content uses, preserving relative paths. Do not copy `.obsidian` settings, vault caches, private notes, or unrelated attachments.

For binary assets or a source note too large for a safe patch, use a narrowly scoped file copy after confirming the exact source and destination. Re-check `git status` and the diff afterward.

### 4. Verify content and metadata

Check that:

- The destination file contains the intended title and body.
- `date` and `published` are valid ISO dates and represent the intended publication date.
- The note is not unintentionally draft, unlisted, encrypted, or inside an ignored path.
- Wiki links and attachment paths were preserved.
- No duplicate destination or slug was introduced.

Run `git diff --check` and inspect `git diff --stat` plus the relevant diff. Do not reformat unrelated Markdown.

### 5. Build into a temporary output directory

Avoid relying on a stale `public/` directory. Build to a temporary directory so verification does not overwrite generated site output:

```bash
node quartz/bootstrap-cli.mjs build -o /private/tmp/digitalforest-quartz-check
```

Use another explicit temporary directory if that path is already in use. Confirm the build completes and inspect the generated page for the note. If it should be in Recientes, inspect the generated index and confirm its title/slug appears in the five-item list.

If it is absent, diagnose in this order: build output freshness, `draft`/`unlisted`, ignored path, missing `published`, date validity, slug collision, and the five-item limit.

### 6. Stop and hand off

Report:

- Source note found and destination path.
- Metadata changes, especially `published` and visibility fields.
- Assets copied, if any.
- Local validation/build result.
- Any existing unrelated changes preserved.

Then stop. Tell the user that deployment still requires their explicit manual action. Do not execute `git commit`, `git push`, CI triggers, or hosting deployment commands as part of this skill.
