
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(12); // Adjusted for better starting view
camera.position.setX(0);
camera.position.setY(1);
renderer.render(scene, camera);

// Torus
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// Lighting
const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(pointLight, ambientLight);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}
Array(200).fill().forEach(addStar);

// Background
const spaceTexture = new THREE.TextureLoader().load('./space.jpg');
scene.background = spaceTexture;

// Avatar (Jeff)
const jeffTexture = new THREE.TextureLoader().load('./acm.png');
const jeff = new THREE.Mesh(
  new THREE.BoxGeometry(2.5, 2.5, 2.5), // Smaller Jeff
  new THREE.MeshStandardMaterial({ map: jeffTexture })
);
scene.add(jeff);

// Moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const moonNormalTexture = new THREE.TextureLoader().load('normal.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: moonNormalTexture })
);
scene.add(moon);

// Adjusted Positions
jeff.position.set(0, 0, 5); // Jeff starts closer but smaller
moon.position.set(-8, 0, 20); // Moon stays in the background

// Camera & Jeff Animation on Scroll
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  // Move Jeff backward and shrink as we scroll
  jeff.position.z = 5 + t * 0.02; // Moves back smoothly
  jeff.scale.setScalar(Math.max(0.8, 2.5 + t * 0.005)); // Shrinks but not too small

  // Rotate moon slightly for effect
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;

  // Move camera back to reveal space
  camera.position.z = 12 + t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = 1 + t * -0.0005;
}
document.body.onscroll = moveCamera;

// Handle Window Resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

// Animation Loop
function animate() {
  window.requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;
  renderer.render(scene, camera);
}
animate();
