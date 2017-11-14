if (!script) {
    window.addEventListener("LogEvent", function(e) {
        var evt = e.detail;
        if (evt.includes("fired playing") || evt.includes("fired waiting")) {
            chrome.runtime.sendMessage({ state: "Pause" });
        } else if (evt.includes("fired pause") || evt.includes("fired ended") || evt.includes("fired abort")) {
            chrome.runtime.sendMessage({ state: "Play" });
        }
    }, false);

    function listenLog() {
        var originalLog = console.log;
        console.log = function(e) {
            originalLog(e);
            window.dispatchEvent(new CustomEvent("LogEvent", { detail: e }));
        }
    }

    var script = document.createElement('script');
    script.appendChild(document.createTextNode('(' + listenLog + ')();'));
    (document.body || document.head || document.documentElement).appendChild(script);
}
