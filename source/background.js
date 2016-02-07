var pcTabs; // pocket casts tabs array
var clickFromMediaKey;

chrome.browserAction.onClicked.addListener(buttonClick);
chrome.commands.onCommand.addListener(mediaButtonPress);

function mediaButtonPress(command){
	if(command == "play-pause")
		gotoGetWindows(true);
}

function buttonClick() {
	gotoGetWindows(false);
}

function gotoGetWindows(fromMediaKey){
	clickFromMediaKey = fromMediaKey;
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
	
	if (pcTabs.length){
		chrome.tabs.executeScript(pcTabs[0].id, { file : "main.js" }, onMainExecuted);
	} else {
		if(!clickFromMediaKey) chrome.tabs.create({ url : "https://play.pocketcasts.com/" }, null);
	}	
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
		chrome.browserAction.setIcon({ path : iconPath }, null);
		chrome.browserAction.setTitle({ title : iconText });
	} else { // nothing to play
		alert("Nothing to play");
	}
}