#!/bin/bash

SOURCE="source"
SOURCE_FF="source_ff"
TEMP_FF="temp_ff"

rm -rf "$TEMP_FF"

create_temp_ff() {
  rm -rf "$TEMP_FF"
  mkdir -p "$TEMP_FF"
  cp -r "$SOURCE"/* "$TEMP_FF"
  cp "$SOURCE_FF/manifest.json" "$TEMP_FF"
}

# TODO replace text in options.js
replace_in_options_html() {
  sed -i '' 's/<button id="shortcuts"><\/button>/<button id="shortcuts" style="display: none;"><\/button>/g' "$TEMP_FF/options.html"
}

replace_in_options_js() {
  sed -i '' 's/enable_play_pause/enable_play_pause_s/g' "$TEMP_FF/options.js"
  sed -i '' 's/enable_play_prev_next/enable_play_prev_next_s/g' "$TEMP_FF/options.js"
}


create_temp_ff
replace_in_options_html
replace_in_options_js
