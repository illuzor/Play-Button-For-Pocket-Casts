const URL = "https://play.pocketcasts.com/";

const ACTION_PLAY = "play";
const ACTION_FORWARD = "forward";
const ACTION_BACK = "back";

var pcTab;
var playFromMediaKey;
var action = null;

chrome.action.onClicked.addListener(buttonClick);
chrome.commands.onCommand.addListener(mediaButtonPress);

chrome.runtime.onMessageExternal.addListener(function (message, sender, resp) {
    chrome.action.setIcon({path: "images/" + message.state + ".png"});
    chrome.action.setTitle({title: chrome.i18n.getMessage(message.state)});
});

gotoGetWindows();

function buttonClick() {
    action = ACTION_PLAY;
    playFromMediaKey = false;
    gotoGetWindows();
}

function mediaButtonPress(command) {
    switch (command) {
        case "play-pause":
            playButtonPress();
            break;
        case "jump-forward":
            skipButtonPress(ACTION_FORWARD);
            break;
        case "jump-back":
            skipButtonPress(ACTION_BACK);
            break;
    }
}

function playButtonPress() {
    chrome.storage.sync.get({play_enabled: true},
        function (items) {
            if (items.play_enabled) {
                action = ACTION_PLAY;
                playFromMediaKey = true;
                gotoGetWindows();
            }
        });
}

function skipButtonPress(skipDirection) {
    chrome.storage.sync.get({skip_enabled: true},
        function (items) {
            if (items.skip_enabled) {
                action = skipDirection;
                gotoGetWindows();
            }
        });
}

function gotoGetWindows() {
    pcTab = null;
    chrome.windows.getAll({populate: true}, getWindows);
}

function getWindows(windows) {
    var pcTabs = [];
    for (var i = 0; i < windows.length; i++) {
        for (var j = 0; j < windows[i].tabs.length; j++) {
            if (windows[i].tabs[j].url.includes(URL))
                pcTabs.push(windows[i].tabs[j]);
        }
    }

    if (pcTabs.length) {
        pcTab = pcTabs[0];
        performAction();
    } else {
        if (action == ACTION_PLAY && !playFromMediaKey) {
            openNewTab();
        }
    }
}

function performAction() {
    switch (action) {
        case ACTION_PLAY:
            registerLogListener(pcTab.id)
            chrome.scripting.executeScript({
                target: {tabId: pcTab.id},
                files: ["action-play.js"]
            })
            break;
        case ACTION_FORWARD:
            skip("skip-forward-button");
            break;
        case ACTION_BACK:
            skip("skip-back-button");
            break;
    }
}

function openNewTab() {
    chrome.action.setIcon({path: "images/Play.png"});
    chrome.action.setTitle({title: chrome.i18n.getMessage("Play")});
    chrome.storage.sync.get({page: "default"}, function (items) {
        if (items.page != "none") {
            var finalUrl = URL;
            if (items.page != "default")
                finalUrl += items.page;
            chrome.storage.sync.get({pin_tab: false}, function (items) {
                chrome.tabs.create({url: finalUrl, pinned: items.pin_tab}, function (tab) {
                    registerLogListener(tab.id)
                });
            });
        }
    });
}

function registerLogListener(tabId) {
    chrome.scripting.executeScript({
        target: {tabId: tabId},
        files: ["log-listener-injector.js"]
    })
}

function skip(type) {
    chrome.scripting.executeScript({target: {tabId: pcTab.id}, files: ["action-skip.js"]}, () => {
        chrome.scripting.executeScript({
            target: {tabId: pcTab.id},
            args: [type],
            func: (...args) => performSkip(...args),
        });
    });
}
