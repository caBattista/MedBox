var currImg = 0;
var imgOffset = [
	-450,-450,-450,-450,-450,
];
function cylceImages() {
	if(currImg == 5){
		currImg = 0;
	}
	currImg++;
	var bgimage = document.getElementById("bgImage");
	bgimage.src = "images/wi" + currImg + ".png";
	bgimage.style.left = /*imgOffset[currImg]*/ "-450" + "px";	
}
//setInterval(cylceImages,2000);
var login = document.getElementById("login");
login.onclick = () => {
	loader.load("startscreen");
};