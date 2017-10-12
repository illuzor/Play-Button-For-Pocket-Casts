if (!script) {
    window.addEventListener("LogEvent", function(e) {
        if (e.detail.includes("fired playing") || e.detail.includes("fired waiting")) {
            chrome.runtime.sendMessage({ state: "Pause" });
        } else if (e.detail.includes("fired pause")) {
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