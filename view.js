
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


//data = [position,rotation,scale,volume]

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