Quagga.init({
    inputStream : {
      name : "Live",
      type : "LiveStream",
      target: document.querySelector("#screen"),    // Or '#yourElement' (optional)
      constraints: {
        width: document.querySelector("#screen").offsetWidth,
        height: document.querySelector("#screen").offsetHeight,
        facingMode: "environment" // or user
      }
    },
    decoder : {
      readers : ["ean_reader"]
    }
  }, function(err) {
      if (err) {
          console.log(err);
          return
      }
      console.log("Initialization finished. Now starting.");
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
    ws.get((json) => {
        for (let i = 0; i < json.length; i++) {
            if(json[i].id == bestres){
                console.log(json[i].name);
                result.textContent = json[i].name;
            }
        }
    },"Meds.json");
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

bb.onclick = () => {
	clearInterval(stage.intrerv);
	loader.load(3);
};

ws.get(json => {
    result.textContent = json[0].name;
},"Meds.json");