var express = require("express");
var app = express();
var port = 8080;

// app.get("/", function(req, res){
    // res.send("It works!");
// });

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("page");
});
 
var io = require('socket.io').listen(app.listen(port));
io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'welcome to the chat' });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});
// app.listen(port);
console.log("Listening on port " + port);

var mongo = require('mongodb').MongoClient;
var client = io.sockets;
mongo.connect('mongodb://127.0.0.1/chat', function(err, db) {
	if(err) throw err;
	client.on('connection', function(socket) {
		var col = db.collection('messages');
		socket.on('send', function(data) {
			console.log('sending...');
			var name = data.name;
			var message = data.message;
			col.insert({name: name, message: message}, function() {
				console.log('inserting...');
			});
		});
	});
});