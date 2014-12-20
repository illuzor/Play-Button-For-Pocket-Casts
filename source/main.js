var result;

if ($("#audio_player div.play_pause_button:first").is(":visible")) { // if bottom player is visible
	$("#audio_player div.play_pause_button:first").trigger("click"); // simulate click to play/pause button
	if ($("#audio_player div.play_pause_button:first").hasClass("play_button")) { // if current state is "playing"
		result = "pause";
	} else { // if current state is "pause"
		result = "play";
	}
} else { // if bottom player is hidden
	result = "player_hidden";
}

result;