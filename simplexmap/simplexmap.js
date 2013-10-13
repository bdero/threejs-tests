var renderer, camera, scene;
var simplex;

function start() {
    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(
	45, window.innerWidth/window.innerHeight, 0.1, 1000
    );
    scene = new THREE.Scene();

    scene.add(camera);
    camera.position.y = 10;
    camera.position.z - 100;

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    simplex = new SimplexNoise();
    addSimplexPlane(0, 0, 100, 100, 0.1, 5);

    {
	var light = new THREE.PointLight(0xffffff);
	light.position.y = 15;

	scene.add(light);
    }

    Pointer.init();
    Pointer.move = moveCallback;
    document.addEventListener('click', clickCallback, false);

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
    // Generate plane mesh
    var mat = new THREE.MeshPhongMaterial({
	color: 0xffffff
    });
    var mesh = new THREE.Mesh(
	new THREE.PlaneGeometry(size, size, lengthSegments, lengthSegments), mat
    );

    mesh.rotation.x = -Math.PI/2
    mesh.position.x = x;
    mesh.position.z = z;

    // Offset geometry with simplex noise
    // Plane geometry total vertices length = (size + 1)^2
    var lVerts = lengthSegments + 1;
    var segSize = size/lengthSegments;
    for (var gz = 0; gz < lVerts; gz++)
	for (var gx = 0; gx < lVerts; gx++)
	    mesh.geometry.vertices[gz*lVerts + gx].y += simplex.noise2D(
		(x + gx*segSize)*simplexRatio, (z + gz*segSize)*simplexRatio
	    )*simplexAmplitude;

    mesh.geometry.computeFaceNormals();
    mesh.geometry.computeVertexNormals();

    scene.add(mesh);
}

function update() {
    requestAnimFrame(update);

    renderer.render(scene, camera);
}
