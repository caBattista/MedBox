stage.links = ["5_Uebersicht", "3_Hauptmenue", "3_Hauptmenue"];
for (let i = 0; i < stage.links.length; i++) {
	columnLeft.children[i].onclick = () => {
		loader.load(stage.links[i]);
	}
}
stage.links2 = ["4_Barcodescanner", "3_Hauptmenue"];
for (let i = 0; i < stage.links2.length; i++) {
	columnRight.children[i].onclick = () => {
		loader.load(stage.links2[i]);
	}
}