logo_top.style.transform = "rotate(" + 360 + "deg)";

setTimeout(() => {
	logo_bot.style.opacity = 1;
},500);

setTimeout(() => {
	loader.load("2_login");
},2000);