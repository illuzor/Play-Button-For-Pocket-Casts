document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        playEnabledLabel: document.getElementById('play_enabled_label'),
        skipEnabledLabel: document.getElementById('skip_enabled_label'),
        ntpEnabledLabel: document.getElementById('ntp_enabled_label'),
        pageLabel: document.getElementById('page_label'),
        pinTabLabel: document.getElementById('pin_tab_label'),
        playLabel: document.getElementById('play_label'),
        saveButton: document.getElementById('save'),
        shortcutsButton: document.getElementById('shortcuts'),
        pageSelect: document.getElementById('page'),
        playSelect: document.getElementById('play')
    };

    elements.playEnabledLabel.innerHTML += chrome.i18n.getMessage('enable_play_pause');
    elements.skipEnabledLabel.innerHTML += chrome.i18n.getMessage('enable_play_prev_next');
    elements.ntpEnabledLabel.innerHTML += chrome.i18n.getMessage('show_ntp');
    elements.pageLabel.innerHTML = `${chrome.i18n.getMessage('page_to_open')}: ${elements.pageLabel.innerHTML}`;
    elements.pinTabLabel.innerHTML += chrome.i18n.getMessage('pin_tab');
    elements.playLabel.innerHTML = `${chrome.i18n.getMessage('if_player_inactive')}: ${elements.playLabel.innerHTML}`;
    elements.saveButton.innerHTML = chrome.i18n.getMessage('save');
    elements.shortcutsButton.innerHTML = chrome.i18n.getMessage('shortcuts');

    const pageOptions = [
        'page_default', 'page_podcasts', 'page_discover', 'page_new_releases',
        'page_in_progress', 'page_starred', 'page_files', 'page_none'
    ];

    pageOptions.forEach((option, index) => {
        elements.pageSelect.options[index].text = chrome.i18n.getMessage(option);
    });

    const playOptions = ['play_first', 'play_last', 'play_random', 'play_none'];

    playOptions.forEach((option, index) => {
        elements.playSelect.options[index].text = chrome.i18n.getMessage(option);
    });

    const saveOptions = () => {
        chrome.storage.sync.set({
            play_enabled: document.getElementById('play_enabled').checked,
            skip_enabled: document.getElementById('skip_enabled').checked,
            ntp_enabled: document.getElementById('ntp_enabled').checked,
            pin_tab: document.getElementById('pin_tab').checked,
            play: document.getElementById('play').value,
            page: document.getElementById('page').value
        }, () => {
            window.close();
        });
    };

    const restoreOptions = () => {
        chrome.storage.sync.get({
            play_enabled: true,
            skip_enabled: true,
            ntp_enabled: true,
            pin_tab: false,
            play: "first",
            page: "default"
        }, (items) => {
            document.getElementById('play_enabled').checked = items.play_enabled;
            document.getElementById('skip_enabled').checked = items.skip_enabled;
            document.getElementById('ntp_enabled').checked = items.ntp_enabled;
            document.getElementById('pin_tab').checked = items.pin_tab;
            document.getElementById('play').value = items.play;
            document.getElementById('page').value = items.page;
        });
    };

    const openShortcuts = () => {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
            chrome.tabs.update(tabs[0].id, { url: "chrome://extensions/configureCommands" });
        });
    };

    restoreOptions();
    elements.saveButton.addEventListener('click', saveOptions);
    elements.shortcutsButton.addEventListener('click', openShortcuts);
});
