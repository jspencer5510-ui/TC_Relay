---
paths:
  - "src/components/animation/springs/**"
  - "src/hooks/animation/**"
description: Do-not-modify zone — the vendored motion engine
---

# STOP — this is the vendored motion engine

The paths listed in `.claude/stack.json → paths.protected` are treated as a
vendored library. **Do not edit them without explicit sign-off from the user.**

- Consume them; never modify them. Need different behaviour? Compose a wrapper
  alongside, in the normal component tree.
- `.claude/scripts/verify.sh` FAILs if `git diff` shows changes in a protected
  path.
- Protected here: `src/components/animation/springs/**` and `src/hooks/animation/**`.
  One authorised refactor exists (ADR-0009 in `obsidian/meta/decisions-log.md`).
- The shared ticker (`src/lib/animation/ticker.ts`) is deliberately **not** protected —
  it is the supported extension point for loop-based motion.

If a change genuinely belongs in the engine, say so explicitly, explain why a
wrapper cannot work, and get the user's approval before touching a file.

> If `paths.protected` is empty in this project, this rule has nothing to guard.
> Delete the file — an unmatched rule is dead weight in every context window.

Reference: `obsidian/frontend/animation-system.md` · `obsidian/frontend/components/animation-springs.md`
