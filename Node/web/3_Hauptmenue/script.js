stage.links = [5, 3, 6];
for (let i = 0; i < stage.links.length; i++) {
	columnLeft.children[i].onclick = () => {
		loader.load(stage.links[i]);
	}
}
stage.links2 = [4, 3];
for (let i = 0; i < stage.links2.length; i++) {
	columnRight.children[i].onclick = () => {
		loader.load(stage.links2[i]);
	}
}