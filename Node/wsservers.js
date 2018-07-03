exports.run = () => {

    const fs = require('fs');
    const WebSocket = require('ws');

    //Ws-Connection to Frontend
    const wss = new WebSocket.Server({port: 8084});
    let wsConns = 0;
    wss.on('connection', ws => {
    wsConns++;
    console.log("ws to frontend conected conns: " + wsConns);
    wsOn = true;
    ws.on('message', msg => {
        const msgObj = JSON.parse(msg);
        console.log("incoming message from frontend " + msg);
        switch (msgObj.type) {
        case "get":
            getJson(json => ws.send(JSON.stringify(json)), msgObj.file);
            break;
        case "set":
            setJson(JSON.parse(msgObj.json), msgObj.file);
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
    const notifyAll = (msg = "Ein Medikament ist verfügbar", ws) => {
        let data = {notification:{msg:msg}};
        console.log(JSON.stringify(data));
        wss.clients.forEach(client => {
            if(client !== ws && client.readyState === WebSocket.OPEN){
                client.send(JSON.stringify(data));
            }
        });
    }

    //Ws-Connection to Medbox
    let remPool = {taken:1};
    const wss2 = new WebSocket.Server({port: 8085});
    wss2.on('connection', ws => {
    console.log("ws to Medbox conected");
    ws.send(JSON.stringify({act:"display", content:"", size: 3, clear: 1}));
    ws.on('message', msg => {
        console.log("message received " + msg);
        wss2.clients.forEach(client => {
        if(client !== ws && client.readyState === WebSocket.OPEN){
            client.send(msg);
        }
        });
        try{
        if (JSON.parse(msg).event == "button_push") {
            if(remPool.taken == 0){
                ws.send(JSON.stringify({act:"dispense"}));
                ws.send(JSON.stringify({act:"display", content:"", size: 1, clear: 1}));
                //notifyAll("Medikament wurde eingenommen");
                remPool.taken = 1;
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
            ws.send(JSON.stringify({act:"display", content:remPool.name, size: 3, clear: 1}));
            console.log("reminding");
            notifyAll("Erinnerung: " + remPool.name);
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

            console.log("remPool at " + timestr + " : ");
            console.log(remPool);
            //go through users.json and scan for reminders
            for (let i = 0; i < users.length; i++) {
                let user = users[i];
                for (let j = 0; j < user.boxes.length; j++) {
                    let box = user.boxes[j];
                    for (let k = 0; k < box.reminders.length; k++) {

                        let reminder = box.reminders[k];
                        //if reminder is now then trigger callback
                        if(reminder.time == timestr){
                            //if not found any same reminders add this one
                            if(remPool.name != reminder.name || remPool.time != reminder.time || remPool.time1 != reminder.time1){
                                remPool.name = reminder.name;
                                remPool.time = reminder.time;
                                remPool.time1 = reminder.time1;
                                remPool.taken = 0;
                                callback();
                            }
                        }
                    }
                }
            }
        });
    }

    return true;
};