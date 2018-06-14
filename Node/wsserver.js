const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8085});
const stdin = process.openStdin();

wss.on('connection', ws => {
  console.log("######### new Connection #########");
  ws.on('message', msg => {
    console.log("message: " + msg);
    wss.clients.forEach(client => {
      if(client !== ws && client.readyState === WebSocket.OPEN){
        client.send(msg);
      }
    });
  })
  stdin.addListener("data", function(d) {
    var input = d.toString().trim();
    console.log("sent: '" + input + "'");
    ws.send(input);
  });
})