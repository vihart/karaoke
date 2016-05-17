// Setup three.js WebGL renderer
var renderer = new THREE.WebGLRenderer( { antialias: true } );

// Append the canvas element created by the renderer to document body element.
document.body.appendChild( renderer.domElement );

//Create a three.js scene
var scene = new THREE.Scene();

//Create a three.js camera
var camera = new THREE.PerspectiveCamera( 110, window.innerWidth / window.innerHeight, 2, 10000 );
scene.add(camera);

//Apply VR headset positional data to camera.
var controls = new THREE.VRControls( camera );

//Apply VR stereo rendering to renderer
var effect = new THREE.VREffect( renderer );
effect.setSize( window.innerWidth, window.innerHeight );

/*
Create, position, and add 3d objects
*/
var pi = 3.141592653589793238;


var light2 = new THREE.PointLight( 0xffffff, 1, 100 );
light2.intensity = 1;
scene.add( light2 );

var geometry = new THREE.DodecahedronGeometry(10);
var material = new THREE.MeshPhongMaterial();
material.side = THREE.DoubleSide;
var dodecahedron = new THREE.Mesh( geometry, material );
dodecahedron.position.z = -20;
scene.add(dodecahedron);

// var tetrahedron = new THREE.Mesh(new THREE.TetrahedronGeometry(10), new THREE.MeshPhongMaterial({color: 0xEE0443, wireframe: true}));
// var tetrahedronIncrement = 0;
// var z = Math.sin(-3/2*pi/1000*tetrahedronIncrement)*40;
// var x = Math.cos(-3/2*pi/1000*tetrahedronIncrement)*40;
// tetrahedron.position.set(x, 0, z);
// scene.add(tetrahedron);

var cubes = [];
for (var i = 0; i < 3; i++) {
  cubes[i] = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshPhongMaterial());
  cubes[i].material.color.setHSL(Math.random(),0.5,0.5);
  cubes[i].position.z = i*(-20) + 50;
  cubes[i].position.x = i*(-20);
  scene.add(cubes[i]);
}

var floor = new THREE.Mesh( new THREE.PlaneBufferGeometry( 1000, 1000, 1, 1 ), new THREE.MeshPhongMaterial( { color: 0x404040, side: THREE.DoubleSide } ) );
floor.rotation.x = pi/2;
floor.position.y = -50;
floor.material.color.setHSL(Math.random(),0.5,0.5);
scene.add( floor );

//karaoke sound stuff

context = new AudioContext;
oscillator = context.createOscillator();
oscillator.frequency.value = 200;

oscillator.connect(context.destination);

oscillator.start(0);

//random melody rhythm input, will be from karaoke code instead
var randomWordNumber = 1 + Math.floor(8*Math.random());
var randomSyllables = [];
for(var i = 0; i < 8; i++){
  var randomWord = Math.floor(randomWordNumber*Math.random);
  randomSyllables[randomWord] += 1;
}

//melody for rhythm
var melodyArray = getRhythmStarts(syllableInput);
var melodyNotes = [];
for (var i = 0; i<melodyArray.length; i++){
  melodyNotes[i] = 200 + 100*Math.random();
}

//beat
var kickSound = document.querySelector('#kick');
kickSound.volume = 1;
var snareSound = document.querySelector('#snare');
snareSound.volume = 0.3;
var hatSound = document.querySelector('#hat');
hatSound.volume = 0.3;

var kickArray = makeBeat(kickProbs);
var snareArray = makeBeat(snareProbs);
var hatArray = makeBeat(hatProbs);

var t = 0;
var measureLength = 1 + Math.random() + Math.random();
var increment = 0.01;
var fudgeFactor = 0.01;

var gravity = 10; //for cube visuals

/*
Request animation frame loop function
*/
function animate() {

  //karaoke playing sound stuff
  t += increment;

  //melody:
  for(var i = 0; i < melodyArray.length; i++){
    if (Math.abs((t%measureLength) - (melodyArray[i]*measureLength)) < fudgeFactor){
      oscillator.frequency.value = melodyNotes[i];
      dodecahedron.material.color.setHSL(400/melodyNotes[i],0.5,0.5); //change dodec color with melody
    }
  }

  //beat:
  for(var i = 0; i < kickArray.length; i++){
    if (Math.abs((t%measureLength) - (kickArray[i]*measureLength)) < fudgeFactor){
      kickSound.play();
      cubes[0].position.y = 1;//pop cube back up
    }
  }
  for(var i = 0; i < snareArray.length; i++){
    if (Math.abs((t%measureLength) - (snareArray[i]*measureLength)) < fudgeFactor){
      snareSound.play();
      cubes[1].position.y = 1;//pop cube back up
    }
  }
  for(var i = 0; i < hatArray.length; i++){
    if (Math.abs((t%measureLength) - (hatArray[i]*measureLength)) < fudgeFactor){
      hatSound.play();
      cubes[2].position.y = 1;//pop cube back up
    }
  }

  //make popped cubes go back down:
  for(var i = 0; i < 3; i++){
    cubes[i].position.y -= gravity;
  }

  //non-karaoke stuff:

  // Apply any desired changes for the next frame. In this case, we rotate our object.
  dodecahedron.rotation.x += 0.01;
  dodecahedron.rotation.y += 0.005;

  // tetrahedron.rotation.x += 0.01;
  // tetrahedronIncrement++;
  // if (tetrahedronIncrement >= 1000) {
  //   tetrahedronIncrement = 0;
  // }
  // var z = Math.sin(-2*pi/1000*tetrahedronIncrement)*80;
  // var x = Math.cos(-2*pi/1000*tetrahedronIncrement)*80;
  // tetrahedron.position.set(x, 0, z);

  //Update VR headset position and apply to camera.
  controls.update();

  // Render the scene through the VREffect.
  effect.render( scene, camera );
  requestAnimationFrame( animate );
}

animate();	// Kick off animation loop

/*
Listen for click event to enter full-screen mode.
We listen for single click because that works best for mobile for now
*/
document.body.addEventListener( 'click', function(){
  effect.setFullScreen( true );
})

/*
Listen for keyboard events
*/
function onkey(event) {
  event.preventDefault();

  if (event.keyCode == 90) { // z
    controls.resetSensor(); //zero rotation
  } else if (event.keyCode == 70 || event.keyCode == 13) { //f or enter
    effect.setFullScreen(true) //fullscreen
  }
};
window.addEventListener("keydown", onkey, true);

/*
Handle window resizes
*/
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  effect.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize, false );
