#!/usr/bin/env bash
# Sync data files from web/data/ (Python build output) to public/data/ (Next.js source)
set -euo pipefail

SRC="web/data"
DST="public/data"

if [ ! -d "$SRC" ]; then
  echo "Source directory $SRC not found. Nothing to sync."
  exit 0
fi

mkdir -p "$DST"
for f in "$SRC"/*.json; do
  [ -f "$f" ] && cp "$f" "$DST/"
done

echo "Data synced from $SRC/ to $DST/"
echo "Files: $(ls "$DST"/*.json 2>/dev/null | wc -l)"
