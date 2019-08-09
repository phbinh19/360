const TEXTURE_PATH = 'KVKTX1.jpg';

/**
 * Create the animation request.
 */
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (function() {
    return window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (callback, element) {
      // 60 FPS
      window.setTimeout(callback, 1000 / 60);
    };
  })();
}

/**
 * Set our global variables.
 */
var camera,
    scene,
    renderer,
    controls,
    container,
    effect,
    sphere;

var stereoEffect = 0;

init();
animate(); 

/**
 * Initializer function.
 */
function init() {
  // Build the container
  container = document.createElement( 'div' );
  document.body.appendChild( container );

  // Create the scene.
  scene = new THREE.Scene();
  
  rotationPoint = new THREE.Object3D();
  rotationPoint.position.set( 0, 0, 100 );
  scene.add( rotationPoint );
  
  // Create the camera.
  camera = new THREE.PerspectiveCamera(
   45, // Angle
    window.innerWidth / window.innerHeight, // Aspect Ratio.
    1, // Near view.
    23000 // Far view.
  );

  rotationPoint.add( camera );

  // Build the renderer.
  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  element = renderer.domElement;
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled;
  container.appendChild( element );

  // Build the controls.
  controls = new THREE.OrbitControls( camera, element );
  controls.enablePan = true;
  controls.enableZoom = true; 
  controls.maxDistance =  window.innerHeight / 4;
  controls.minDistance = 1;
  controls.target.copy( new THREE.Vector3( 0, 0, -100 ) );
  
  
  // Add the VR screen effect.
  effect = new THREE.StereoEffect(renderer);
  effect.eyeSeparation = 5;
    effect.setSize( window.innerWidth, window.innerHeight );
  
  // Add the light source.
  var light = new THREE.PointLight( 0xffffff, 1, 10000, 0 );
  light.position.set( 0, 0, 0 );
  scene.add( light );
  
  // Create materials for Enceladus. 
  loader = new THREE.TextureLoader();
  // loader.setCrossOrigin( 'https://s.codepen.io' );
  var texture = loader.load( TEXTURE_PATH);

  var material = new THREE.MeshPhongMaterial({
    color: "#ffffff",
    shininess: 10,
    map: texture,
    specular: "#000000",
    side: THREE.BackSide,
  });
  
  // Add the sphere container.
  var geometry = new THREE.SphereGeometry( 300, 128, 128 );
  material.side = THREE.BackSide;
  var sphere = new THREE.Mesh( geometry, material );
  sphere.position.set( 0, 0, 0 );
  sphere.rotation.y = Math.PI/1.8;
  sphere.side = THREE.BackSide;
  scene.add( sphere );
 
  window.addEventListener('resize', onWindowResize, false);
}

/**
 * Events to fire upon window resizing.
 */
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  effect.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Updates to apply to the scene while running.
 */
function update() {
  camera.updateProjectionMatrix();
}

/**
 * Render the scene.
 */
function render() {
  if (stereoEffect === 1) {
    effect.render(scene, camera);
  } else {
    renderer.render(scene, camera);
  }
}

/**
 * Animate the scene.
 */
function animate() {
  requestAnimationFrame(animate);
  update();
  render();
}

$(document).ready(function() {
  
  // Toggle the vr effect.
  $('#stereo-toggle').unbind('click');
  $('#stereo-toggle').click(function() {
    
    
    // Replace the text to hide/show screen.
    if ($('#stereo-toggle').text() == "Turn VR On") {
      stereoEffect = 1;
      onWindowResize();
      $('#stereo-toggle').text('Turn VR Off');
    } else {
      stereoEffect = 0;
      onWindowResize();
      $('#stereo-toggle').text('Turn VR On');
    }
  });
});