// console.log('Debug________________________');

//Sockets
var socket = io();
var custMarkerNames = []



// AR
window.addEventListener('camera-init', (data) => {
    console.log('camera-init', data);
})

window.addEventListener('camera-error', (error) => {
    console.log('camera-error', error);
})

//Event upon marker being registrated
AFRAME.registerComponent('registerevents', {
    init: function () {
        var marker = this.el;
        var interval;

        marker.addEventListener('markerFound', function () {
            var markerId = marker.id;
            console.log('markerFound', markerId);
            // Start marker interval loop --------------------------------------------------------------------->
            var i = 0;
            interval = setInterval(function () {
                //Send marker data to view
                position = marker.getAttribute('position');
                rotation = marker.getAttribute('rotation');
                scale = marker.getAttribute('scale');
                socket.emit('custMarkerRec', JSON.stringify([markerId, position, rotation, scale, sound1.volume]));
                //Manipulate sound
                if (markerId == 'marker-A') {
                    sound1.pause();
                    sound1.volume = -1 * (Math.abs(rotation.z) / 180) + 1 //Up is 1, down is 0    
                    sound1.effects[0].gain = Math.abs(position.x)
                    sound1.effects[1].mix = Math.abs(position.y)
                    sound1.play();
                }
                if (markerId == 'marker-B') {
                    sound2.pause();
                    sound2.volume = -1 * (Math.abs(rotation.z) / 180) + 1 //Up is 1, down is 0    
                    sound2.effects[0].gain = Math.abs(position.x)
                    sound2.effects[1].mix = Math.abs(position.y)
                    sound2.play();
                }
                if (markerId == 'marker-C') {
                    sound3.pause();
                    // sound3.volume = -1 * (Math.abs(rotation.z) / 180) + 1 //Up is 1, down is 0    
                    sound3.volume = Math.abs(position.x)   
                    sound3.effects[0].mix = Math.abs(position.y)
                    sound3.play();
                }
            }, 100);

        });
        //If marker lost
        marker.addEventListener('markerLost', function () {
            var markerId = marker.id;
            console.log('markerLost', markerId);
            if (markerId == 'marker-A') { sound1.pause(); }
            if (markerId == 'marker-B') { sound2.pause(); }
            if (markerId == 'marker-C') { sound3.pause(); }
            clearInterval(interval);
        });
    }
});

// Audio loading and adding effects
var sound1 = new Pizzicato.Sound(
    {
        source: 'file',
        options: { path: './audio/A.wav', loop: true }
    },
    function () {
        sound1.addEffect(distortion);
        sound1.addEffect(reverb);
        sound1.volume = 1;
    }
);
var sound2 = new Pizzicato.Sound(
    {
        source: 'file',
        options: { path: './audio/B.wav', loop: true }
    },
    function () {
        sound2.addEffect(distortion);
        sound2.addEffect(reverb);
        sound2.addEffect(tremolo);
        sound2.volume = 1;
    }
);

var sound3 = new Pizzicato.Sound(
    {
        source: 'file',
        options: { path: './audio/C.wav', loop: true }
    },
    function () {
        sound3.addEffect(tremolo);
        sound3.volume = 1;
    }
);







//Generate page objects
document.body.innerHTML = '\
<a-scene embedded arjs="sourceType: webcam; detectionMode: mono_and_matrix; matrixCodeType: 3x3; sourceWidth:1280; sourceHeight:960; displayWidth: 1280; displayHeight: 960;">\
<!-- add a simple camera -->\
<a-entity camera></a-entity></a-scene>\
'
//Get all avaliable markers from backend and make DOM elements
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

