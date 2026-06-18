# Arrowhead Intermediaries Site Restore Plan

## Prior Work — FOUND (correction to earlier conclusion)

My earlier "no prior work" conclusion was wrong — it was a path mismatch, not lost work. The previous migration is fully intact in a **sibling directory**:

- **Active workspace:** `/backups/adobe-ccady/arrowhead-intermediaries/repo/` (hyphenated) — currently has stale Databricks/demo artifacts.
- **Previous work (the "perfect" build):** `/backups/adobe-ccady/arrowheadintermediaries/repo/` (no hyphen) — complete Arrowhead migration.

The prior build is verified present and complete:
- **Content:** `content/index.plain.html`, `nav.plain.html`, `footer.plain.html`, plus logo SVGs (`ahi-logo-color.svg`, `ahi-logo-white.svg`).
- **Custom blocks (7):** `hero-divisions`, `columns-stats`, `columns-banner`, `tabs-story`, `cards-divisions`, `cards-news`, plus customized `header`/`footer` — each with JS, CSS, and JSON model files.
- **Import infrastructure:** `page-templates.json` (projectType `xwalk`), 6 parsers, 2 transformers, bundled `import-homepage.js`.
- **Site design:** `styles/brand.css`, `styles.css`, `fonts.css`, `head.html`, plus xwalk model files (`component-models.json`, `component-definition.json`, `component-filters.json`).
- **Validation artifacts:** navigation-validation and footer-validation folders.

This makes the task a **restore/copy from the no-hyphen backup into the active hyphenated workspace** — far faster and safer than re-migrating from scratch.

## Context Absorbed (CONTEXT.md + INSTRUCTIONS.md)

Key constraints to honor during restore and verification:
- **Brand:** navy primary, deep red accent, white/light-gray sections, dark navy footer; sans-serif, heavy headings. Enterprise/authoritative tone.
- **Logos:** color logo in header, white logo in footer — both SVGs, preserve both.
- **Division order everywhere:** Programs → Wholesale → Specialty.
- **Exact tagline:** "Three distinct divisions, one unified platform." (do not reword).
- **Leadership bios:** render as readable on-page sections, not popups.
- **Division sites** (arrowheadprograms.com, bridgespecialtygroup.com, one80.com): always external links.
- **Footer facts:** 701 B Street, STE 2100, San Diego, CA 92101; info@arrowheadintermediaries.com; ©2026; legal links to external Brown & Brown domains kept as-is.
- **Skip:** animated counters (use plain numbers), cookie/legal scripts, scroll/fade animations.
- **Page order:** Homepage → Leadership → one news article → remaining news (bulk).

## Restore Approach (recommended)

Restore the verified backup into the active workspace, then verify against the source and the brand rules. Two open questions before execution (I'll confirm via prompt in Execute mode):
1. Whether the active workspace's stale Databricks/demo files should be **overwritten/removed** or preserved alongside.
2. Whether to restore **homepage only** (what the backup currently contains) or also continue to Leadership + news pages per INSTRUCTIONS.md (these may not yet exist in the backup — to be confirmed by inspecting the backup).

## Checklist

- [ ] Confirm with user: overwrite stale active-workspace files vs. preserve; and homepage-only vs. full page set
- [ ] Inventory the no-hyphen backup completely (content, blocks, styles, models, importer, head/fstab/config) and note exactly which pages exist
- [ ] Diff backup vs. active workspace to identify stale Databricks/demo files to remove (content/index, nav, healthdemo, learn, about-us, forms; Databricks parsers/transformers; page-templates.json)
- [ ] Restore custom blocks: `hero-divisions`, `columns-stats`, `columns-banner`, `tabs-story`, `cards-divisions`, `cards-news`, and customized `header`/`footer`
- [ ] Restore site design: `styles/brand.css`, `styles.css`, `fonts.css`, `head.html`, and xwalk model files (`component-models/definition/filters.json`)
- [ ] Restore importer: `page-templates.json`, parsers, transformers, `import-homepage.js` (+ bundle)
- [ ] Restore content: `index.plain.html`, `nav.plain.html`, `footer.plain.html`, and logo SVGs (`ahi-logo-color.svg`, `ahi-logo-white.svg`)
- [ ] Remove the stale Databricks/demo artifacts from the active workspace (pending user confirmation)
- [ ] Verify homepage renders in preview; check section order, three stats, division order (Programs→Wholesale→Specialty), exact tagline, header color logo, footer white logo + address/email/copyright
- [ ] Confirm division links are external and bios render as on-page sections (not popups)
- [ ] Spot-check brand styling (navy/red, fonts) against CONTEXT.md and the original site
- [ ] If Leadership/news pages exist in backup, restore and verify them; if not, flag as remaining migration work per INSTRUCTIONS.md order

## Recommended First Step

Inventory the no-hyphen backup in full and diff it against the active workspace, so the restore copies exactly the right files and removes the stale Databricks/demo set cleanly.

> Execution (copying/removing files, running preview) requires Execute mode. This plan is read-only until you approve and switch modes.
