// Use specific event names for identiffication
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var connected_num = 0

//Explore files and load dynamically
//localhost:3000/explorer/?file=index.html
app.get('/explorer/', function (req, res) {
   // console.log(req.query.file)
   res.sendfile(req.query.file);
});

//Assets are icnluded in binary
app.get('/', function (req, res) {
   // res.sendfile('index.html');//Dynamic load
   res.sendFile('index.html', { root: __dirname });//Package in file
});
app.get('/capture', function (req, res) {
   res.sendfile('capture.html');
   // res.sendFile('capture.html', { root: __dirname });
});
app.get('/capture.js', function (req, res) {
   res.sendfile('capture.js');
   // res.sendFile('capture.js', { root: __dirname });
});
app.get('/view', function (req, res) {
   res.sendfile('view.html');
   // res.sendFile('view.html', { root: __dirname });
});
app.get('/view.js', function (req, res) {
   res.sendfile('view.js');
   // res.sendFile('view.js', { root: __dirname });
});

//Loading audio
var audioNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
for (i = 0; i < audioNames.length; i++) {
   let soundUrl = 'audio/' + audioNames[i] + '.wav';
   // console.log( soundUrl);
   app.get('/' + soundUrl, function (req, res) {
      // app.get('/audio/A.wav', function (req, res) {
      res.sendfile( soundUrl);
      // res.sendFile(soundUrl, { root: __dirname });
      // res.sendFile('audio/1.wav', { root: __dirname });
   });
};


//Frontend dependencies
app.get('/aframe-master.min.js', function (req, res) { res.sendFile('lib/aframe-master.min.js', { root: __dirname }); });
app.get('/aframe-ar.js', function (req, res) { res.sendFile('lib/aframe-ar.js', { root: __dirname }); });
app.get('/Pizzicato.min.js', function (req, res) { res.sendFile('lib/Pizzicato.min.js', { root: __dirname }); });
app.get('/aframe.min.js', function (req, res) { res.sendFile('lib/aframe.min.js', { root: __dirname }); });
app.get('/data/camera_para.dat', function (req, res) { res.sendFile('data/camera_para.dat', { root: __dirname }); });
app.get('/aueffetcs.js', function (req, res) { res.sendFile('lib/aueffetcs.js', { root: __dirname }); });


//Pattern files
//Custom pattern files
var custMarkerNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
for (i = 0; i < custMarkerNames.length; i++) {
   let patternUrl = '/data/patterns/pattern-' + custMarkerNames[i] + '.patt'
   // console.log(patternUrl)
   app.get(patternUrl, function (req, res) {
      res.sendFile(patternUrl, { root: __dirname });
   });
};


//Socket events
io.on('connection', function (socket) {
   console.log('A user connected');
   connected_num = connected_num + 1


   io.emit('custMarkerNamesServe', custMarkerNames);//Send a list of available markers to capture & view
   //Transfer marker data from Capture to view
   socket.on('custMarkerRec', function (data) {
      io.emit('custMarkerServe', data);
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

//Express server
http.listen(3000, function () {
   console.log('listening on localhost:3000');
});



// Start Firefox
try {
   const { exec } = require("child_process");
   exec("firefox -new-tab 'localhost:3000/'", (error, stdout, stderr) => {
      if (error) {
         console.log(`error: ${error.message}`);
         return;
      }
   });
   exec("start firefox -new-tab localhost:3000/", (error, stdout, stderr) => {
      if (error) {
         console.log(`error: ${error.message}`);
         return;
      }
   });
}
catch (e) {
   console.log('Firefoxx not available.')
}