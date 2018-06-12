stage.links = ["1_startscreen", "2_login", "3_Hauptmenue", "4_Uebersicht", "4_Uebersicht"];

for (let i = 0; i < stage.links.length; i++) {
	wrapper.children[i].onclick = () => {
		loader.load(stage.links[i]);
	}
}