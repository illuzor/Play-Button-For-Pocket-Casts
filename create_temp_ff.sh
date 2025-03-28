#!/bin/bash

SOURCE="source"
SOURCE_FF="source_ff"
TEMP_FF="temp_ff"

rm -rf "$TEMP_FF"
mkdir -p "$TEMP_FF"
cp -r "$SOURCE"/* "$TEMP_FF"
cp "$SOURCE_FF/manifest.json" "$TEMP_FF"
cp "$SOURCE_FF/options.html" "$TEMP_FF"
cp "$SOURCE_FF/options.js" "$TEMP_FF"
