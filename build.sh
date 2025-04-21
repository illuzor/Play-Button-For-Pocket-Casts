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
  ./create_temp_ff.sh
  zip_ff
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
