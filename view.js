
//AFrame


// var scene = document.querySelector('a-scene');
// console.log(scene.querySelector('#redBox'));
// var sceneEl = document.querySelector('a-scene');
// var object1 = sceneEl.querySelector("#object1");
// var object2 = sceneEl.querySelector("#object2");

var object1 = document.getElementById("object1");
var object2 = document.getElementById("object2");
// object1.setAttribute('position', { x: 0.5, y: 0.5, z: -2 });
// object2.setAttribute('position', { x: 2, y: 1, z: -3 });
// object2.setAttribute('rotation', { x: 1, y: 1, z: 1 });
// object2.setAttribute('scale', { x: 2, y: 0.5, z: 1 });
// object2.setAttribute('color', "#f5428d");


//Generate elements
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

socket.on('kanjiServe', function (data) {
    // console.log(data);
    data = JSON.parse(data);
    position = data[0];
    rotation = data[1];
    // scale = data[2];//Actuaal scale
    scale = data[3];//Sound volume
    console.log(scale);
    object1.setAttribute('position', position);
    object1.setAttribute('rotation', rotation);
    object1.setAttribute('scale', { x: scale, y: scale, z: scale });
    if (Math.abs(position.x) > 0.8) {//same as distorsion gain value
        object1.setAttribute('color', "#f5428d");
    }
    else {
        object1.setAttribute('color', "#4CC3D9");//same as gain value
    }
});
socket.on('hiroServe', function (data) {
    data = JSON.parse(data);
    position = data[0];
    rotation = data[1];
    // scale = data[2];//Actuaal scale
    scale = data[3];//Sound volume
    object2.setAttribute('position', position);
    object2.setAttribute('rotation', rotation);
    object2.setAttribute('scale', { x: scale, y: scale, z: scale });
    if (Math.abs(position.y) > 0.8) {//same as reverb mix value
        object2.setAttribute('color', "#f5428d");
    }
    else {
        object2.setAttribute('color', "#FFC65D");//same as gain value
    }

});



socket.on('custMarkerServe', function (data) {
    data = JSON.parse(data);
    markerId = data[0];
    position = data[1];
    rotation = data[2];
    scale = data[3];//Actuaal scale
    // scale = data[4];//Sound volume
    console.log(markerId)
    var customMarkerObj = document.getElementById(markerId);
    console.log(position)
    customMarkerObj.setAttribute('position', position);
    customMarkerObj.setAttribute('rotation', rotation);
    // customMarkerObj.setAttribute('scale', { x: scale, y: scale, z: scale });
    customMarkerObj.setAttribute('color', "#f54242");

});
