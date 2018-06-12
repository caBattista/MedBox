stage.currImg = 1;
stage.cycle = [
	{ofst:-425, tt:"Ihre Gesundheit in ihren Händen",
	bt:"Schließenh Sie sich Millionen von Benutzern an, die Ihrer Medikamente verwalten und Ihrer Gesundheit verbesser"},
	{ofst:-550, tt:"Lisa verwaltet Ihre Medikamente mit täglichen Erinnerungen",bt:""},
	{ofst:-350, tt:"Alexandra verwaltet die Medikamente Ihrer Tochter",bt:""},
	{ofst:-425, tt:"Dieter schickt seinem Artzt täglich Berichte über seine Medikamenteneinnamhme",bt:""},
	{ofst:-300, tt:"Medikamente können auch Direkt in der App nachbestellt werden",
	bt:"Einfach per Barcodescanner die Packung einlesen"}
];
stage.cylceImages = () => {
	if(stage.currImg == 5){
		stage.currImg = 0;
	}
	darker.style.opacity = 1;
	lcont.style.opacity = 0;
	setTimeout(() => {
		bgImage.src = "images/wi" + stage.currImg + ".png";
		bgImage.style.left = stage.cycle[stage.currImg].ofst + "px";
		l1.textContent = stage.cycle[stage.currImg].tt;
		l2.textContent = stage.cycle[stage.currImg].bt;
		darker.style.opacity = 0.4;
		lcont.style.opacity = 1;
		stage.currImg++;
	},1000);
}
stage.intrerv = setInterval(() => {stage.cylceImages();},7000);
login.onclick = () => {
	clearInterval(stage.intrerv);
	loader.load("3_Hauptmenue");
};