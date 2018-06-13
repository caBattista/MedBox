stage.links = ["1_startscreen", "4_Barcodescanner", "3_Hauptmenue", "4_Barcodescanner", "2_login"];
for (let i = 0; i < stage.links.length; i++) {
	wrapper.children[i].onclick = () => {
		loader.load(stage.links[i]);
	}
}