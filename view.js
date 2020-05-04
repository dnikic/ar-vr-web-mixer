
//AFrame


// var scene = document.querySelector('a-scene');
// console.log(scene.querySelector('#redBox'));
// var sceneEl = document.querySelector('a-scene');
// var object1 = sceneEl.querySelector("#object1");
// var object2 = sceneEl.querySelector("#object2");

var object1 = document.getElementById("object1");
var object2 = document.getElementById("object2");
object1.setAttribute('position', { x: -2, y: 1, z: -3 });
object2.setAttribute('position', { x: 1, y: 1, z: -3 });

socket.on('kanjiServe', function (data) {
    console.log(data)
    // console.log(JSON.parse(data));
});
socket.on('hiroServe', function (data) {
    console.log(data)
    console.log(JSON.parse(data));
});