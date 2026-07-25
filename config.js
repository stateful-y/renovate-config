// Self-hosted Renovate runner config (NOT the shared preset — that is default.json).
// The scheduled workflow in .github/workflows/renovate.yml passes this file to the
// Renovate action, which then scans the fleet and opens update PRs in each repo.
module.exports = {
  platform: "github",
  // Discover every stateful-y repo the token can see, instead of a hand-maintained list.
  autodiscover: true,
  autodiscoverFilter: ["stateful-y/*"],
  // Fleet repos carry their own renovate.json (a stub that extends this repo's
  // default.json). Renovate never opens an onboarding PR; a repo with no config is
  // simply skipped rather than onboarded.
  onboarding: false,
  requireConfig: "required",
};
