const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8085 });

wss.on('connection', ws => {
  //ws.send('node.js ws connected');
  ws.on('message', msg => {
    console.log("message received " + msg);
    
    wss.clients.forEach(client => {
      if(client !== ws && client.readyState === WebSocket.OPEN){
        client.send(msg);
      }
    })
  })
});

var stdin = process.openStdin();

function getState(input){
  input = input.split(" ");
  if(input.length === 2){
    var state = {type: input[0], payload:Number(input[1])}
  }
  else if(input.length === 1){
    var state = {type: input[0]}
  }
  return JSON.stringify(state);
}

wss.on('connection', function connection(ws) {
  stdin.addListener("data", function(d) {
    var input = d.toString().trim();
    console.log("you entered: '" + input + "'");
    ws.send(getState(input));
  });
});

