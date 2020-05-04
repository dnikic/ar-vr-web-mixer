// console.log('Debug________________________');

//Sockets
var socket = io();
socket.on('testerEvent', function (data) {
    console.log(data.description);
    document.write(data.description)
});

socket.emit('clientEvent', 'Sent an event from the capture client!');


// AR
window.addEventListener('camera-init', (data) => {
    console.log('camera-init', data);
})

window.addEventListener('camera-error', (error) => {
    console.log('camera-error', error);
})

AFRAME.registerComponent('registerevents', {

    init: function () {
        var marker = this.el;
        var interval;

        marker.addEventListener('markerFound', function () {
            var markerId = marker.id;
            console.log('markerFound', markerId);
            // TODO: Add your own code here to react to the marker being found.
            if (markerId == 'marker-hiro') { sound1.pause(); }
            if (markerId == 'marker-kanji') { sound2.pause(); }
            // Start interval loop
            var i = 0;
            var amount = 0
            interval = setInterval(function () {
                // console.log(i++);  // this is inside your loop
                position = marker.getAttribute('position');
                rotation = marker.getAttribute('rotation');
                amount = Math.abs(position.x)
                if (amount > 1.5) {
                    amount = 5
                }
                else {
                    amount = 0.2
                }



                // console.log(amount)
                changeAudio(sound1, amount, amount, amount)
                if (markerId == 'marker-hiro') { 
                    sound1.play(); 
                    socket.emit('hiroRec', JSON.stringify([position, rotation]));}
                if (markerId == 'marker-kanji') {
                    sound2.play();
                    socket.emit('kanjiRec', JSON.stringify([position, rotation]));
                }
            }, 500);

        });

        marker.addEventListener('markerLost', function () {
            var markerId = marker.id;
            console.log('markerLost', markerId);
            // TODO: Add your own code here to react to the marker being lost.
            // sound1.stop();
            if (markerId == 'marker-hiro') { sound1.pause(); }
            if (markerId == 'marker-kanji') { sound2.pause(); }
            clearInterval(interval);
        });
    }
});

// Audio
var sound1 = new Pizzicato.Sound(
    {
        source: 'file',
        options: { path: './audio/1.wav', loop: true }
    },
    function () {
        // Sound loaded!
        console.log('Sound loaded')
        // sound1.play();
    });
var sound2 = new Pizzicato.Sound(
    {
        source: 'file',
        options: { path: './audio/2.wav', loop: true }
    },
    function () {
        // Sound loaded!
        console.log('Sound loaded')
        // sound1.play();
    });



function changeAudio(sound1, revv, distv, volv) {

    sound1.removeEffect(distortion)
    sound1.removeEffect(reverb)
    var reverb = new Pizzicato.Effects.Reverb({
        time: 0.90,
        decay: 0.03,
        reverse: false,
        mix: revv//max 0.71, min 0.00
    });
    var distortion = new Pizzicato.Effects.Distortion({
        gain: distv //min 0.0, max 1.0
    });
    // sound1.addEffect(distortion);
    // sound1.addEffect(reverb);

    sound1.volume = volv;
    return sound1
}



