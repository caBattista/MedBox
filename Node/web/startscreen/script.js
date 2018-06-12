var stage = {
	logoTop: document.getElementById("logo_top"),
	logoBot: document.getElementById("logo_bot"),
	rotate: (rotate) => {
		stage.logoTop.style.transition = "2s";
		stage.logoTop.style.transform = "rotate(" + rotate + "deg)";
	},
	fadeIn: () => {
		stage.logoBot.style.transition = "2s";
		stage.logoBot.style.opacity = 1;
	},
	run: () => {
		stage.rotate(360);
		stage.fadeIn();
		setTimeout(() => {
			loader.load("login");
		},2000);
	}
}
stage.run();