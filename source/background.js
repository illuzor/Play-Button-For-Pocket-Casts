﻿var pcTabs; // pocket casts tabs array

chrome.browserAction.onClicked.addListener(buttonClick);

function buttonClick() {
	pcTabs = [];
	chrome.windows.getAll({ populate : true }, getWindows);
}

function getWindows(windows) {
	for (var i = 0; i < windows.length; i++) {
		for (var j = 0; j < windows[i].tabs.length; j++) {
			if (windows[i].tabs[j].title == "Pocket Casts")
				pcTabs.push(windows[i].tabs[j]);
		}
	}
	if (pcTabs.length) {
		chrome.tabs.executeScript(pcTabs[0].id, { file : "jquery.js" }, onJqueryExecuted);
	} else {
		// TODO maybe change alert to something else
		alert("play.pocketcasts.com tab is not opened");
	}
}

function onJqueryExecuted(result) {
	chrome.tabs.executeScript(pcTabs[0].id, {
		file : "main.js"
	}, onMainExecuted);
}

function onMainExecuted(result) {
	if (result != "player_hidden") {
		var iconPath;
		var iconText;
		if (result == "play") { //  play
			iconPath = "images/pause.png";
			iconText = "Pause";
		} else { // pause
			iconPath = "images/play.png";
			iconText = "Play";
		}
		chrome.browserAction.setIcon({ path : iconPath }, null);
		chrome.browserAction.setTitle({ title : iconText });
	} else { // player_hidden
		// TODO maybe change alert to something else
		alert("Player is not enabled.\nStart to listen any podcast.\nPlayer must de displayed on page bottom.");
	}
}
