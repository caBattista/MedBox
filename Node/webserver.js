const express = require('express');
const app = express();

app.use('/', express.static("web"));
app.listen(8080, function () {
  console.log('listening on port 8080!');
});


const ws = require('./wsservers');
ws.run();