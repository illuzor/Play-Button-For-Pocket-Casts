const performSkip = (type) => {
    const buttons = document.getElementsByClassName(type);
    if (buttons.length) {
        buttons[0].click();
    }
};
