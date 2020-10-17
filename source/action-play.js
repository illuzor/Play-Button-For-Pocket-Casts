var nothingToPlay = 1;

var playButtons = new Array();
var topButtons = document.querySelectorAll('[class^="EpisodePopupToolbarstyled__PlayButtonContainer"]');
var playButtonsBottom = document.querySelectorAll('[class^="AnimatedPlayButtonstyled"]');

for (i = 0; i < topButtons.length; i++) {
    playButtons.push(topButtons[i])
}

for (i = 0; i < playButtonsBottom.length; i++) {
    playButtons.push(playButtonsBottom[i])
}

if (playButtons.length != 0) {
    playButtons[playButtons.length - 1].click();
    nothingToPlay = 0;
} else {
    if (play != "none") {

        var allPodcasts = document.querySelectorAll('.ReactVirtualized__Table__row.row.clickable');
        var podcastsToPlay = new Array();

        for (i = 0; i < allPodcasts.length; i++) {
            if (!allPodcasts[i].classList.contains("played"))
                podcastsToPlay[podcastsToPlay.length] = allPodcasts[i];
        }

        if (podcastsToPlay.length) {
            var positionToPlay;

            switch (play) {
                case "first":
                    positionToPlay = 0;
                    break;
                case "last":
                    positionToPlay = podcastsToPlay.length - 1;
                    break;
                case "random":
                    positionToPlay = Math.floor(Math.random() * podcastsToPlay.length);
                    break;
            }

            podcastsToPlay[positionToPlay].querySelector('[aria-label="Play"]').click();
            nothingToPlay = 0;
        }
    }
}

nothingToPlay;
