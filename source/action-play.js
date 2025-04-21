(function () {
    const playButtons = document.querySelectorAll('.play_pause_button');

    if (playButtons.length > 0) {
        playButtons[playButtons.length - 1].click();

        const mainPlayButton = playButtons[0];
        postButtonState(mainPlayButton.getAttribute('aria-pressed') === "true");
    } else {
        chrome.storage.sync.get({play: "first"}, function (items) {
            playNewPodcast(items.play);
        });
    }

    let mainPlayButton;
    if (typeof mainPlayButton === 'undefined') {
        let mainPlayButton = playButtons[0];
        listenForPlayState(mainPlayButton);
    }

    function listenForPlayState(mainPlayButton) {
        function handleAttributeChanges(mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'aria-pressed') {
                    const ariaPressedValue = mainPlayButton.getAttribute(mutation.attributeName);
                    postButtonState(ariaPressedValue === "true");
                }
            }
        }

        const observer = new MutationObserver(handleAttributeChanges);
        const config = {attributes: true, attributeOldValue: true};
        observer.observe(mainPlayButton, config);
    }

    function playNewPodcast(play) {
        if (play === "none") {
            return;
        }

        const podcastsPlayButtons = document.querySelectorAll('[aria-label="Play"]');

        if (!podcastsPlayButtons.length) {
            chrome.storage.sync.get({ntp_enabled: true}, function (items) {
                if (items.ntp_enabled) {
                    alert(chrome.i18n.getMessage('ntp'));
                }
            });
            return;
        }

        let positionToPlay;
        switch (play) {
            case "first":
                positionToPlay = 0;
                break;
            case "last":
                positionToPlay = podcastsPlayButtons.length - 1;
                break;
            case "random":
                positionToPlay = Math.floor(Math.random() * podcastsPlayButtons.length);
                break;
        }

        podcastsPlayButtons[positionToPlay].click();
        postButtonState(false);
    }

    function postButtonState(isPlaying) {
        const EXT_ID = "ogdnlmiknnmedpcnjnkjncdjjgfdkiik";
        const EXT_ID_LOCAL = "gimcijegdcaeebbegnkglpgmpgmkeklo";
        const extensionIds = [EXT_ID, EXT_ID_LOCAL];

        const state = isPlaying ? "Pause" : "Play";
        extensionIds.forEach(id => {
            chrome.runtime.sendMessage({state});
        });
    }
})();
