
//AFrame


// var scene = document.querySelector('a-scene');
// console.log(scene.querySelector('#redBox'));
// var sceneEl = document.querySelector('a-scene');
// var object1 = sceneEl.querySelector("#object1");
// var object2 = sceneEl.querySelector("#object2");

// object1.setAttribute('position', { x: 0.5, y: 0.5, z: -2 });
// object2.setAttribute('position', { x: 2, y: 1, z: -3 });
// object2.setAttribute('rotation', { x: 1, y: 1, z: 1 });
// object2.setAttribute('scale', { x: 2, y: 0.5, z: 1 });
// object2.setAttribute('color', "#f5428d");


//Generate elements
//Generate page objects
document.body.innerHTML = '\
<a-scene>\
<a-box id="object1" position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>\
<a-cylinder id="object2" position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>\
<!-- <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane> -->\
<a-sky color="#ECECEC"></a-sky>\
</a-scene>\
'

var object1 = document.getElementById("object1");
var object2 = document.getElementById("object2");

//Get all avaliable markers from backend and make DOM elements
var custMarkerNames = []
socket.on('custMarkerNamesServe', function (data) {
    custMarkerNames = data
    console.log(custMarkerNames);
    for (i = 0; i < custMarkerNames.length; i++) {
        var elem = document.getElementById('marker-' + custMarkerNames[i]);
        if (elem == null) {
            // Adds an element to the document
            // var p = document.getElementById(parentId);
            var p = document.getElementsByTagName('a-scene')[0];
            var newElement = document.createElement('a-box');
            newElement.setAttribute('id', 'marker-' + custMarkerNames[i]);
            newElement.innerHTML = '';
            p.appendChild(newElement);
        }
    }
});

//Do on marker data updated
socket.on('custMarkerServe', function (data) {
    data = JSON.parse(data);
    markerId = data[0];
    position = data[1];
    rotation = data[2];
    scale = data[3];//Actuaal scale
    vol = data[4];//Sound volume
    console.log(markerId)

    if (markerId == 'marker-A') {
        object1.setAttribute('position', position);
        object1.setAttribute('rotation', rotation);
        object1.setAttribute('scale', { x: vol, y: vol, z: vol });
        if (Math.abs(position.x) > 0.8) {//same as distorsion gain value
            object1.setAttribute('color', "#f5428d");
        }
        else {
            object1.setAttribute('color', "#4CC3D9");//same as gain value
        }


    }
    else if (markerId == 'marker-B'){
        object2.setAttribute('position', position);
        object2.setAttribute('rotation', rotation);
        object2.setAttribute('scale', { x: vol, y: vol, z: vol });
        if (Math.abs(position.y) > 0.8) {//same as reverb mix value
            object2.setAttribute('color', "#f5428d");
        }
        else {
            object2.setAttribute('color', "#FFC65D");//same as gain value
        }

    }
    else {

        var customMarkerObj = document.getElementById(markerId);
        // console.log(position)
        customMarkerObj.setAttribute('position', position);
        customMarkerObj.setAttribute('rotation', rotation);
        // console.log(scale)
        customMarkerObj.setAttribute('scale', { x: scale.x, y: scale.y, z: scale.z });
        customMarkerObj.setAttribute('color', "#f54242");
    };



});
