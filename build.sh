#!/bin/bash

SOURCE="source"
SOURCE_FF="source_ff"
TEMP_FOLDER="temp_ff"
RELEASE_FOLDER="release"

# Run all
pack_all() {
  pack_chrome
  pack_ff
}

# Making chrome.zip
pack_chrome() {
  cd "$SOURCE" || exit
  zip -r "../$RELEASE_FOLDER/chrome.zip" *
  cd .. || exit
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
  cp -r "$SOURCE"/* "$TEMP_FOLDER"
  rm -f "$TEMP_FOLDER/manifest.json"
  rm -f "$TEMP_FOLDER/options.html"
  rm -f "$TEMP_FOLDER/options.js"
  cp "$SOURCE_FF/manifest.json" "$TEMP_FOLDER"
  cp "$SOURCE_FF/options.html" "$TEMP_FOLDER"
  cp "$SOURCE_FF/options.js" "$TEMP_FOLDER"
}

# Zipping firefox.zip
zip_ff() {
  cd "$TEMP_FOLDER" || exit
  zip -r "../$RELEASE_FOLDER/firefox.zip" *
  cd .. || exit
  rm -rf "$TEMP_FOLDER"
}

# Removing temp folders
clear_folders() {
  rm -rf "$TEMP_FOLDER"
  rm -rf "$RELEASE_FOLDER"
}

# Run all targets
pack_all
