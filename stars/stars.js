// Global variables

var camera, scene, renderer;
var mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
var particles = [];

// Begin

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

init();

// Functions

function init() {
    camera = new THREE.PerspectiveCamera(80, window.innerWidth/window.innerHeight, 1, 4000);
    camera.position.z = 1000;

    scene = new THREE.Scene();
    scene.add(camera);

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    makeParticles();

    document.addEventListener('mousemove', onMouseMove, false);

    update();
}

function update() {
    requestAnimFrame(update);
    updateParticles();
    camera.position.x = mouseX - window.innerWidth/2;
    renderer.render(scene, camera);
}

function makeParticles() {
    var particle, material;
    for (var zpos = -1000; zpos < 1000; zpos += 20) {
	material = new THREE.ParticleCanvasMaterial({color: 0xffffff, program: particleRender});
	particle = new THREE.Particle(material);

	particle.position.x = Math.random()*1000 - 500;
	particle.position.y = Math.random()*1000 - 500;
	particle.position.z = zpos;

	particle.scale.x = particle.scale.y = 10;

	scene.add(particle);
	particles.push(particle);
    }
}

function particleRender(context) {
    context.beginPath();
    context.arc(0, 0, 1, 0, Math.PI*2, true);
    //context.closePath();
    context.fill();
}

function updateParticles() {
    for (var i = 0; i < particles.length; i++) {
	particle = particles[i];
	particle.position.z += mouseY*0.1;

	if (particle.position.z > 1000) particle.position.z -= 2000;
    }
}

function onMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}
