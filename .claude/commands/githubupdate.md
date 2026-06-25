---
description: Push to GitHub, deploy GitHub Pages, refresh README + repo About, and security-scan for secrets
argument-hint: [optional commit message]
allowed-tools: Bash(git*), Bash(gh*), Read, Write, Edit, Glob, Grep
---

# /githubupdate

Publish the current state of this project to GitHub safely. Run the steps **in order** and STOP if a blocking problem appears (e.g. the security scan finds a real secret). Report a short summary at the end.

Optional commit message from the user: `$ARGUMENTS` (if empty, generate a concise conventional-commit message from the staged/changed files).

This repo is a static vanilla HTML/CSS/JS site (Sterling & Vale Advisory). Deployment is via the existing GitHub Actions workflow at `.github/workflows/deploy.yml` (publishes the repo root to GitHub Pages on push to `main`).

## 0. Preflight

- Confirm `git` works (`git rev-parse --is-inside-work-tree`). On this Windows machine `git`/`gh` may not be on the PATH — if a bare call fails, try `& "$env:ProgramFiles\Git\cmd\git.exe"` / common install locations before giving up.
- Check `gh auth status`. If `gh` is unavailable or not authenticated, do the git steps anyway and tell the user which steps (repo About, homepage, enabling Pages) need to be done manually or after `gh auth login`.
- Run `git remote -v`. If there is no `origin` remote, ask the user for the repo URL (or offer to create one with `gh repo create`) before pushing — do not invent one.
- Note the current branch with `git branch --show-current` (expected `main`).

## 1. SECURITY SCAN (do this BEFORE pushing — it is a gate)

Scan everything that would be published. Treat the repo root as the deploy surface (the Pages workflow uploads `path: '.'`).

- Look for committed secrets / sensitive data:
  - API keys, tokens, passwords, private keys (`BEGIN ... PRIVATE KEY`), AWS keys (`AKIA...`), Google/Stripe/Slack tokens, `.env` files, credentials, connection strings.
  - Use Grep for patterns like: `api[_-]?key`, `secret`, `password`, `token`, `PRIVATE KEY`, `AKIA`, `Bearer `, `client_secret`, and high-entropy strings in JS/HTML/JSON/config.
  - Check for accidentally tracked files: `.env`, `*.pem`, `*.key`, `id_rsa`, credential dumps, local config, `.claude/settings.local.json` (this holds local permissions and generally should NOT be published — confirm it's gitignored).
- Run `git status` and `git ls-files` to see what is actually tracked / about to be committed. Personal data like a real email already in the source (e.g. the FormSubmit `FORM_ENDPOINT` in `script.js`) is intentional for this project — flag it for awareness but it is not a blocker.
- Ensure a `.gitignore` exists and excludes `.claude/settings.local.json`, `.env*`, and OS cruft (`.DS_Store`, `Thumbs.db`). Create/update it if missing.

**If a real secret is found: STOP.** Do not commit or push. Report exactly what and where, and recommend removing it (and rotating the credential / scrubbing history if already committed). Only continue once the user resolves it or confirms it's a false positive.

## 2. README

- If `README.md` is missing, create one. If it exists, update it so it's accurate.
- Include: project name + one-line description, what it is (static marketing site, vanilla HTML/CSS/JS, no build step), how to run locally (`python -m http.server` then http://localhost:8000), project structure (`index.html`, `styles.css`, `script.js`), deployment note (auto-deploys to GitHub Pages via Actions on push to `main`), and a **Live site** link (fill in once the Pages URL is known in step 5; use a placeholder you replace later).

## 3. Commit & push

- Stage changes: `git add -A`.
- Commit using the user's message if provided, else a generated conventional-commit summary (e.g. `docs: add README and gitignore`, `chore: publish site updates`).
- Push to the tracking branch: `git push` (set upstream with `git push -u origin main` if no upstream is configured). If the remote has diverging commits, pull/rebase as appropriate and explain before force-anything — never force-push without asking.

## 4. Deploy via GitHub Actions / Pages

- The push to `main` triggers `.github/workflows/deploy.yml`. Ensure GitHub Pages is set to **GitHub Actions** as the source:
  - With `gh`: `gh api repos/{owner}/{repo}/pages` to check; if not configured, enable it: `gh api -X POST repos/{owner}/{repo}/pages -f build_type=workflow` (or instruct the user to set Settings → Pages → Source = GitHub Actions if the API call isn't permitted).
- Watch the run: `gh run list --workflow=deploy.yml --limit 1` then `gh run watch <run-id>` (or `gh run view <run-id>`). Report success/failure. If it fails, surface the failing step's logs.
- Capture the deployed URL (typically `https://<owner>.github.io/<repo>/`, or a custom domain if configured).

## 5. Repo About + live site link

- Set the repo description and homepage URL to the live Pages site:
  - `gh repo edit --description "<short description>" --homepage "<pages-url>"`
  - Optionally add topics: `gh repo edit --add-topic wealth-management,landing-page,static-site,github-pages`
- Go back and replace the **Live site** placeholder in `README.md` with the real URL, then commit & push that small fix.

## 6. Summary

Report: what was scanned (and any flags), commit hash + message, push result, Actions run status, the live URL, and the repo About/homepage updates. List anything the user must still do manually (e.g. `gh auth login`, first-run GitHub Pages enablement, FormSubmit email confirmation).
