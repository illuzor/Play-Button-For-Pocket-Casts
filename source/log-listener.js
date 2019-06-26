if (!script) {
    window.addEventListener("LogEvent", function (e) {
        var event = e.detail;
        if (event.includes("fired playing") || event.includes("fired waiting")) {
            chrome.runtime.sendMessage({ state: "Pause" });
        } else if (event.includes("fired pause") || event.includes("fired ended") || event.includes("fired abort")) {
            chrome.runtime.sendMessage({ state: "Play" });
        } else if (event.includes("Audio event fired error")) {
            chrome.runtime.sendMessage({ state: "Error" });
        }
    }, false);

    function listenLog() {
        var originalLog = console.log;
        console.log = function (e) {
            originalLog(e);
            window.dispatchEvent(new CustomEvent("LogEvent", { detail: e }));
        }
    }

    var script = document.createElement('script');
    script.appendChild(document.createTextNode('(' + listenLog + ')();'));
    (document.body || document.head || document.documentElement).appendChild(script);
}
