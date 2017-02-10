var pcTab; // Pocket Casts current tab
var playFromMediaKey;
var action;

chrome.browserAction.onClicked.addListener(buttonClick);
chrome.commands.onCommand.addListener(mediaButtonPress);

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
            case "play":
                chrome.tabs.executeScript(pcTab.id, { file: "action-play.js" }, onMainExecuted);
                break;
            case "forward":
                chrome.tabs.executeScript(pcTab.id, { file: "action-forward.js" }, null);
                break;
            case "back":
                chrome.tabs.executeScript(pcTab.id, { file: "action-back.js" }, null);
                break;
        }
    } else {
        if (action == "play" && !playFromMediaKey)
            chrome.tabs.create({ url: "https://play.pocketcasts.com/" }, null);
    }
}

function onMainExecuted(result) {
    if (result == "jqueryIsNotExists")
        chrome.tabs.executeScript(pcTab.id, { file: "jquery.js" }, onJqueryExecuted);
    else
        playPause(result);
}

function onJqueryExecuted(result) {
    chrome.tabs.executeScript(pcTab.id, { file: "action-play.js" }, onMainExecuted);
}

function playPause(result) {
    if (result != "nothingToPlay") {
        var iconPath;
        var iconText;
        if (result == "play") { //  play
            iconPath = "images/pause.png";
            iconText = "Pause";
        } else { // pause
            iconPath = "images/play.png";
            iconText = "Play";
        }
        chrome.browserAction.setIcon({ path: iconPath }, null);
        chrome.browserAction.setTitle({ title: iconText });
    } else { // nothing to play
        alert("Nothing to play");
    }
}