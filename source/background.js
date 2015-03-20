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
	
	if (pcTabs.length)
		chrome.tabs.executeScript(pcTabs[0].id, { file : "main.js" }, onMainExecuted);
	else
		chrome.tabs.create({ url : "https://play.pocketcasts.com/" }, onCreateTab);
}

function onMainExecuted(result) {
	if(result == "jqueryIsNotExists")
		chrome.tabs.executeScript(pcTabs[0].id, { file : "jquery.js" }, onJqueryExecuted);
	 else 
		playPause(result);
}

function onJqueryExecuted(result) {
	chrome.tabs.executeScript(pcTabs[0].id, { file : "main.js" }, onMainExecuted);
}

function playPause(result){
	if (result != "playerIsHidden") {
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
		alert("Player is not enabled.\nStart to listen any podcast.\nPlayer must be displayed at the bottom of page.");
	}
}

function onCreateTab(tab){
	pcTabs.push(windows[i].tabs[j]);
	chrome.tabs.executeScript(tab.id, { file : "main.js" }, onMainExecuted);
}
