#!/bin/bash
#
# Bump patch version for all packages that have changes since the last published version.
# Checks the GitHub Packages registry to see if the current version already exists;
# if so, increments the patch version.
#
# Usage:
#   ./scripts/bump-versions.sh          # bump only packages whose version is already published
#   ./scripts/bump-versions.sh --all    # bump all packages unconditionally
#
# Requires: node, npm
# Registry auth: reads from .npmrc or NODE_AUTH_TOKEN env var

set -euo pipefail
cd "$(dirname "$0")/.."

REGISTRY="https://npm.pkg.github.com"
LIBS=(core-util ui util quill markdown markdown-parser)
BUMP_ALL="${1:-}"
bumped=0

bump_patch() {
  local version="$1"
  local major minor patch
  IFS='.' read -r major minor patch <<< "$version"
  echo "${major}.${minor}.$((patch + 1))"
}

for lib in "${LIBS[@]}"; do
  pkg="$lib/package.json"
  if [ ! -f "$pkg" ]; then
    echo "SKIP $lib — no package.json"
    continue
  fi

  name=$(node -p "require('./$pkg').name")
  version=$(node -p "require('./$pkg').version")

  if [ "$BUMP_ALL" = "--all" ]; then
    new_version=$(bump_patch "$version")
    echo "BUMP $name: $version → $new_version (--all)"
    node -e "const f='$pkg'; const p=require('./'+f); p.version='$new_version'; require('fs').writeFileSync(f, JSON.stringify(p, null, 2) + '\n')"
    bumped=$((bumped + 1))
    continue
  fi

  # Check if current version exists on registry
  if npm view "$name@$version" version --registry="$REGISTRY" 2>/dev/null | grep -q "$version"; then
    new_version=$(bump_patch "$version")
    echo "BUMP $name: $version → $new_version (already published)"
    node -e "const f='$pkg'; const p=require('./'+f); p.version='$new_version'; require('fs').writeFileSync(f, JSON.stringify(p, null, 2) + '\n')"
    bumped=$((bumped + 1))
  else
    echo "  OK $name@$version — not yet published, no bump needed"
  fi
done

if [ "$bumped" -gt 0 ]; then
  echo ""
  echo "Bumped $bumped package(s). Review changes and commit."
else
  echo ""
  echo "All versions are fresh — nothing to bump."
fi
