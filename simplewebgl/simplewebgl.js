var WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
var VIEW_ANGLE = 45, ASPECT = WIDTH/HEIGHT, NEAR = 0.1, FAR = 1000;

var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
var scene = new THREE.Scene();

start();

function start() {
    scene.add(camera);
    camera.position.z = 300;

    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);

    var r = function() { return (Math.random() - 0.5)*2 };
    for (var i = 0; i < 200; i++)
	addSphere(r()*250, r()*250, r()*250, r()*50);

    var lightDistance = 350;
    for (var i = 0; i < 10; i++) {
	var alt = Math.random()*Math.PI*2;
	var azi = Math.random()*Math.PI*2;

	addPointLight(
	    Math.sin(alt)*Math.cos(azi)*lightDistance,
	    Math.cos(alt)*lightDistance,
	    Math.sin(alt)*Math.sin(azi)*lightDistance
	);
    }

    renderer.render(scene, camera);
}

function addSphere(x, y, z, radius) {
    var sphereMaterial = new THREE.MeshPhongMaterial({
	color: Math.floor(Math.random()*0x1000000)
    });

    var segments = 16, rings = 16;
    var sphere = new THREE.Mesh(
	new THREE.SphereGeometry(
	    radius,
	    segments,
	    rings
	),
	sphereMaterial
    );

    scene.add(sphere);

    sphere.position.x = x;
    sphere.position.y = y;
    sphere.position.z = z;
}

function addPointLight(x, y, z) {
    var pointLight = new THREE.PointLight(Math.floor(Math.random()*0x1000000));

    pointLight.position.x = x;
    pointLight.position.y = y;
    pointLight.position.z = z;

    scene.add(pointLight);
}
