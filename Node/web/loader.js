
var loader = {
    sso: undefined,
    stage: document.getElementById("stage"),
    load: function (folder) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                stage.innerHTML = this.responseText;
                loader.loadJS(folder);
            }
        };
        xhttp.open("GET", folder + "/page.html", true);
        xhttp.send();
    },
    loadJS: (folder) => {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                setTimeout(() => {
                    eval(this.responseText);
                }, 500); 
            }
        };
        xhttp.open("GET", folder + "/script.js", true);
        xhttp.send();
    }
}
//loader.load("startscreen");
loader.load("login");

/*
class Loader {
	constructor(stageName) {
        this.stage = document.getElementById(stageName);
        this.sso;
    }
    getPage(folderName){
        this.getHtml(folderName);
    }
	getHtml(folderName) {
        var myObject = this;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                myObject.stage = this.responseText;
                //callback();
            }
        };
        
        xhttp.open("GET", "startscreen" + "/page.html", true);
        xhttp.send();
	}
	getJs(folderName) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                eval(this.responseText);
            }
        };
        xhttp.open("GET", folderName + "/script.js", true);
        xhttp.send();
	}
}
var loader = new Loader("stage");
loader.getPage("startscreen");
*/