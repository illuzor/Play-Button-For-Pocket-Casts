var result = "nothingToPlay";
var player = document.getElementById("audio_player")

if (player.offsetWidth && player.offsetHeight) {
    if (document.querySelector(".play_pause_button.play_button") != null) {
        document.querySelector(".play_pause_button.play_button").click()
        result = "play";
    } else if (document.querySelector(".play_pause_button.pause_button") != null) {
        document.querySelector(".play_pause_button.pause_button").click()
        result = "pause";
    } 
}

result;