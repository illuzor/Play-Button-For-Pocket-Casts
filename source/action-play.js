var result = "ntp";
var player = document.getElementById("audio_player");

if (player.offsetWidth && player.offsetHeight) {
    if (document.querySelector(".play_pause_button.play_button") != null) {
        document.querySelector(".play_pause_button.play_button").click();
        result = "play";
    } else if (document.querySelector(".play_pause_button.pause_button") != null) {
        document.querySelector(".play_pause_button.pause_button").click();
        result = "pause";
    } 
} else {
	var buttons = document.querySelectorAll('[ng-click="playPause(episode, episode.podcast)"]');
	if(buttons.length){
		var num = 0
		if(random == "yes")
			num = Math.floor(Math.random() * buttons.length);
		buttons[num].click();
		result = "play";
	}
}

result;