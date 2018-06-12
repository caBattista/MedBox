class PageScript {
	constructor(){
		this.login = document.getElementById("login");
		this.bgImage = document.getElementById("bgImage");
		this.tcont = document.getElementById("lcont");
		this.tt = document.getElementById("l1");
		this.bt = document.getElementById("l2");
		this.dk = document.getElementById("darker");
		this.currImg = 1;
		this.cycle = [
			{ofst:-425, tt:"Ihre Gesundheit in ihren Händen",
			bt:"Schließenh Sie sich Millionen von Benutzern an, die Ihrer Medikamente verwalten und Ihrer Gesundheit verbesser"},
			{ofst:-550, tt:"Lisa verwaltet Ihre Medikamente mit täglichen Erinnerungen",bt:""},
			{ofst:-350, tt:"Alexandra verwaltet die Medikamente Ihrer Tochter",bt:""},
			{ofst:-425, tt:"Dieter schickt seinem Artzt täglich Berichte über seine Medikamenteneinnamhme",bt:""},
			{ofst:-300, tt:"Medikamente können auch Direkt in der App nachbestellt werden",bt:""}
		];
		var intrerv = setInterval(() => {this.cylceImages();},7000);
		var login = document.getElementById("login");
		login.onclick = () => {
			clearInterval(intrerv);
			loader.load("startscreen");
		};
	}
	cylceImages(){
		if(this.currImg == 5){
			this.currImg = 0;
		}
		this.dk.style.opacity = 1;
		this.tcont.style.opacity = 0;
		setTimeout(() => {
			this.bgImage.src = "images/wi" + this.currImg + ".png";
			this.bgImage.style.left = this.cycle[this.currImg].ofst + "px";
			this.tt.textContent = this.cycle[this.currImg].tt;
			this.bt.textContent = this.cycle[this.currImg].bt;
			this.dk.style.opacity = 0.4;
			this.tcont.style.opacity = 1;
			this.currImg++;
		},1000);
	}
}
loader.sso = new PageScript();