var button = document.querySelector(".skip_forward_button");

if (button.onclick) {
    button.onclick();
} else if (button.click) {
    button.click();
}