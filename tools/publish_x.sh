#!/usr/bin/env bash
# Publish a self-contained HTML file as an unlisted page at https://heye.earth/x/<slug>/
#   tools/publish_x.sh <slug> <source.html>
# Adds a noindex meta, copies it to static/x/<slug>/index.html, commits and pushes (push = deploy).
# Does nothing when the page is already identical. Called from build scripts so the page tracks its source.
set -euo pipefail
SLUG=$1; SRC=$2
SITE="$(cd "$(dirname "$0")/.." && pwd)"
DST="$SITE/static/x/$SLUG/index.html"
mkdir -p "$(dirname "$DST")"
TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT
if grep -q 'name="robots"' "$SRC"; then cp "$SRC" "$TMP"
else python3 -I - "$SRC" "$TMP" <<'EOF'
import sys
s = open(sys.argv[1], encoding="utf-8").read()
s = s.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta name="robots" content="noindex, nofollow">', 1)
open(sys.argv[2], "w", encoding="utf-8").write(s)
EOF
fi
if [ -f "$DST" ] && cmp -s "$TMP" "$DST"; then echo "heye.earth/x/$SLUG: unchanged"; exit 0; fi
cp "$TMP" "$DST"
cd "$SITE"
git add "static/x/$SLUG/index.html"
git commit -q -m "x/$SLUG: update from $(basename "$SRC")" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011C6ckyxzkCduqi5K2KrPQi"
# Netlify builds and deploys heye.earth on every push to main (GitHub hook)
git push -q origin main
echo "heye.earth/x/$SLUG: pushed, Netlify deploys in ~1 min"
