function save_options() {
    var p_enabled = document.getElementById('play_enabled').checked;
    var s_enabled = document.getElementById('skip_enabled').checked;
    var n_enabled = document.getElementById('ntp_enabled').checked;

    chrome.storage.sync.set({
        play_enabled: p_enabled,
        skip_enabled: s_enabled,
		ntp_enabled: n_enabled
    }, function() {
        window.close();
    });
}

function restore_options() {
    chrome.storage.sync.get({
            play_enabled: true,
            skip_enabled: true,
			ntp_enabled: true
        },
        function(items) {
            document.getElementById('play_enabled').checked = items.play_enabled;
            document.getElementById('skip_enabled').checked = items.skip_enabled;
            document.getElementById('ntp_enabled').checked = items.ntp_enabled;
        });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);