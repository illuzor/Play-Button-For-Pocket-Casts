function save_options() {
    chrome.storage.sync.set({
        play_enabled: document.getElementById('play_enabled').checked,
        skip_enabled: document.getElementById('skip_enabled').checked,
        ntp_enabled: document.getElementById('ntp_enabled').checked,
        play: document.getElementById('play').value
    }, function() {
        window.close();
    });
}

function restore_options() {
    chrome.storage.sync.get({
            play_enabled: true,
            skip_enabled: true,
            ntp_enabled: true,
            play: "first"
        },
        function(items) {
            document.getElementById('play_enabled').checked = items.play_enabled;
            document.getElementById('skip_enabled').checked = items.skip_enabled;
            document.getElementById('ntp_enabled').checked = items.ntp_enabled;
            document.getElementById('play').value = items.play;
        });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);