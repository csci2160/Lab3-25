// Keep globals clean.
var renderer = null;
var scene = null;
var camera = null;
var view = null;
var timer = null;

// Initialize a scene with an id, model, and colour.
function initScene(modelSource, color)
  {
  var container = document.getElementById('container');
  
  var parent = document.getElementById('threedpane');
  
  // Create a renderer.
  renderer =
    new
      THREE.WebGLRenderer(
        {
        antialias: true,
        alpha: true
        });

  // Use the full window size with clear background.
  renderer.setSize(parent.offsetWidth, parent.offsetHeight);
  renderer.setClearColor(0x000000, 0);

  // Add the renderer to the DOM.
  container.appendChild(renderer.domElement);

  view = renderer.domElement;
  
  // Create a scene.
  scene = new THREE.Scene();

  // Create a camera.
  camera =
    new
      THREE.PerspectiveCamera(
        75,
        container.offsetWidth / container.offsetHeight,
        1,
        1000 );

  // Don't get too close.
  camera.position.z = 10;

  // Add the camera to the scene.
  scene.add(camera);

  // Add some simple controls to look at the pretty model.
  controls = 
    new THREE.TrackballControls(
      camera, 
      renderer.domElement);

  // Setup the controls with some good defaults.
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.2;

  controls.noZoom = false;
  controls.noPan = false;

  controls.staticMoving = false;
  controls.dynamicDampingFactor = 0.3;

  controls.minDistance = 1.1;
  controls.maxDistance = 100;

  // [ rotateKey, zoomKey, panKey ]
  controls.keys = [ 16, 17, 18 ];

  // Setup some mood lighting.
  var dirLight = new THREE.DirectionalLight(0xffffff, 0.95);

  dirLight.position.set(-3, 3, 7);
  dirLight.position.normalize();
  scene.add(dirLight);
 
  // And some additional lighting.
  var pointLight = new THREE.PointLight(0xFFFFFF, 5, 50);

  pointLight.position.set(10, 20, -10);
  scene.add(pointLight);

  // Now load the model.
  var jsonLoader = new THREE.JSONLoader();

  jsonLoader.load(
    modelSource,
    function(geometry)
      {
      // Compute vertex normals to make the entire model smooth.
      geometry.computeVertexNormals();

      var model =
        new
          THREE.Mesh(
            geometry, new THREE.MeshPhongMaterial({color: color}));
      
      // Add the model.
      scene.add(model);

      $(parent).css('background-image', 'none');

      requestAnimationFrame(
        function()
          {
          renderer.render(scene, camera);
          });
      });
  }

// Start listening for events.
function listenToEvents()
  {
  // Listen for the start of user interaction.
  view.addEventListener('mousedown', startListeningToEvents);
  view.addEventListener('touchstart', startListeningToEvents);
  
  // The mouse wheel event is special, just manually update it.
  view.addEventListener('mousewheel', updateMouseWheel);
  view.addEventListener('DOMMouseScroll', updateMouseWheel);
  }

// Manually update the display in response to mouse wheel events.
function updateMouseWheel()
  {
  requestAnimationFrame(
    function()
      {
      controls.update();

      renderer.render(scene, camera);
      });
  }
 
// Start listening for mouse events. 
function startListeningToEvents()
  {
  // Setup a timer to update the display independently from user interface events.
  timer = 
    setInterval(
      function()
        {
        requestAnimationFrame(
          function()
            {
            controls.update();
      
            renderer.render(scene, camera);
            });
        },
      10);
      
  // Now listen for user interface vents.
  view.addEventListener('mouseup', stopListeningToEvents);
  view.addEventListener('mouseout', stopListeningToEvents);
  view.addEventListener('touchend', stopListeningToEvents);
  }

// Stop listening for user interface events.  
function stopListeningToEvents()
  {
  // Stop updating the display.
  clearInterval(timer);
  
  view.removeEventListener('mouseup', stopListeningToEvents);
  view.removeEventListener('mouseout', stopListeningToEvents);
  view.removeEventListener('touchend', stopListeningToEvents);
  }
  
// Once the document is ready, setup the interface and bind functions to 
// DOM elements.
$(document).ready(
  function ()
    {
    // Add a new container.
    $('#threedpane').append('<div id="container"></div>');
    
    initScene("models/teapot.js", 0x009900);
    
    listenToEvents();
    });
