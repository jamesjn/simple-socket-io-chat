var app = require('express').createServer();
var io  = require('socket.io').listen(app);

var redis = require('redis');
var redis_client = redis.createClient();

app.listen(8080);

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');  
});

app.get('/libraries/jquery.min.js', function(req, res) {
  res.sendfile(__dirname + '/libraries/jquery.min.js');  
});

io.sockets.on('connection', function(client) {
  var cname;
  client.on('join', function(name) {
    cname = name;
    redis_client.lrange('messages', 0, -1, function(err, messages){
      messages = messages.reverse();
      messages.forEach(function(message) {
        send_msg = JSON.parse(message) 
        client.emit("message", send_msg.name + ': ' + send_msg.data);
      });
    });    
  }); 
  client.on('message', function(data) {
    redis_client.lpush("messages", JSON.stringify({name: cname, data: data.message}), function(err, response) {
      redis_client.ltrim("messages", 0, 10);
    });
    client.broadcast.emit("message", cname + ": " + data.message);
  })
})

