if (typeof listenLog === 'undefined') {

    const EXT_ID = "ogdnlmiknnmedpcnjnkjncdjjgfdkiik"
    const EXT_ID_LOCAL = "gimcijegdcaeebbegnkglpgmpgmkeklo"

    let extensionIds = [EXT_ID, EXT_ID_LOCAL]

    window.addEventListener("LogEvent", function (e) {
        var event = e.detail;
        if (event.includes("[Audio] playing") || event.includes("[Audio] waiting")) {
            extensionIds.forEach(id =>
                chrome.runtime.sendMessage(id, {state: "Pause"})
            )
        } else if (event.includes("[Audio] pause") || event.includes("[Audio] ended") || event.includes("[Audio] abort")) {
            extensionIds.forEach(id =>
                chrome.runtime.sendMessage(id, {state: "Play"})
            )
        }
    }, false);

    function listenLog() {
        let originalLog = console.log;
        console.log = function (e) {
            originalLog(e);
            window.dispatchEvent(new CustomEvent("LogEvent", {detail: e}));
        }
    }

    listenLog()
}
