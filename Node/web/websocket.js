const ws = {
    con: new WebSocket('ws://' + location.hostname + ':8084', ['json']),
    get: (f, calback) => {
        ws.con.send(JSON.stringify({type:"get", file:f}));
        ws.onRes(calback);
    },
    onRes: (calback = (data) => {}) => {
        ws.con.onmessage = event => {
            calback(JSON.parse(event.data));
            ws.notify();
        }
    },
    set: (obj, f) => {
        ws.con.send(JSON.stringify({type:"set", json:JSON.stringify(obj), file:f}));
    },
    notify: () => {
        //ws.con.send(JSON.stringify({type:"rqNotifications"}));
        ws.con.onmessage = event => {
            let json = JSON.parse(event.data);
            console.log(json);
            if(Object.keys(json)[0] === "notification"){
                var options = {
                    icon: "images/logo_t.png"
                }
                new Notification(json.notification.msg, options);
            }
        }
    }
};
ws.con.onopen = () => {
    Notification.requestPermission(function (permission) {
        if (permission === "granted") {
            ws.notify();
        }
    });
}