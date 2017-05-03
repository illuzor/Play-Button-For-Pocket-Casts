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
    if (play != "none") {
        var divs = document.querySelectorAll('.played_status_1, .played_status_2, .played_status_');

        if (divs.length) {
            var num;
			
			switch (play) {
				case "first":
					num = 0
					break;
				case "last":
					num = divs.length - 1
					break;
				case "random":
					num = Math.floor(Math.random() * divs.length);
					break;
			}
			
            divs[num].getElementsByClassName("episode_button")[0].click();
            result = "play";
        }
    }
}

result;