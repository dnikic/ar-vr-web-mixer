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
            // Start marker interval loop --------------------------------------------------------------------->
            var i = 0;
            interval = setInterval(function () {
                // console.log(i++);  // this is inside your loop
                position = marker.getAttribute('position');
                rotation = marker.getAttribute('rotation');
                scale = marker.getAttribute('scale');
                if (markerId == 'marker-hiro') {
                    sound1.volume = -1 * (Math.abs(rotation.z) / 180) + 1 //Up is 1, down is 0    
                    sound1.effects[0].gain = Math.abs(position.x)
                    sound1.effects[1].mix = Math.abs(position.y)
                    sound1.play();
                    socket.emit('hiroRec', JSON.stringify([position, rotation,scale,sound1.volume]));
                }
                if (markerId == 'marker-kanji') {
                    sound2.volume = -1 * (Math.abs(rotation.z) / 180) + 1 //Up is 1, down is 0    
                    sound2.effects[0].gain = Math.abs(position.x)
                    sound2.effects[1].mix = Math.abs(position.y)
                    sound2.play();
                    socket.emit('kanjiRec', JSON.stringify([position, rotation,scale,sound2.volume]));
                }
            }, 100);

        });

        marker.addEventListener('markerLost', function () {
            var markerId = marker.id;
            console.log('markerLost', markerId);
            if (markerId == 'marker-hiro') { sound1.pause(); }
            if (markerId == 'marker-kanji') { sound2.pause(); }
            clearInterval(interval);
        });
    }
});

// Audio loading
var sound1 = new Pizzicato.Sound(
    {
        source: 'file',
        options: { path: './audio/1.wav', loop: true }
    },
    function () { prepSound(sound1) }
);
var sound2 = new Pizzicato.Sound(
    {
        source: 'file',
        options: { path: './audio/2.wav', loop: true }
    },
    function () { prepSound(sound2); }
);
function prepSound(sound) {
    var distortion = new Pizzicato.Effects.Distortion({
        gain: 0 //min 0.0, max 1.0
    });
    var reverb = new Pizzicato.Effects.Reverb({
        time: 0.90,
        decay: 0.03,
        reverse: false,
        mix: 0 //max 0.71, min 0.00
    });
    sound.addEffect(distortion);
    sound.addEffect(reverb);
    sound.volume = 1;
    console.log('Sound loaded');
}



