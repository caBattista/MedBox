const loader = {
    onbeforeunload : () => {},

    load : (page, keep) => {
        page--;
        fetch(loader.pages[page] + "/page.html").then(res => {
            res.text().then( text => {
                loader.build(text, loader.pages[page], keep);
            });
        });
    },

    build : (html, folder, keep) => {

        //run the onbeforeunload function and delete ist
        loader.onbeforeunload();
        loader.onbeforeunload = () => {};

        //clear stage object
        window.stage = {};
        if(keep){
            window.stage.kept = keep;
        }
    
        setTimeout(() => {

            //remove old stage
            const oStg =  document.getElementById("stage")
            if(oStg){   document.body.removeChild(oStg);    }

            //add Html
            const stg = document.createElement("div");
            stg.id = "stage";
            stg.style.opacity = 0;
            stg.innerHTML = html;
            
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

            document.body.appendChild(stg);
            
            setTimeout(() => {
                stg.style.opacity = 1;
            },100);
        },100);
    },
    pages: [
        "1_startscreen",
        "2_login",
        "3_hauptmenue",
        "4_barcodescanner",
        "5_einrichten",
        "6_einstellungen",
        "7_medhinzu",
        "8_ende"
    ]
}
window.onload = () => {
    loader.load(7);
}