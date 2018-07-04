stage.cycle = [
	{
		tt: "Ihre Gesundheit in ihren Händen",
		bt: "Schließenh Sie sich Millionen von Benutzern an, die Ihrer Medikamente verwalten und Ihrer Gesundheit verbesser"
	},
	{
		tt: "Lisa verwaltet Ihre Medikamente mit täglichen Erinnerungen",
		bt: ""
	},
	{
		tt: "Alexandra verwaltet die Medikamente Ihrer Tochter",
		bt: ""
	},
	{
		tt: "Dieter schickt seinem Artzt täglich Berichte über seine Medikamenteneinnamhme",
		bt: ""
	},
	{
		tt: "Medikamente können auch Direkt in der App nachbestellt werden",
		bt: "Einfach per Barcodescanner die Packung einlesen"
	}
];
stage.currImg = 1;
stage.imgs = document.querySelectorAll("img[class=bgImg]");
stage.circles = document.querySelectorAll("div[class=circle]");
stage.circles[0].style.backgroundColor = "white";
for (let i = 1; i < stage.imgs.length; i++) {
	stage.imgs[i].style.opacity = 0;
}
stage.cylceImages = () => {
	if(stage.currImg == 5){
		stage.currImg = 0;
	}
	lCont.style.transition = "0.5s";
	lCont.style.opacity = 0;
	stage.imgs[stage.currImg].style.transition = "1s";
	stage.imgs[stage.currImg].style.opacity = 1;
	// setTimeout(() => {
		stage.imgs[stage.currImg].style.filter = "brightness(50%)";
		t1.textContent = stage.cycle[stage.currImg].tt;
		t2.textContent = stage.cycle[stage.currImg].bt;
		lCont.style.transition = "1s";
		lCont.style.opacity = 1;
		if(stage.currImg == 0){ 
			stage.imgs[stage.imgs.length-1].style.opacity = 0;
			stage.imgs[stage.imgs.length-1].style.filter = "";
			stage.circles[stage.imgs.length-1].style.backgroundColor = "";
		}
		else{
			stage.imgs[stage.currImg-1].style.opacity = 0;
			stage.imgs[stage.currImg-1].style.filter = "";
			stage.circles[stage.currImg-1].style.backgroundColor = "";	
		}
		stage.circles[stage.currImg].style.backgroundColor = "white";
		stage.currImg++;
	// },1000);
}
stage.intrerv = setInterval(() => {stage.cylceImages();},7000);
einloggen.onclick = () => {
	clearInterval(stage.intrerv);
	loader.load(3);
};
login.onclick = () => {
	clearInterval(stage.intrerv);
	loader.load(4);
};
lCont.onclick = () => {
	clearInterval(stage.intrerv);
	stage.intrerv = setInterval(() => {stage.cylceImages();},7000);
	stage.cylceImages();
};