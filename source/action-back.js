var button = document.querySelector(".skip_back_button");

if (button.onclick) {
    button.onclick();
} else if (button.click) {
    button.click();
}