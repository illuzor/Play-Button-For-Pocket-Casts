function performSkip(type) {
    var buttons = document.getElementsByClassName(type);
    if (buttons.length) {
        buttons[0].click();
    }
}
