(function () {
    const playButtons = document.querySelectorAll('.play_pause_button');

    const startPlayback = function () {
        if (playButtons.length > 0) {
            const mainPlayButton = playButtons[playButtons.length - 1];
            mainPlayButton.click();

            postButtonState(mainPlayButton.getAttribute('aria-pressed') === "true");
        } else {
            chrome.storage.sync.get({play: "first"}, function (items) {
                playNewPodcast(items.play);
            });
        }
    };

    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) {
        showActivationPrompt(startPlayback);
    } else {
        startPlayback();
    }

    let mainPlayButton;
    if (typeof mainPlayButton === 'undefined') {
        let mainPlayButton = playButtons[playButtons.length - 1];
        listenForPlayState(mainPlayButton);
    }

    function showActivationPrompt(startPlayback) {
        const promptId = 'play-button-for-pocket-casts-activation';
        if (document.getElementById(promptId)) {
            return;
        }

        const prompt = document.createElement('div');
        prompt.id = promptId;
        Object.assign(prompt.style, {
            position: 'fixed',
            inset: '0',
            zIndex: '2147483647',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: 'rgba(0, 0, 0, .72)',
            color: '#fff',
            font: '18px sans-serif',
            cursor: 'pointer',
            pointerEvents: 'all'
        });

        const card = document.createElement('div');
        Object.assign(card.style, {
            maxWidth: '460px',
            padding: '28px',
            borderRadius: '12px',
            background: '#292b2e',
            textAlign: 'center',
            lineHeight: '1.45',
            boxShadow: '0 8px 32px rgba(0, 0, 0, .5)'
        });

        const message = document.createElement('div');
        message.textContent = chrome.i18n.getMessage('activation_required');

        const hint = document.createElement('div');
        hint.textContent = chrome.i18n.getMessage('activation_play');
        Object.assign(hint.style, {
            marginTop: '18px',
            fontWeight: '600',
            fontSize: '20px'
        });

        function activate(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            window.removeEventListener('click', activate, true);
            prompt.remove();
            startPlayback();
        }

        window.addEventListener('click', activate, true);

        card.append(message, hint);
        prompt.append(card);
        document.body.append(prompt);
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
