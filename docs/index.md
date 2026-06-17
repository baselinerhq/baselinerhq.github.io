---
layout: home
title: baseliner — repository governance, as code
titleTemplate: false

hero:
  name: baseliner
  text: Repository governance, as code.
  tagline: "Renovate, but for repository governance. One static binary scans your whole fleet against a configurable policy, scores every repo 0–1, and reports compliance — ad hoc, in CI, or continuously from a control repo."
  image:
    src: /baseliner-logo.png
    alt: baseliner logo — a teal octagon with two dots, a checkmark, and a baseline bar
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/baselinerhq/baseliner

features:
  - icon: 🛰️
    title: Scan the whole fleet
    details: Discover repositories from local checkouts and entire GitHub orgs or users in a single pass, then normalize filesystem and git metadata into one model.
  - icon: 📐
    title: Your baseline, as code
    details: README, LICENSE, CODEOWNERS, CI, branch protection and more — declare the standard every repo should meet as policy-as-code. The policy is the product.
  - icon: 🎯
    title: Severity-weighted scoring
    details: Every repo gets a single 0–1 score from critical/high/medium/low weighted checks, so a fleet of 0.96s reads as "almost there", not a wall of red.
  - icon: ⚙️
    title: Built for CI
    details: Console and JSON output (SARIF on the way), meaningful exit codes, and --fail-under to gate pipelines on a score threshold for gradual rollout.
  - icon: 🔔
    title: Findings issues & drift
    details: Optionally open a findings issue per repo and auto-close it when the repo becomes compliant. Run continuously from a control repo to catch drift.
  - icon: 📦
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
