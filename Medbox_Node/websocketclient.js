const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8085');
const stdin = process.openStdin();

const dispense = {
  act:"dispense"
  };
const setLedAnim = {
  act:"led",
  led1:[0,0,64],
  led2:[0,0,0],
  time:1000,
  };
const display = {
  act:"display",
  content: "this is a text",
  size: 1,
  clear: 1
}

function buildJson(input){
  input = input.split(" ");
  if(input.length == 8){
    var action = {
      act: input[0], 
      led1: [input[1],input[2],input[3]], 
      led2: [input[4],input[5],input[6]], 
      time: input[7]
    };
  }
  if(input.length === 1){
    var action = {
      act: input[0]
    };
  }
  if(input.length === 4){
    var action = {
      act: input[0],
      content: input[1],
      size: input[2],
      clear: input[3]
    };
  }
  return JSON.stringify(action);
}

stdin.addListener("data", function(d) {
  var input = d.toString().trim();
  console.log("you entered: '" + input + "'");
  let json = buildJson(input);
  console.log(json);
  ws.send(json);
});