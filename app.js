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
app.get('/audio/1.wav', function (req, res) {
   res.sendfile('audio/1.wav');
   // res.sendFile('audio/1.wav', { root: __dirname });
});
app.get('/audio/2.wav', function (req, res) {
   res.sendfile('audio/2.wav');
   // res.sendFile('audio/2.wav', { root: __dirname });
});

//Frontend dependencies
app.get('/aframe-master.min.js', function (req, res) { res.sendFile('lib/aframe-master.min.js', { root: __dirname }); });
app.get('/aframe-ar.js', function (req, res) { res.sendFile('lib/aframe-ar.js', { root: __dirname }); });
app.get('/Pizzicato.min.js', function (req, res) { res.sendFile('lib/Pizzicato.min.js', { root: __dirname }); });
app.get('/aframe.min.js', function (req, res) { res.sendFile('lib/aframe.min.js', { root: __dirname }); });
app.get('/data/camera_para.dat', function (req, res) { res.sendFile('data/camera_para.dat', { root: __dirname }); });
//Pattern files
app.get('/data/pattern-hiro.patt', function (req, res) { res.sendFile('data/pattern-hiro.patt', { root: __dirname }); });
app.get('/data/pattern-kanji.patt', function (req, res) { res.sendFile('data/pattern-kanji.patt', { root: __dirname }); });
//Custom pattern files
var custMarkerNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
for (i = 0; i <= custMarkerNames.length; i++) {
   let patternUrl = '/data/patterns/pattern-' + custMarkerNames[i] + '.patt'
   // console.log(patternUrl)
   app.get(patternUrl, function (req, res) {
      res.sendFile(patternUrl, { root: __dirname });
   });
};

// app.get('/data/patterns/pattern-A.patt', function (req, res) {res.sendFile('/data/patterns/pattern-A.patt', { root: __dirname });});
// app.get('/data/patterns/pattern-B.patt', function (req, res) {res.sendFile('/data/patterns/pattern-B.patt', { root: __dirname });});
// app.get('/data/patterns/pattern-C.patt', function (req, res) {res.sendFile('/data/patterns/pattern-C.patt', { root: __dirname });});
// app.get('/data/patterns/pattern-D.patt', function (req, res) {res.sendFile('/data/patterns/pattern-D.patt', { root: __dirname });});
// app.get('/data/patterns/pattern-E.patt', function (req, res) {res.sendFile('/data/patterns/pattern-E.patt', { root: __dirname });});
// app.get('/data/patterns/pattern-F.patt', function (req, res) {res.sendFile('/data/patterns/pattern-F.patt', { root: __dirname });});
// app.get('/data/patterns/pattern-G.patt', function (req, res) {res.sendFile('/data/patterns/pattern-G.patt', { root: __dirname });});



//Socket events
io.on('connection', function (socket) {
   console.log('A user connected');
   connected_num = connected_num + 1

   //Send a message when 
   // setTimeout(function () {
   //    //Sending an object when emmiting an event
   //    socket.emit('testerEvent', { description: 'A custom event named testerEvent!' });
   // }, 4000);
   io.emit('custMarkerNamesServe', custMarkerNames);//Send a list of available markers
   //Handle custom marker events
   for (i = 0; i <= custMarkerNames.length; i++) {
      socket.on(custMarkerNames[i] + 'Rec', function (data) {
         // console.log(JSON.parse(data));
         io.emit(custMarkerNames[i] + 'Serve', data);
         // console.log(data);
      });
   };


   socket.on('clientEvent', function (data) {
      console.log(data);
   });

   socket.on('kanjiRec', function (data) {
      // console.log(JSON.parse(data));
      io.emit('kanjiServe', data);
   });
   socket.on('hiroRec', function (data) {
      // console.log(JSON.parse(data));
      io.emit('hiroServe', data);
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