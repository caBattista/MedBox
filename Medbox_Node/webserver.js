var fs = require('fs');
var express = require('express');
var app = express();
/*
app.get('/', function (req, res) {
  fs.readFile('index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
});
*/

app.use('/', express.static("web"));
app.listen(8080, function () {
  console.log('Example app listening on port 3000!');
});