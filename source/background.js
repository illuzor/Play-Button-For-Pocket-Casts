const URL = "https://pocketcasts.com/";

const ACTION_PLAY = "play";
const ACTION_FORWARD = "forward";
const ACTION_BACK = "back";

let pcTab;
let playFromMediaKey;
let action = null;
let isFirstPlay = true;

chrome.action.onClicked.addListener(buttonClick);
chrome.commands.onCommand.addListener(mediaButtonPress);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    chrome.action.setIcon({ path: "images/" + request.state + ".png" });
    chrome.action.setTitle({ title: chrome.i18n.getMessage(request.state) });
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
    chrome.storage.sync.get({ play_enabled: true }, (items) => {
        if (items.play_enabled) {
            action = ACTION_PLAY;
            playFromMediaKey = true;
            gotoGetWindows();
        }
    });
}

function skipButtonPress(skipDirection) {
    chrome.storage.sync.get({ skip_enabled: true }, (items) => {
        if (items.skip_enabled) {
            action = skipDirection;
            gotoGetWindows();
        }
    });
}

function gotoGetWindows() {
    pcTab = null;
    chrome.windows.getAll({ populate: true }, getWindows);
}

function getWindows(windows) {
    const pcTabs = [];
    for (const window of windows) {
        for (const tab of window.tabs) {
            if (tab.url.includes(URL)) {
                pcTabs.push(tab);
            }
        }
    }

    if (pcTabs.length) {
        pcTab = pcTabs[0];
        performAction();
    } else {
        if (action === ACTION_PLAY && !playFromMediaKey) {
            openNewTab();
        }
    }
}

function performAction() {
    switch (action) {
        case ACTION_PLAY:
            if (isFirstPlay) {
                isFirstPlay = false;
                setTimeout(performPlay, 100);
            } else {
                performPlay();
            }
            break;
        case ACTION_FORWARD:
            skip("skip-forward-button");
            break;
        case ACTION_BACK:
            skip("skip-back-button");
            break;
    }
}

function performPlay() {
    chrome.scripting.executeScript({
        target: { tabId: pcTab.id },
        files: ["action-play.js"]
    });
}

function openNewTab() {
    chrome.action.setIcon({ path: "images/Play.png" });
    chrome.action.setTitle({ title: chrome.i18n.getMessage("Play") });
    chrome.storage.sync.get({ page: "default" }, (items) => {
        if (items.page !== "none") {
            let finalUrl = URL;
            if (items.page !== "default") {
                finalUrl += items.page;
            }
            chrome.storage.sync.get({ pin_tab: false }, (items) => {
                chrome.tabs.create({ url: finalUrl, pinned: items.pin_tab });
            });
        }
    });
}

function skip(type) {
    chrome.scripting.executeScript({ target: { tabId: pcTab.id }, files: ["action-skip.js"] }, () => {
        chrome.scripting.executeScript({
            target: { tabId: pcTab.id },
            args: [type],
            func: (...args) => performSkip(...args),
        });
    });
}
