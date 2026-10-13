---
name: ship-it
description: Ship the current working-tree changes - verify, branch, commit, push, open a PR to master, and watch CI. Use when the user says "ship it" or asks to ship, send up, or open a PR for the current changes.
---

# Ship it

Take the changes in the working tree from "done locally" to "PR open with CI green". Optional arguments are a hint for the branch name or PR title.

Stop and report instead of pushing on if any step fails. Never push to `master` directly, never force-push, and never skip hooks.

## 1. Look at what is being shipped

```bash
git status --short
git diff
git diff --staged
```

- If there is nothing to ship, say so and stop.
- Decide which files belong to this change. If the tree also holds unrelated edits (work the user made that this conversation didn't touch and that isn't part of the same change), leave them unstaged and list them in the final report. If it is unclear whether a file belongs, ask.
- Do not stage secrets or local-only files (`.env`, `.claude/settings.local.json`).

## 2. Verify

Format the changed JS/TS/JSON/Astro files, then build and test. The e2e tests run against `dist/`, so the build must come first.

```bash
npx prettier --write <changed files>
npm run build
npm test
```

If port 4321 is already in use, Playwright reuses that server, which may be serving an older build - stop it or tell the user before trusting the e2e result.

If the build or any test fails, stop and report the failure with its output. Do not open a PR over a red build.

## 3. Branch

If on `master`, create a branch from it. Use a short kebab-case name describing the change, optionally with a `fix/`, `feature/`, or `posts/` prefix (e.g. `fix/lazy-image-test`, `posts/angular-ai-tutorial`).

```bash
git switch -c <branch>
```

If already on a non-`master` branch, keep using it.

## 4. Commit

Stage only the files chosen in step 1, by path (no `git add -A`).

```bash
git add <files>
git commit -m "<message>"
```

- Clear, descriptive subject in the imperative, matching the existing history (e.g. "Add LinkedIn link and consolidate footer social links").
- Do NOT add a "Co-Authored-By: Claude" trailer.

## 5. Push and open the PR

```bash
git push -u origin <branch>
gh pr create --base master --title "<title>" --body "<body>"
```

If a PR already exists for the branch, push to it and skip `gh pr create`.

PR body has exactly these sections:

```markdown
## Summary

- What changed and why

## Test plan

- [x] `npm run build`
- [x] `npm test` (unit + e2e)
- [ ] Anything that still needs a human check
```

Only tick boxes for checks that actually ran and passed. Do NOT include a "Generated with Claude Code" footer.

## 6. Watch CI

```bash
gh pr checks --watch
```

If a check fails, pull the failing log (`gh run view <run-id> --log-failed`), report the cause, and stop.

## 7. Report

Do not merge. Merging to `master` deploys the site to GitHub Pages without running tests, so that step is the user's call.

Finish with: the PR URL, the CI result, what was verified locally, any files left out of the commit, and the merge command for when the user is ready:

```bash
gh pr merge <number> --squash --delete-branch
```
