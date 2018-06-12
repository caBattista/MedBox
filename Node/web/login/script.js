var stage = {
	bgimage = document.getElementById("login"),
	cylceImages = () => {
		stage.bgimage.src = "";
	},
	run: () => {
		stage.bgimage.onclick = () => {
			loader.load("startscreen");
		};
		setInterval();
	}
}
stage.run();