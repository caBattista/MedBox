const loader = {
    sso : undefined,
    onbeforeunload : () => {},
    load : folder => {
        fetch(folder + "/page.html").then(res => {
            res.text().then( text => {
                loader.build(text, folder);
            });
        });
    },
    build : (html, folder) => {
        loader.onbeforeunload();
        loader.onbeforeunload = () => {};
        window.stage = {};
        setTimeout(() => {
            //add Html
            if(document.getElementById("stage"))
            {   
                document.getElementById("stage").style.opacity = 0;
                document.body.removeChild(document.getElementById("stage"));
            }
            const stg = document.createElement("div");
            stg.id = "stage";
            stg.style.opacity = 0;
            stg.innerHTML = html;
            document.body.appendChild(stg);
            
            //add css
            const pageStyle = document.createElement("link");
            pageStyle.href = folder + "/style.css";
            pageStyle.rel = "stylesheet";
            pageStyle.type = "text/css";
            pageStyle.media = "all";
            stg.appendChild(pageStyle);

            //add js
            const script = document.createElement("script")
            script.type = "text/javascript";
            script.src = folder + "/script.js";
            stg.appendChild(script);
            
            setTimeout(() => {
                stg.style.opacity = 1;
            },100);
        },100);
    }
}
loader.load("1_Startscreen");
//loader.load("2_Login");
//loader.load("3_Hauptmenue");
//loader.load("4_Barcodescanner");
//loader.load("6_Einstellungen");