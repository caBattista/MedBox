bb.onclick = () => {
	clearInterval(stage.intrerv);
	loader.load(4);
};
stage.nameEntered = 0;
document.getElementById("name").onkeydown = (event) => {	
	console.log(event.target);
	if (event.keyCode === 13 && event.target.value && stage.nameEntered == 0) {
		stage.nameEntered = 1;
		const item = document.createElement("div");
		item.className = "item";
		wrapper.appendChild(item);
	}
}

