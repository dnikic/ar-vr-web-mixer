// Use specific event names for identiffication
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var connected_num = 0


app.get('/', function (req, res) {
   // res.sendfile('capture.html');
   res.sendFile('index.html', {root: __dirname});
});

app.get('/capture', function (req, res) {
   // res.sendfile('capture.html');
   res.sendFile('capture.html', {root: __dirname});
});
app.get('/capture.js', function (req, res) {
   // res.sendfile('capture.js');
   res.sendFile('capture.js', {root: __dirname});
});
app.get('/audio/1.wav', function (req, res) {
   // res.sendfile('audio/1.wav');
   res.sendFile('audio/1.wav', {root: __dirname});
});
app.get('/audio/2.wav', function (req, res) {
   // res.sendfile('audio/2.wav');
   res.sendFile('audio/2.wav', {root: __dirname});
});



io.on('connection', function (socket) {
   console.log('A user connected');
   connected_num = connected_num + 1

   //Send a message when 
   // setTimeout(function () {
   //    //Sending an object when emmiting an event
   //    socket.emit('testerEvent', { description: 'A custom event named testerEvent!' });
   // }, 4000);

   socket.on('clientEvent', function (data) {
      console.log(data);
   });

   socket.on('disconnect', function () {
      console.log('A user disconnected');
      // Shutdown server if no connected clients
      connected_num = connected_num - 1
      if (connected_num == 0) {   
         http.close()   
         io.close()   
         process.exit();
      }
   });

});

http.listen(3000, function () {
   console.log('listening on localhost:3000');
});



// Start Firefox
try {
   const { exec } = require("child_process");
   exec("firefox -new-tab 'localhost:3000/capture'", (error, stdout, stderr) => {
      if (error) {
         console.log(`error: ${error.message}`);
         return;
      }
   });
   exec("start firefox -new-tab localhost:3000/capture", (error, stdout, stderr) => {
      if (error) {
         console.log(`error: ${error.message}`);
         return;
      }
   });
}
catch (e) {
   console.log('Firefoxx not available.')
}