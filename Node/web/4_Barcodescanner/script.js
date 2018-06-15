bcScreen.onclick = () => {
   lbarInner.style.width = "100%";
    setTimeout(() => {
        ws.get("Meds.json", (json) => {
            loader.load(7, json[0]);
        });
    }, 1000);
};
keinBarc.onclick = () => {
    loader.load(7);
};

Quagga.init({
    inputStream : {
      name : "Live",
      type : "LiveStream",
      target: document.querySelector("#bcScreen"),    // Or '#yourElement' (optional)
      constraints: {
        width: document.querySelector("#bcScreen").offsetWidth,
        height: document.querySelector("#bcScreen").offsetHeight,
        facingMode: "environment" // or user
      }
    },
    decoder : {
      readers : ["ean_reader"]
    }
  }, function(err) {
      if (err) {
          console.log(err);
          return;
      }
      console.log("Initialization finished. Now starting.");
      screenbg.style.display = "none";
      Quagga.start();
  });

stage.results = [];
Quagga.onDetected((data) => {

  stage.results.push(data.codeResult.code);

  lbarInner.style.width = (stage.results.length * 5) + "%";

  if(stage.results.length >= 20){

    const bestres = stage.mode(stage.results);
    lbarInner.textContent = bestres;
    Quagga.stop();

    ws.get("Meds.json", (json) => {
        for (let i = 0; i < json.length; i++) {
            if(json[i].id == bestres){
                loader.load(3, {
                    barcodeRes:json[i].id
                });
            }
        }
    });

  }
});

stage.mode = (array) => {
  if(array.length == 0)
      return null;
  var modeMap = {};
  var maxEl = array[0], maxCount = 1;
  for(var i = 0; i < array.length; i++)
  {
      var el = array[i];
      if(modeMap[el] == null)
          modeMap[el] = 1;
      else
          modeMap[el]++;  
      if(modeMap[el] > maxCount)
      {
          maxEl = el;
          maxCount = modeMap[el];
      }
  }
  return maxEl;
}