var result = "jqueryIsNotExists";

if (typeof jQuery != "undefined") {
    if ($("#audio_player div.play_pause_button:first").is(":visible")) { // if bottom player is visible
        $("#audio_player div.play_pause_button:first").trigger("click"); // simulate click to play/pause button
        if ($("#audio_player div.play_pause_button:first").hasClass("play_button")) { // if current state is "playing"
            result = "pause";
        } else { // if current state is "pause"
            result = "play";
        }
    } else if ($("#episodes_page .episode_row:not(.episode_deleted):last").length) {
        $("#episodes_page .episode_row:not(.episode_deleted):last .episode_button").trigger("click");
        result = "play";
    } else { // nothing to play
        result = "nothingToPlay";
    }
}

result;