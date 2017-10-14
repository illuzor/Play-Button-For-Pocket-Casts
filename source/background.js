var pcTab;
var playFromMediaKey;
var action = "init";
const URL = "https://playbeta.pocketcasts.com/";

chrome.browserAction.onClicked.addListener(buttonClick);
chrome.commands.onCommand.addListener(mediaButtonPress);

chrome.runtime.onMessage.addListener(function(message, sender, resp) {
    chrome.browserAction.setIcon({ path: "images/" + message.state + ".png" });
    chrome.browserAction.setTitle({ title: chrome.i18n.getMessage(message.state) });
});

gotoGetWindows();

function mediaButtonPress(command) {
    switch (command) {
        case "play-pause":
            chrome.storage.sync.get({ play_enabled: true },
                function(items) {
                    if (items.play_enabled) {
                        action = "play";
                        playFromMediaKey = true;
                        gotoGetWindows();
                    }
                });
            break;
        case "jump-forward":
            chrome.storage.sync.get({ skip_enabled: true },
                function(items) {
                    if (items.skip_enabled) {
                        action = "forward";
                        gotoGetWindows();
                    }
                });
            break;
        case "jump-back":
            chrome.storage.sync.get({ skip_enabled: true },
                function(items) {
                    if (items.skip_enabled) {
                        action = "back";
                        gotoGetWindows();
                    }
                });
            break;
    }
}

function buttonClick() {
    action = "play";
    playFromMediaKey = false;
    gotoGetWindows();
}

function gotoGetWindows() {
    pcTab = null;
    chrome.windows.getAll({ populate: true }, getWindows);
}

function getWindows(windows) {
    var pcTabs = [];
    for (var i = 0; i < windows.length; i++) {
        for (var j = 0; j < windows[i].tabs.length; j++) {
            if (windows[i].tabs[j].title == "Pocket Casts")
                pcTabs.push(windows[i].tabs[j]);
        }
    }

    if (pcTabs.length)
        pcTab = pcTabs[0];

    if (pcTab != null) {
        switch (action) {
            case "init":
                chrome.tabs.executeScript(pcTab.id, { file: "log-listener.js" });
                break;
            case "play":
                chrome.storage.sync.get({ play: "first" },
                    function(items) {
                        chrome.tabs.executeScript(pcTab.id, { code: 'var play = "' + items.play + '";' },
                            function() {
                                chrome.tabs.executeScript(pcTab.id, { file: "action-play.js" }, playPause);
                                chrome.tabs.executeScript(pcTab.id, { file: "log-listener.js" });
                            });
                    });

                break;
            case "forward":
                skip("skip-forward-button");
                break;
            case "back":
                skip("skip-back-button");
                break;
        }
    } else {
        if (action == "play" && !playFromMediaKey) {
            chrome.browserAction.setIcon({ path: "images/play.png" });
            chrome.browserAction.setTitle({ title: chrome.i18n.getMessage("Play") });

            chrome.storage.sync.get({ page: "default" },
                function(items) {
                    if (items.page != "none") {
                        var finalUrl = URL;
                        if (items.page != "default")
                            finalUrl += "web/" + items.page;
                        chrome.tabs.create({ url: finalUrl });
                    }
                });
        }
    }
}

function skip(type) {
    chrome.tabs.executeScript(pcTab.id, { code: 'var type = "' + type + '";' },
        function() {
            chrome.tabs.executeScript(pcTab.id, { file: "action-skip.js" });
        });
}

function playPause(ntp) {
    if (ntp == 1) {
        chrome.storage.sync.get({ ntp_enabled: true },
            function(items) {
                if (items.ntp_enabled)
                    alert(chrome.i18n.getMessage('ntp'));
            });
    }
}
