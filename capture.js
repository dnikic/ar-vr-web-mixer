// console.log('Debug________________________');

//Sockets
var socket = io();
socket.on('testerEvent', function (data) {
    console.log(data.description);
    document.write(data.description)
});
var custMarkerNames = []

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
                socket.emit('custMarkerRec', JSON.stringify([markerId, position, rotation, scale, sound1.volume]));


                if (markerId == 'marker-hiro') {
                    sound1.volume = -1 * (Math.abs(rotation.z) / 180) + 1 //Up is 1, down is 0    
                    sound1.effects[0].gain = Math.abs(position.x)
                    sound1.effects[1].mix = Math.abs(position.y)
                    sound1.play();
                    socket.emit('hiroRec', JSON.stringify([position, rotation, scale, sound1.volume]));
                }
                if (markerId == 'marker-kanji') {
                    sound2.volume = -1 * (Math.abs(rotation.z) / 180) + 1 //Up is 1, down is 0    
                    sound2.effects[0].gain = Math.abs(position.x)
                    sound2.effects[1].mix = Math.abs(position.y)
                    sound2.play();
                    socket.emit('kanjiRec', JSON.stringify([position, rotation, scale, sound2.volume]));
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





//Generate page objects
document.body.innerHTML = '\
<a-scene embedded arjs="sourceType: webcam; detectionMode: mono_and_matrix; matrixCodeType: 3x3; sourceWidth:1280; sourceHeight:960; displayWidth: 1280; displayHeight: 960;">\
<a-marker preset="hiro" id="marker-hiro" registerevents>\
    <a-box position="0 0.5 0" material="opacity: 0.5; side: double;color:blue;">\
        <a-torus-knot radius="0.26" radius-tubular="0.05"\
            animation="property: rotation; to:360 0 0; dur: 5000; easing: linear; loop: true">\
        </a-torus-knot>\
    </a-box>\
</a-marker>\
<a-marker preset="kanji" id="marker-kanji" registerevents>\
    <a-box position="0 0.5 0" material="opacity: 0.5; side: double;color:red;">\
        <a-torus-knot radius="0.26" radius-tubular="0.05"\
            animation="property: rotation; to:360 0 0; dur: 5000; easing: linear; loop: true">\
        </a-torus-knot>\
    </a-box>\
</a-marker>\
<!-- add a simple camera -->\
<a-entity camera></a-entity></a-scene>'

socket.on('custMarkerNamesServe', function (data) {
    custMarkerNames = data
    console.log(custMarkerNames);




    for (i = 0; i < custMarkerNames.length; i++) {
        var elem = document.getElementById('marker-' + custMarkerNames[i]);
        if (elem == null) {
            //Generate marker object
            var p = document.getElementsByTagName('a-scene')[0];
            var newElement = document.createElement('a-marker');
            newElement.setAttribute('id', 'marker-' + custMarkerNames[i]);
            newElement.innerHTML = '';
            p.appendChild(newElement);
            var customMarkerObj = document.getElementById('marker-' + custMarkerNames[i]);
            customMarkerObj.setAttribute('preset', 'custom');
            customMarkerObj.setAttribute('type', 'pattern');
            customMarkerObj.setAttribute('url', '/data/patterns/pattern-' + custMarkerNames[i] + '.patt');
            customMarkerObj.setAttribute('registerevents', '');
            // att = document.createAttribute('registerevents');
            // customMarkerObj.setAttributeNode(att);  
            //Generate box within
            newElement = document.createElement('a-box');
            newElement.setAttribute('position', '0 0.5 0');
            newElement.setAttribute('material', 'opacity: 0.5; side: double;color:green;');
            customMarkerObj.appendChild(newElement);
        }
    }
});

