#!/usr/bin/env bash
#
# The fleet brand mark, generated the same way for every service.
#
#   ./scripts/brand.sh <letter> <frontend/public>
#
# A black rounded square with the service's letter in white, drawn in the same bold face
# for everyone. It writes the set browsers actually look for — the SVG for the tab, the
# PNGs for pinned tabs and iOS, the ICO for the legacy slot — so no service is left with
# a hand-drawn mark of its own (metroCheck had an arc, metroGen a white square, and the
# accounts console had no icon at all).
#
# The letter is text, not a path: every client resolves it in its own copy of the face
# below, which is why the stack starts with the family the fleet ships and falls back the
# same way everywhere.
set -euo pipefail

LETTER="${1:?usage: brand.sh <letter> <public-dir>}"
OUT="${2:?usage: brand.sh <letter> <public-dir>}"
mkdir -p "$OUT"

FACE="DejaVu-Sans-Bold"
VERSION="brand1"

# --- vector: what the tab uses when the browser understands SVG ---------------------
cat > "$OUT/favicon.svg" <<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#000000"/>
  <text
    x="32"
    y="43"
    fill="#ffffff"
    font-family="IBM Plex Sans, DejaVu Sans, Arial, sans-serif"
    font-size="40"
    font-weight="700"
    text-anchor="middle"
  >${LETTER}</text>
</svg>
SVG

# --- raster: the same mark, drawn at 512 and scaled down ----------------------------
magick -size 512x512 xc:none \
  -fill black -draw "roundrectangle 0,0,511,511,128,128" \
  -font "$FACE" -pointsize 330 -fill white -gravity center -annotate +0+18 "$LETTER" \
  "$OUT/.brand-512.png"

magick "$OUT/.brand-512.png" -resize 180x180 "$OUT/apple-touch-icon.png"
magick "$OUT/.brand-512.png" -resize 32x32 "$OUT/favicon-32x32.png"
magick "$OUT/.brand-512.png" -resize 16x16 "$OUT/favicon-16x16.png"
magick "$OUT/favicon-16x16.png" "$OUT/favicon-32x32.png" \
  -define icon:auto-resize=16,32 "$OUT/favicon.ico"
rm -f "$OUT/.brand-512.png"

cat <<HTML
Link this into the app's index.html <head> (the version query busts the old icon cache):

  <link rel="shortcut icon" href="/favicon.ico?v=${VERSION}" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=${VERSION}" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=${VERSION}" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=${VERSION}" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=${VERSION}" />
HTML

ls -la "$OUT" | grep -E "favicon|apple"
