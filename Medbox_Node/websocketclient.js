const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8085');
const stdin = process.openStdin();

stdin.addListener("data", function(d) {
  var input = d.toString().trim();
  console.log("you entered: '" + input + "'");
  ws.send(input);
});