var renderer, camera, scene, controls;
var windowResize;
var timestamp, FRAME_GOAL = 1000/60;

var sphereMesh;

function start() {
    // Setup the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.physicallyBasedShading = true;
    document.body.appendChild(renderer.domElement);

    // Setup the camera
    camera = new THREE.PerspectiveCamera(
	45, window.innerWidth/window.innerHeight, 0.1, 1000
    );
    camera.position.setX(100);

    windowResize = THREEx.WindowResize(renderer, camera);

    // Setup the scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 0, 1000);
    scene.add(camera);

    // Setup the light
    var light = new THREE.PointLight(0xffffff);
    light.position.addScalar(20); // Really weird artifacts show up when the light is in the same position as the camera..
    camera.add(light);

    // Setup orbit controls
    controls = new THREE.OrbitControls(camera);

    // Setup a sphere mesh
    var geo = new THREE.SphereGeometry(40, 16, 12);
    var mat = new THREE.MeshPhongMaterial({ color: 0x33dd44 });
    sphereMesh = new THREE.Mesh(geo, mat);
    scene.add(sphereMesh);

    // Start updating
    timestamp = Date.now();
    update();
}

function initSphere() {
}

function update() {
    requestAnimFrame(update);
    var ct = Date.now();
    var dt = (ct - timestamp)/FRAME_GOAL;
    timestamp = ct;

    controls.update();

    sphereMesh.rotation.x += 0.001*dt;
    sphereMesh.rotation.y += 0.002*dt;
    sphereMesh.rotation.z += 0.003*dt;

    renderer.render(scene, camera);
}
