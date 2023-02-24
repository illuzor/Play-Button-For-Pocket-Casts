if (typeof listenLog === 'undefined') {

    const EXT_ID = "ogdnlmiknnmedpcnjnkjncdjjgfdkiik"
    const EXT_ID_LOCAL = "gimcijegdcaeebbegnkglpgmpgmkeklo"

    window.addEventListener("LogEvent", function (e) {
        var event = e.detail;
        if (event.includes("[Audio] playing") || event.includes("[Audio] waiting")) {
            chrome.runtime.sendMessage(EXT_ID, {state: "Pause"});
            chrome.runtime.sendMessage(EXT_ID_LOCAL, {state: "Pause"});
        } else if (event.includes("[Audio] pause") || event.includes("[Audio] ended") || event.includes("[Audio] abort")) {
            chrome.runtime.sendMessage(EXT_ID, {state: "Play"});
            chrome.runtime.sendMessage(EXT_ID_LOCAL, {state: "Play"});
        }
    }, false);

    function listenLog() {
        var originalLog = console.log;
        console.log = function (e) {
            originalLog(e);
            window.dispatchEvent(new CustomEvent("LogEvent", {detail: e}));
        }
    }

    listenLog()
}