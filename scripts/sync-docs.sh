#!/usr/bin/env bash
#
# sync-docs.sh — pull the canonical docs from the baseliner repo into this
# VitePress site so the website always reflects a single source of truth
# (baselinerhq/baseliner -> docs/). Run before `npm run docs:build`.
#
# Source resolution order:
#   1. First CLI argument                    ($1)
#   2. $BASELINER_DOCS_SRC environment var
#   3. A short list of conventional locations (local dev + CI checkout)
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="${ROOT}/docs"

SRC="${1:-${BASELINER_DOCS_SRC:-}}"
if [[ -z "${SRC}" ]]; then
  for candidate in \
    "${ROOT}/baseliner/docs" \
    "${ROOT}/../baseliner/docs" \
    "/home/cam/repos_baseliner/baseliner/docs"; do
    if [[ -d "${candidate}" ]]; then
      SRC="${candidate}"
      break
    fi
  done
fi

if [[ -z "${SRC}" || ! -d "${SRC}" ]]; then
  echo "error: could not locate the baseliner docs source." >&2
  echo "       pass it explicitly:  scripts/sync-docs.sh /path/to/baseliner/docs" >&2
  echo "       or set BASELINER_DOCS_SRC." >&2
  exit 1
fi

echo "sync-docs: sourcing from ${SRC}"

# Files we surface on the site (filename -> destination filename).
copy() {
  local from="${SRC}/$1"
  local to="${DEST}/$2"
  if [[ ! -f "${from}" ]]; then
    echo "error: expected ${from} but it is missing" >&2
    exit 1
  fi
  cp "${from}" "${to}"
  echo "  + $1 -> docs/$2"
}

copy "getting-started.md" "getting-started.md"
copy "install.md"         "install.md"
copy "configuration.md"   "configuration.md"
copy "cli.md"             "cli.md"
copy "policies.md"        "policies.md"
copy "control-repo.md"    "control-repo.md"
copy "ROADMAP.md"         "roadmap.md"

# ---------------------------------------------------------------------------
# Minimal link fixups so VitePress dead-link checking passes. We only ever
# edit THIS repo's synced copies — never the upstream baseliner repo.
#
#   * relative links into the upstream repo (../examples/, etc.) that have no
#     page on this site are rewritten to absolute github.com URLs (external
#     links are not dead-link-checked).
#   * the internal cross-reference ROADMAP.md is repointed to ./roadmap.
# ---------------------------------------------------------------------------
GH_BLOB="https://github.com/baselinerhq/baseliner/blob/main"
GH_TREE="https://github.com/baselinerhq/baseliner/tree/main"

# ROADMAP.md cross-link -> the renamed page on this site.
sed -i 's#](ROADMAP.md)#](./roadmap)#g' "${DEST}/policies.md"

# Upstream example directory (trailing slash -> tree view).
sed -i 's#](../examples/policies/)#]('"${GH_TREE}"'/examples/policies)#g' "${DEST}/policies.md"

# Any remaining ../examples/<file> links -> upstream blob view.
for f in policies.md install.md control-repo.md; do
  sed -i 's#](../examples/#]('"${GH_BLOB}"'/examples/#g' "${DEST}/${f}"
done

# The roadmap is sourced from ROADMAP.md upstream but served as roadmap.md, so
# its auto-generated "edit this page" link would 404 — disable it just here.
printf '%s\n%s\n' '---' 'editLink: false' > "${DEST}/roadmap.md.tmp"
printf '%s\n\n' '---' >> "${DEST}/roadmap.md.tmp"
cat "${DEST}/roadmap.md" >> "${DEST}/roadmap.md.tmp"
mv "${DEST}/roadmap.md.tmp" "${DEST}/roadmap.md"

echo "sync-docs: done"
