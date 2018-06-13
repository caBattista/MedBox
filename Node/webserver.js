var express = require('express');
var app = express();

app.use('/', express.static("web"));
app.listen(8080, function () {
  console.log('listening on port 8080!');
});

const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8085});

wss.on('connection', ws => {
  console.log("conected");
  ws.on('message', msg => {
    const msgObj = JSON.parse(msg);
    if(msgObj.type == "get"){
      getJson((json) => {
        ws.send(JSON.stringify(json));
      }, msgObj.file);
    }
    else if(msgObj.type == "set"){
      setJson(JSON.parse(msgObj.json), msgObj.file);
    }
  });
});

const getJson = (callback, file) => {
  try {
    const fs = require('fs');
    fs.readFile(file, 'utf8', function (err, data) {
      if (err) {return console.log(err);}
      callback(JSON.parse(data));
      //console.log(data);
    });
  } catch (error) {
    console.log(file);
  }
}

const setJson = (json, file) => {
  try {
    const fs = require('fs');
    fs.writeFile(file, JSON.stringify(json, null, 1), function(err) {
      if(err) {return console.log(err);}
      console.log("The file was saved!");
    }); 
  } catch (error) {
    console.log(file);
  }
}
