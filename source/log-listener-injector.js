function injectLogListener(src) {
    var script = document.createElement('script');
    script.src = src;
    (document.body || document.head || document.documentElement).appendChild(script);
}

injectLogListener(chrome.runtime.getURL('/log-listener.js'));
