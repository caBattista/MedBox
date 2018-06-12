var stage = {
	bgimage = document.getElementById("login"),
	currImg = 0,
	cylceImages = () => {
		stage.currImg++;
		stage.bgimage.src = "wi" + stage.currImg + ".png";
	},
	run: () => {
		stage.bgimage.onclick = () => {
			loader.load("startscreen");
		};
		setInterval(stage.cylceImages,5000);
	}
}
stage.run();