if (!script) {
    window.addEventListener("LogEvent", function (e) {
        var event = e.detail;
        if (event.includes("[Audio] playing") || event.includes("[Audio] waiting")) {
            chrome.runtime.sendMessage({state: "Pause"});
        } else if (event.includes("[Audio] pause") || event.includes("[Audio] ended") || event.includes("[Audio] abort")) {
            chrome.runtime.sendMessage({state: "Play"});
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
