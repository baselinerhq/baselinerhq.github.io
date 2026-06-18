---
layout: home
title: baseliner — repository governance, as code
titleTemplate: false

hero:
  name: baseliner
  text: Repository governance, as code.
  tagline: "Renovate, but for repository governance. One static binary scans your whole fleet against a configurable policy, scores every repo 0–1, and reports compliance — ad hoc, in CI, or continuously from a control repo."
  image:
    src: /baseliner-logo.svg
    alt: baseliner logo — a teal octagon with two dots, a checkmark, and a baseline bar
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/baselinerhq/baseliner

features:
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/><path d="M12 18h.01"/><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"/><circle cx="12" cy="12" r="2"/><path d="m13.41 10.59 5.66-5.66"/></svg>'
    title: Scan the whole fleet
    details: Discover repositories from local checkouts and entire GitHub orgs or users in a single pass, then normalize filesystem and git metadata into one model.
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>'
    title: Your baseline, as code
    details: README, LICENSE, CODEOWNERS, CI, branch protection and more — declare the standard every repo should meet as policy-as-code. The policy is the product.
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>'
    title: Severity-weighted scoring
    details: Every repo gets a single 0–1 score from critical/high/medium/low weighted checks, so a fleet of 0.96s reads as "almost there", not a wall of red.
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/></svg>'
    title: Built for CI
    details: Console and JSON output (SARIF on the way), meaningful exit codes, and --fail-under to gate pipelines on a score threshold for gradual rollout.
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M22 8c0-2.3-.8-4.3-2-6"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/><path d="M4 2C2.8 3.7 2 5.7 2 8"/></svg>'
    title: Findings issues & drift
    details: Optionally open a findings issue per repo and auto-close it when the repo becomes compliant. Run continuously from a control repo to catch drift.
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/></svg>'
    title: One dependency-free binary
    details: A single statically-linked Go binary — no runtime, no daemon. Download one file and run it. Install via script, Homebrew, or go install.
---

<div class="bl-section">

## Make your implicit baseline explicit

Every org has an unwritten standard — *"all our repos should have a README, a
LICENSE, CI, branch protection…"*. **baseliner** turns that implicit baseline into
something **explicit** (policy-as-code), **measurable** (scored), and **monitored**
(drift detection). It's security-and-governance plumbing for your fleet, not a
linter for your code.

Neighbors place it quickly: [OSSF Scorecard](https://github.com/ossf/scorecard) is
security-specific with a fixed check set; GitHub rulesets are GitHub-native with
limited check types and no fleet scoring. baseliner's niche is
**configurable-baseline-first + fleet + scored + control-repo**.

## Install

::: code-group

```bash [install script]
curl -fsSL https://raw.githubusercontent.com/baselinerhq/baseliner/main/scripts/install.sh | bash
```

```bash [Homebrew]
brew install baselinerhq/tap/baseliner
```

```bash [go install]
go install github.com/baselinerhq/baseliner/cmd/baseliner@latest
```

:::

The install script drops a statically-linked binary into `~/.local/bin` — no
runtime required. See [Install](/install) for prebuilt archives and version
pinning.

## Scan in two steps

```yaml
# baseliner.yaml — a minimal local policy
scope:
  local:
    paths:
      - .
policy:
  base: default
```

```bash
# score every repo and print a console summary
baseliner scan --config baseliner.yaml --format table

# gate CI on a fleet-wide score threshold
baseliner scan --config baseliner.yaml --fail-under 0.8
```

Ten built-in checks ship in the default policy out of the box. Point
`policy.base` at your own YAML to choose which checks run, at what severity. See
[Policies](/policies) for the schema and scoring model, and the
[Roadmap](/roadmap) for where baseliner is headed — SARIF, a Marketplace Action,
a full declarative policy engine, and auto-remediation fix-PRs.

</div>
