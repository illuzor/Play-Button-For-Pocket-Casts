#!/bin/bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE="$ROOT_DIR/source"
SOURCE_FF="$ROOT_DIR/source_ff"
TEMP_FOLDER="$ROOT_DIR/temp_ff"
RELEASE_FOLDER="$ROOT_DIR/release"

cleanup() {
  rm -rf "$TEMP_FOLDER"
}

trap cleanup EXIT

# Run all
pack_all() {
  pack_chrome
  pack_ff
}

# Making chrome.zip
pack_chrome() {
  rm -f "$RELEASE_FOLDER/chrome.zip"
  (
    cd "$SOURCE"
    zip -qr "$RELEASE_FOLDER/chrome.zip" .
  )
}

# Making firefox.zip
pack_ff() {
  make_temp_ff
  zip_ff
}

# Making temp firefox folder
make_temp_ff() {
  rm -rf "$TEMP_FOLDER"
  mkdir -p "$TEMP_FOLDER"
  cp -R "$SOURCE"/. "$TEMP_FOLDER"
  cp "$SOURCE_FF/manifest.json" "$TEMP_FOLDER"
}

# Zipping firefox.zip
zip_ff() {
  rm -f "$RELEASE_FOLDER/firefox.zip"
  (
    cd "$TEMP_FOLDER"
    zip -qr "$RELEASE_FOLDER/firefox.zip" .
  )
}

# Run all targets
mkdir -p "$RELEASE_FOLDER"
pack_all
