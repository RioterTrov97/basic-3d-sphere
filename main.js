import './style.css';
import * as Three from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene
const scene = new Three.Scene();

// Create a sphere
const geometry = new Three.SphereGeometry(3, 64, 64);
const material = new Three.MeshStandardMaterial({
	color: '#00ffa3',
	roughness: 0.5,
});

// Mesh is combination of geometry and material
const mesh = new Three.Mesh(geometry, material);

// Now add the mesh to scene
scene.add(mesh);

// area sizes for rendering
const sizes = { width: window.innerWidth, height: window.innerHeight };

// Add light
const light = new Three.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10);
light.intensity = 1.2;
scene.add(light);

// Add a camera
const camera = new Three.PerspectiveCamera(
	45,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.z = 20;
scene.add(camera);

// Render scene on screen using canvas
const canvas = document.querySelector('.webgl');
const renderer = new Three.WebGL1Renderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// Add controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

// Add a listener to window sizes
window.addEventListener('resize', () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// update camera and renderer
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();
	renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
	controls.update();
	renderer.render(scene, camera);
	window.requestAnimationFrame(loop);
};

loop();

// do timeline magic
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(mesh.scale, { z: 0.5, x: 0.5, y: 0.5 }, { z: 1, x: 1, y: 1 });
tl.fromTo('nav', { y: '-100%' }, { y: '0%' });
tl.fromTo('title', { opacity: 0 }, { opacity: 1 });

// Mouse Animation Colorrr
let mouseDown = false;
window.addEventListener('mousedown', () => (mouseDown = true));
window.addEventListener('mouseup', () => (mouseDown = false));
window.addEventListener('mousemove', (e) => {
	if (mouseDown) {
		const rgb = [
			Math.round((e.pageX / sizes.width) * 255),
			Math.round((e.pageY / sizes.height) * 255),
			150,
		];

		// lets animate
		const { r, g, b } = new Three.Color(`rgb(${rgb.join(',')})`);
		gsap.to(mesh.material.color, { r, g, b });
	}
});
