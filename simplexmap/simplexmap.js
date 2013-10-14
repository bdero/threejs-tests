var renderer, camera, scene;
var windowResize, simplex;
var timestamp, FRAME_GOAL = 1000/60; // Adjust values to 60 frames/ms

var SIMPLEX_AMPLITUDE = 10, SIMPLEX_RATIO = 0.01;
var MOVE_SPEED = 1;

function start() {
    // Setup three.js

    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(
	45, window.innerWidth/window.innerHeight, 0.1, 1000
    );
    renderer.setSize(window.innerWidth, window.innerHeight);
    windowResize = THREEx.WindowResize(renderer, camera);

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 0, 250);

    scene.add(camera);
    camera.lookVector = new THREE.Vector3(0, 0, -1);
    camera.upVector = new THREE.Vector3(0, 1, 0);

    document.body.appendChild(renderer.domElement);

    // Add elements to the scene

    simplex = new SimplexNoise();
    addSimplexPlane(0, 0, 500, 100, SIMPLEX_RATIO, SIMPLEX_AMPLITUDE);

    {
	var light = new THREE.PointLight(0xffffff);
	light.position.y = 15;

	scene.add(light);
    }

    // Setup input

    Pointer.init();
    Pointer.move = moveCallback;
    document.addEventListener('click', clickCallback, false);

    keyboard = new THREEx.KeyboardState();

    // Start update loop

    timestamp = Date.now();
    update();
}

function clickCallback() {
    if (!Pointer.isLocked())
	Pointer.lock();
}

function moveCallback(event) {
    console.log(event.movementX, event.movementY);
}

function addSimplexPlane(x, z, size, lengthSegments, simplexRatio, simplexAmplitude) {
    var mat = new THREE.MeshPhongMaterial({ color: 0xffffff });

    // Generate plane geometry
    var geo = new THREE.PlaneGeometry(size, size, lengthSegments, lengthSegments)

    // Transform
    geo.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

    // Offset geometry with simplex noise
    // Plane geometry total vertices length = (size + 1)^2
    var lVerts = lengthSegments + 1;
    var segSize = size/lengthSegments;
    for (var gz = 0; gz < lVerts; gz++)
	for (var gx = 0; gx < lVerts; gx++)
	    geo.vertices[gz*lVerts + gx].y += simplex.noise2D(
		((x + gx*segSize) - size/2)*simplexRatio,
		((z + gz*segSize) - size/2)*simplexRatio
	    )*simplexAmplitude;

    geo.computeFaceNormals();
    geo.computeVertexNormals();

    var mesh = new THREE.Mesh(geo, mat);

    //mesh.rotation.x = -Math.PI/2
    mesh.position.x = x;
    mesh.position.z = z;

    scene.add(mesh);
}

function update() {
    requestAnimFrame(update);
    var ct = Date.now()
    var dt = (ct - timestamp)/FRAME_GOAL;
    timestamp = ct;

    updateMovement(dt);

    // Render

    renderer.render(scene, camera);
}

function updateMovement(dt) {
    // Find direction vectors

    var forwardDirection = camera.lookVector.clone();
    forwardDirection.setY(0);
    forwardDirection.normalize();

    var strafeDirection = new THREE.Vector3();
    strafeDirection.crossVectors(forwardDirection, camera.upVector);

    // Find scale based on input

    var forwardScale = 0;
    if (keyboard.pressed('W')) { forwardScale += 1 }
    if (keyboard.pressed('S')) { forwardScale -= 1 }
    forwardDirection.multiplyScalar(forwardScale);

    var strafeScale = 0;
    if (keyboard.pressed('D')) { strafeScale += 1 }
    if (keyboard.pressed('A')) { strafeScale -= 1 }
    strafeDirection.multiplyScalar(strafeScale);

    // Apply changes

    if (forwardScale || strafeScale) {
	var moveDirection = forwardDirection.clone();
	moveDirection.add(strafeDirection);
	moveDirection.normalize();
	moveDirection.multiplyScalar(MOVE_SPEED);
	camera.position.add(moveDirection);
    }

    camera.position.setY(simplex.noise2D(
	camera.position.x*SIMPLEX_RATIO,
	camera.position.z*SIMPLEX_RATIO
    )*SIMPLEX_AMPLITUDE + 10);
}
