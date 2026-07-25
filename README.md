# renovate-config

The stateful-y fleet's shared Renovate configuration and self-hosted runner.

## What is here

- **`default.json`** — the shared preset. Every fleet repo's `renovate.json` is a
  two-line stub that extends it: `{ "extends": ["github>stateful-y/renovate-config"] }`.
  Change dependency policy here once and it reaches every repo, with no template
  release and no fan-out.
- **`config.js`** — the self-hosted runner's config (autodiscover the `stateful-y/*`
  repos). This is NOT the shared preset; it only tells the runner which repos to scan.
- **`.github/workflows/renovate.yml`** — the scheduled runner (Mondays 08:00 UTC, plus
  manual dispatch). Needs the `RENOVATE_TOKEN` secret.
- **`.github/workflows/validate.yml`** — validates `default.json` + `config.js` on every
  push/PR, so a broken preset fails here before it can misfire across the fleet.

## One-time setup

1. Create a **GitHub App** and store two repo secrets: `RENOVATE_APP_ID` and
   `RENOVATE_APP_PRIVATE_KEY`. The runner (`renovate.yml`) mints a short-lived
   installation token from these each run. The App needs **Contents, Pull requests,
   Issues and Workflows (all read/write)** plus Metadata (read); `Workflows: write` is
   required or any PR that edits `.github/workflows/*` fails to push. Install the App on
   the `stateful-y` org (all repositories, or the fleet). The default `GITHUB_TOKEN`
   cannot see other repos in the org, so it will not work.
2. Each fleet repo opts in by shipping `renovate.json` with
   `{ "extends": ["github>stateful-y/renovate-config"] }` — the template already
   generates this when `renovate_preset` is set to `stateful-y/renovate-config`.

## What is deliberately NOT enabled yet

- **Automerge** — off. Enable later for low-risk classes only (action digests, the
  uv/nox/git-cliff version bumps, patch deps); keep the `lint-tools` group manual.
- **GitHub-Actions digest pinning** — off. Add `helpers:pinGitHubActionDigests` to
  `default.json` when the fleet wants it; it applies to every extending repo at once.

## Pinned-tool bumps

`default.json` carries a regex `customManager` that bumps any version annotated with a
`# renovate:` comment in a workflow file. The generated projects annotate their pinned
`uv`, `nox` and `git-cliff` versions this way, so those stay current without any
built-in manager understanding `uv tool install` or the `setup-uv` version input.
