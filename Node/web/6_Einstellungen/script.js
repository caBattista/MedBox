bb.onclick = () => {
	clearInterval(stage.intrerv);
	loader.load(3);
};
stage.wsM = new WebSocket('ws://' + location.hostname + ':8085', ['json']);
stage.wsM.onmessage = event => {
	const obj = JSON.parse(event.data);
	if(obj.event == "button_push"){
		anfrage.style.backgroundColor = "#47a43d";
		setTimeout(() => {
			anfrage.style.backgroundColor = "";
		}, 200);
	}
}
loader.onbeforeunload = () => {
	stage.wsM.onmessage = undefined;
	stage.wsM.onclose = () => {};
	stage.wsM.close();
}
a.onclick = () => {
	stage.wsM.send(JSON.stringify({act:"led", led1:JSON.parse(ai1.value), led2:[0,0,0], time:ai2.value}));
};
b.onclick = () => {
	stage.wsM.send(JSON.stringify({act:"display", content:bi.value, size:2, clear:1}));
	setTimeout(() => {
		b.checked = false;
	}, 500)
};
c.onclick = () => {
	stage.wsM.send(JSON.stringify({act:"dispense"}));
	setTimeout(() => {
		c.checked = false;
	}, 500)
};
