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

if (playButtons.length > 0) {
    playButtons[playButtons.length - 1].click();
    nothingToPlay = 0;

    let mainPlayButton = playButtonsBottom[0]
    postButtonState(mainPlayButton.getAttribute('aria-pressed') == "true")
} else {
    chrome.storage.sync.get({play: "first"}, function (items) {
        playNewPodcast(items.play)
    });
}

if (typeof mainPlayButton === 'undefined') {
    let mainPlayButton = playButtonsBottom[0]
    listenForPlayState(mainPlayButton)
}

function listenForPlayState(mainPlayButton) {

    function handleAttributeChanges(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'aria-pressed') {
                let ariaPressedValue = mainPlayButton.getAttribute(mutation.attributeName)
                postButtonState(ariaPressedValue == "true")
            }
        }
    }

    let observer = new MutationObserver(handleAttributeChanges);

    let config = {attributes: true, attributeOldValue: true};
    observer.observe(mainPlayButton, config);
}

function playNewPodcast(play) {
    if (play == "none") {
        return
    }

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
        postButtonState(false) // TODO check
    }
}

function postButtonState(isPlaying) {
    const EXT_ID = "ogdnlmiknnmedpcnjnkjncdjjgfdkiik"
    const EXT_ID_LOCAL = "gimcijegdcaeebbegnkglpgmpgmkeklo"
    let extensionIds = [EXT_ID, EXT_ID_LOCAL]

    if (isPlaying) {
        extensionIds.forEach(id => {
                chrome.runtime.sendMessage({state: "Pause"})
            }
        )
    } else {
        extensionIds.forEach(id => {
                chrome.runtime.sendMessage({state: "Play"})
            }
        )
    }
}

if (nothingToPlay == 1) {
    chrome.storage.sync.get({ntp_enabled: true},
        function (items) {
            if (items.ntp_enabled) {
                alert(chrome.i18n.getMessage('ntp'));
            }
        });
}
