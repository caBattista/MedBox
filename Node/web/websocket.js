const ws = {
    con: new WebSocket('ws://' + location.hostname + ':8084', ['json']),
    get: (calback, f) => {
        ws.con.send(JSON.stringify({type:"get", file:f}));
        ws.onRes(calback);
    },
    onRes: (calback) => {
        ws.con.onmessage = event => {
            calback(JSON.parse(event.data));
            ws.con.onmessage = undefined;
        }
    },
    set: (obj, f) => {
        ws.con.send(JSON.stringify({type:"set", json:JSON.stringify(obj), file:f}));
    }
};