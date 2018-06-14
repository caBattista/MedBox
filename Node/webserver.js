const fs = require('fs');
const express = require('express');
const app = express();

app.use('/', express.static("web"));
app.listen(8080, function () {
  console.log('listening on port 8080! ');
});

//Connection to Frontend
const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8084});

wss.on('connection', ws => {
  console.log("conected");
  ws.on('message', msg => {
    const msgObj = JSON.parse(msg);
    if(msgObj.type == "get"){
      getJson(json => {
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
    fs.writeFile(file, JSON.stringify(json, null, 1), function(err) {
      if(err) {return console.log(err);}
      console.log("The file was saved!");
    }); 
  } catch (error) {
    console.log(file);
  }
}
let remind = 0;

const wss2 = new WebSocket.Server({port: 8085});
wss2.on('connection', ws => {
  ws.on('message', msg => {

    console.log("message received " + msg);
    wss2.clients.forEach(client => {
      if(client !== ws && client.readyState === WebSocket.OPEN){
        client.send(msg);
      }
    });
    try{
      if (JSON.parse(msg).event == "button_push") {
        if(remind == 1){
          ws.send(JSON.stringify({act:"dispense"}));
          remind = 0;
        }
        else{
          ws.send(JSON.stringify({act:"display", content:"Noch   Nicht", size: 3, clear: 1}));
          setTimeout(() => {
            ws.send(JSON.stringify({act:"display", content:"", size: 1, clear: 1}));
          },1000);
        } 
      }
    }catch(e){}
  })

  setInterval(() => {
      checkReminders(() => {
        remind = 1;
        ws.send(JSON.stringify({act:"display", content:"Jetzt", size: 4, clear: 1}));
        setTimeout(() => {
          ws.send(JSON.stringify({act:"display", content:"", size: 1, clear: 1}));
        },500);
        console.log("reminding");
      });
  }, 1000);
  
});

//check for reminders
const checkReminders = (callback) => {
  fs.readFile("Users.json", 'utf8', function (err, data) {
    if (err) {return console.log(err);}
    
    const users = JSON.parse(data)
    const d = new Date();
    const timestr = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    
    console.log("reminders check at: " + timestr);

    for (let i = 0; i < users.length; i++) {
      let user = users[i];
      for (let j = 0; j < user.boxes.length; j++) {
        let box = user.boxes[j];
        for (let k = 0; k < box.reminders.length; k++) {
          let reminder = box.reminders[k];
          if(reminder.time == timestr){
            callback();
          }
        }
      }
    }
  });
}