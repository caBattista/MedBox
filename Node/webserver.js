const fs = require('fs');
const express = require('express');
const app = express();

app.use('/', express.static("web"));
app.listen(8080, function () {
  console.log('listening on port 8080!');
});

//Ws-Connection to Frontend
const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8084});
let wsConns = 0;

wss.on('connection', ws => {
  wsConns++;
  console.log("ws to fronend conected conns: " + wsConns);
  wsOn = true;
  ws.on('message', msg => {
    const msgObj = JSON.parse(msg);
    switch (msgObj.type) {
      case "get":
        getJson(json => ws.send(JSON.stringify(json)), msgObj.file);
        break;
      case "set":
        setJson(JSON.parse(msgObj.json), msgObj.file);
        break;
      case "rqNotifications":
        if(wsConns === 1){
          console.log('notify');
          notify(wss);
        }
        break;
    }
  });
  ws.on('close', function close() {
    wsConns--;
    console.log("ws to fronend disconected conns: " + wsConns);
  });
});

//reads json and sends it to front end
const getJson = (callback, file) => {
  try { 
    fs.readFile(file, 'utf8', function (err, data) {
      if (err) {return console.log(err);}
      const json = {file:JSON.parse(data)}
      callback(json);
      //console.log(data);
    });
  } catch (error) {
    console.log(file);
  }
}

//recieves json and writes it to file
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

//send trigger to notify frontend
const notify = (ws) => {
  var notified = false;
  var timer =  setInterval(() => {
    if(wsConns === 0){
      clearInterval(timer);
      return;
    }
    if(notified === false){
      checkReminders(() => {
        let data = {notification:{msg:"Ein Medikament is verfügbar"}};
        console.log(JSON.stringify(data));
        wss.clients.forEach(client => {
          if(client !== ws && client.readyState === WebSocket.OPEN){
            client.send(JSON.stringify(data));
          }
        });
        notified = true;
        setTimeout(() => {
          notified = false;
        }, 60000);
      });
    }
  }, 1000);
}

//Ws-Connection to Medbox
let remind = 0;
const wss2 = new WebSocket.Server({port: 8085});
wss2.on('connection', ws => {
  console.log("ws to Medbox conected");
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