bcScreen.onclick = () => {
   lbarInner.style.width = "100%";
    setTimeout(() => {
            stage.getMed(17);
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
    alert(bestres),
    Quagga.stop();
    stage.getMed(bestres);
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

stage.getMed = (id) =>{
    ws.get("Meds.json", (json) => {
        console.log(json);
        for (let i = 0; i < json.file.length; i++) {
            console.log(json.file[i].id);
            if(json.file[i].id == id){
               loader.load(7, {
                    barcodeRes:json.file[i]
                });
            }
        }
    });
}
