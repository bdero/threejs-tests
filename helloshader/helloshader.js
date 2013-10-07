var renderer, camera, scene;
var uniforms, time;

function start() {
    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(
	45, window.innerWidth/window.innerHeight, 0.1, 1000
    );
    scene = new THREE.Scene();

    scene.add(camera);
    camera.position.z = 300;

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    uniforms = {
	amplitude: {
	    type: 'f',
	    value: 0
	}
    };
    addSphere(0, 0, 0);

    time = 0;
    update();
}

function update() {
    uniforms.amplitude.value = Math.sin(time/10);
    time += 1;

    renderer.render(scene, camera);

    requestAnimFrame(update);
}

function addSphere(x, y, z) {
    var attributes = {
	displacement: {
	    type: 'f',
	    value: []
	}
    };

    var vert = [
	'uniform float amplitude;',
	'attribute float displacement;',
	'varying vec3 vNormal;',

	'void main() {',
	    'vNormal = normal;',
	    'vec3 newPosition = position + normal*vec3(displacement*amplitude);',

            'gl_Position = projectionMatrix*modelViewMatrix*vec4(newPosition, 1.0);',
	'}'
    ].join('');
    var frag = [
	'varying vec3 vNormal;',

	'void main() {',
	    'vec3 light = vec3(0.5, 0.2, 1.0);',
	    'light = normalize(light);',
	    'float dProd = max(0.0, dot(vNormal, light));',

	    'gl_FragColor = vec4(dProd, dProd, dProd, 1.0);',
	'}'
    ].join('');

    var mat = new THREE.ShaderMaterial({
	attributes: attributes,
	uniforms: uniforms,
	vertexShader: vert,
	fragmentShader: frag
    });

    var sphere = new THREE.Mesh(
	new THREE.SphereGeometry(
	    50, 16, 16
	),
	mat
    );

    for (var i = 0; i < sphere.geometry.vertices.length; i++) {
	attributes.displacement.value.push(Math.random()*30);
    }

    scene.add(sphere);

    sphere.position.x = x;
    sphere.position.y = y;
    sphere.position.z = z;
}
