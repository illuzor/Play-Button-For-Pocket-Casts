function performSkip(type) {
    let buttons = document.getElementsByClassName(type);
    if (buttons.length) {
        buttons[0].click();
    }
}
