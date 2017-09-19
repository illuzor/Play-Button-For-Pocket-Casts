var result = "ntp";

var playButtons = document.getElementsByClassName("animated-play-button");

if(playButtons.length != 0){
	if(playButtons[0].outerHTML.includes("matrix(6.")){
		result = "play";
	} else {
		result = "pause";
	}
	playButtons[0].click();
} else {
	if (play != "none") {
		
		var allDivs = document.querySelectorAll('.ReactVirtualized__Table__row.row.clickable');
		var divs = new Array();

		for (i = 0; i < allDivs.length; i++) {
			if(!allDivs[i].classList.contains("played"))
				divs[divs.length] = allDivs[i]
		}

		if (divs.length) {
            var num;
			
			switch (play) {
				case "first":
					num = 0
					break;
				case "last":
					num = divs.length - 1
					break;
				case "random":
					num = Math.floor(Math.random() * divs.length);
					break;
			}

			divs[num].click();
			document.getElementsByClassName("animated-play-button")[0].click();
			document.getElementsByClassName("close-button")[0].click();

            result = "play";
        }
	}
}

result;