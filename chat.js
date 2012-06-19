var app = require('express').createServer();
var io  = require('socket.io').listen(app);

app.listen(8080);

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');  
});

app.get('/libraries/jquery.min.js', function(req, res) {
  res.sendfile(__dirname + '/libraries/jquery.min.js');  
});

io.sockets.on('connection', function(client) {
  client.on('message', function(data) {
    console.log(data);  
  })
})

