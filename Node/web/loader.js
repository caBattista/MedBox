
var loader = {
    sso: undefined,
    load: function (folder) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                //add Html
                if(document.getElementById("stage")){document.body.removeChild(stage);}
                var stg = document.createElement("div");
                stg.id = "stage";
                stg.style.opacity = 0;
                setTimeout(() =>{
                    //add html
                    stg.innerHTML = this.responseText;
                    document.body.appendChild(stg);
                    
                    //add css
                    var pageStyle = document.createElement("link");
                    pageStyle.href = folder + "/style.css";
                    pageStyle.rel = "stylesheet";
                    pageStyle.type = "text/css";
                    pageStyle.media = "all";
                    stage.appendChild(pageStyle);

                    setTimeout(() => {
                        //add js
                        var script = document.createElement("script")
                        script.type = "text/javascript";
                        script.src = folder + "/script.js";
                        stage.appendChild(script);
                        stg.style.opacity = 1;
                    },100);
                },100);
            }
        };
        xhttp.open("GET", folder + "/page.html", true);
        xhttp.send();
    }
}
loader.load("1_startscreen");
//loader.load("2_login");
//loader.load("3_Hauptmenue");

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