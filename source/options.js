document.getElementById('play_enabled_label').innerHTML += chrome.i18n.getMessage('enable_play_pause');
document.getElementById('skip_enabled_label').innerHTML += chrome.i18n.getMessage('enable_play_prev_next');
document.getElementById('ntp_enabled_label').innerHTML += chrome.i18n.getMessage('show_ntp');
document.getElementById('page_label').innerHTML = chrome.i18n.getMessage('page_to_open') + ": " + document.getElementById('page_label').innerHTML;
document.getElementById('play_label').innerHTML = chrome.i18n.getMessage('if_player_inactive') + ": " + document.getElementById('play_label').innerHTML;
document.getElementById('save').innerHTML = chrome.i18n.getMessage('save');
document.getElementById('page').options[0].text = chrome.i18n.getMessage('page_default');
document.getElementById('page').options[1].text = chrome.i18n.getMessage('page_podcasts');
document.getElementById('page').options[2].text = chrome.i18n.getMessage('page_discover');
document.getElementById('page').options[3].text = chrome.i18n.getMessage('page_new_releases');
document.getElementById('page').options[4].text = chrome.i18n.getMessage('page_in_progress');
document.getElementById('page').options[5].text = chrome.i18n.getMessage('page_starred');
document.getElementById('page').options[6].text = chrome.i18n.getMessage('page_none');
document.getElementById('play').options[0].text = chrome.i18n.getMessage('play_first');
document.getElementById('play').options[1].text = chrome.i18n.getMessage('play_last');
document.getElementById('play').options[2].text = chrome.i18n.getMessage('play_random');
document.getElementById('play').options[3].text = chrome.i18n.getMessage('play_none');

function save_options() {
    chrome.storage.sync.set({
        play_enabled: document.getElementById('play_enabled').checked,
        skip_enabled: document.getElementById('skip_enabled').checked,
        ntp_enabled: document.getElementById('ntp_enabled').checked,
        play: document.getElementById('play').value,
        page: document.getElementById('page').value
    }, function() {
        window.close();
    });
}

function restore_options() {
    chrome.storage.sync.get({
            play_enabled: true,
            skip_enabled: true,
            ntp_enabled: true,
            play: "first",
            page: "default"
        },
        function(items) {
            document.getElementById('play_enabled').checked = items.play_enabled;
            document.getElementById('skip_enabled').checked = items.skip_enabled;
            document.getElementById('ntp_enabled').checked = items.ntp_enabled;
            document.getElementById('play').value = items.play;
            document.getElementById('page').value = items.page;
        });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
