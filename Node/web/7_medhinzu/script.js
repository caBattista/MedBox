bb.onclick = () => {
	clearInterval(stage.intrerv);
	loader.load(4);
};
stage.nameEntered = 0;
document.getElementById("Name").onkeydown = (event) => {	
	console.log(event.target);
	if (event.keyCode === 13 && event.target.value && stage.nameEntered == 0) {
		stage.nameEntered = 1;
		const item = document.createElement("div");
		item.className = "item";
		wrapper.appendChild(item);
	}
}
document.querySelectorAll(".itemArrow").forEach(arrow => {
	arrow.onclick = (event) => {	
		const arrow = event.target;
		const content = arrow.parentNode.parentNode.querySelector(".itemContent");
		arrow.style.transition = "0.5s";
		content.style.transition = "0.5s";
		if(arrow.style.transform == "rotate(90deg)"){
			arrow.style.transform = "rotate(-90deg)";
			content.style.maxHeight = "1000px";
		}
		else{
			arrow.style.transform = "rotate(90deg)";
			content.style.maxHeight = "0px";
		}
	}
});
document.querySelectorAll(".slider").forEach(slider => {
	slider.onclick = (event) => {
		const toggle = event.target;
		toggle.style.transition = toggle.children[0].style.transition = "0.5s";
		if(toggle.children[0].style.marginLeft == "1em"){
			toggle.children[0].style.marginLeft = "0em";
			toggle.style.backgroundColor = "";
		}
		else{
			toggle.children[0].style.marginLeft = "1em";
			toggle.style.backgroundColor = "#4fb743";
		}
	};
});
document.querySelector(".hinzu").onclick = (event) => {
	const time = document.createElement("div");
	time.className = "time";
	time.innerHTML = `
		<input class="timeTitle" type="text" placeholder="Name">
		<input type="time" class="timeSelector">
		<span class="timeLabel">bis</span>
		<input type="time" class="timeSelector">
		<span class="timeLabel">von</span>
		<div class="underline"></div>
	`;
	event.target.parentNode.insertBefore(time, event.target); 
};
document.querySelectorAll(".wt > div").forEach(wt => {
	wt.onclick = (event) => {
		if(event.target.style.backgroundColor == "rgb(185, 218, 237)"){
			event.target.style.backgroundColor = "";
		}
		else{
			event.target.style.backgroundColor = "rgb(185, 218, 237)";
		}
	};
});

stage.preselect = () => {
	if(!stage.kept){
		return;
	}
	if(stage.kept.barcodeRes.name){
		document.getElementById("Name").value = stage.kept.barcodeRes.name;
	}
	if(stage.kept.barcodeRes.desc){
		document.getElementById("Beschreibung").value = stage.kept.barcodeRes.desc;
	}
	if(stage.kept.barcodeRes.reminders){
		if(stage.kept.barcodeRes.reminders == "on"){
			erSld.children[0].style.marginLeft = "1em";
			erSld.style.backgroundColor = "#4fb743";
		}
	}
	if(stage.kept.barcodeRes.tpyReminders){
		stage.kept.barcodeRes.tpyReminders.forEach(el => {
			const hinzu = document.querySelector(".hinzu");
			const time = document.createElement("div");
			time.className = "time";
			time.innerHTML = `
				<input class="timeTitle" type="text" placeholder="Name" value="${el.name}">
				<input type="time" class="timeSelector" value="${el.t1}">
				<span class="timeLabel">bis</span>
				<input type="time" class="timeSelector" value="${el.t0}">
				<span class="timeLabel">von</span>
				<div class="underline"></div>
			`;
			hinzu.parentNode.insertBefore(time, hinzu); 
		});	
	}
	if(stage.kept.barcodeRes.week){
		if(stage.kept.barcodeRes.week == "on"){
			wpSld.children[0].style.marginLeft = "1em";
			wpSld.style.backgroundColor = "#4fb743";
		}
	}
	if(stage.kept.barcodeRes.days){
		const wt = document.querySelector(".wt");
		let i = 0;
		stage.kept.barcodeRes.days.forEach(el => {
			if(el == 0){
				wt.children[i].style.backgroundColor = "rgb(185, 218, 237)";
			}
			i++;
		});
	}
	if(stage.kept.barcodeRes.instructions){
		if(stage.kept.barcodeRes.instructions == "on"){
			anSld.children[0].style.marginLeft = "1em";
			anSld.style.backgroundColor = "#4fb743";
		}
	}
	if(stage.kept.barcodeRes.name){
		document.getElementById("Name").value = stage.kept.barcodeRes.name;
	}
}
stage.preselect();

stage.saveToServer = () => {
	ws.get("Users.json",(json) =>{
		json.file[0].boxes[0].med.name = document.querySelector("#Name").value;
		json.file[0].boxes[0].reminders = [];
		const times = document.querySelectorAll(".time");
		for (let i = 0; i < times.length; i++) {
			json.file[0].boxes[0].reminders[i] = {
				name: times[i].children[0].value,
				time: times[i].children[3].value,
				time1: times[i].children[1].value
			}
		}
		ws.set(json.file, "Users.json");
	});
}

weiter.onclick = () => {
	clearInterval(stage.intrerv);
	stage.saveToServer();
	loader.load(5);
};

