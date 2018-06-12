class PageScript {
	constructor() {
		this.logoTop = document.getElementById("logo_top");
		this.logoBot = document.getElementById("logo_bot"),
		this.rotate(360);	
		setTimeout(() => {
			this.fadeIn();
		},500);
		setTimeout(() => {
			loader.load("login");
		},2000);
	}
	rotate(rotate) {
		this.logoTop.style.transform = "rotate(" + rotate + "deg)";
	}
	fadeIn() {
		this.logoBot.style.opacity = 1;
	}
}
loader.sso = new PageScript();