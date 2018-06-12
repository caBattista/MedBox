const loader = {
    load: function (folder) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("stage").innerHTML = this.responseText;
                loader.loadJs(folder);
            }
        };
        xhttp.open("GET", folder + "/page.html", true);
        xhttp.send();
    },
    loadJs: function (folder) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                eval(this.responseText);
            }
        };
        xhttp.open("GET", folder + "/script.js", true);
        xhttp.send();
        console.log("loading: " + folder);
    }
}