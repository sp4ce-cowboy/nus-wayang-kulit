import * as THREE from 'three';
import './style.css';
import { PuppetPart3D } from './models/PuppetPart3D.js';  
import { setupEventListeners } from './common/EventHandlers.js';

// Create a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333); // Dark grey background

// Add ambient light (general soft light)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Color and intensity
scene.add(ambientLight);

// Add directional light (acts like sunlight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10); // Position the light source
scene.add(directionalLight);

// Create the body part with OBJ and MTL files
const body = new PuppetPart3D(
    './assets/puppet_01/puppet.obj',
    './assets/puppet_01/puppet.mtl'
);

// When the model is ready, add it to the scene and set its position
body.onReady = () => {
    body.addToScene(scene);
    body.setPosition(0, 0, 0); // Set initial position
    body.setPosition(-3, 4, 0); // Adjusted position
    body.setRotation(1.7, 0, 0); // Adjusted rotation (in radians)

    const limits = {
        x: { min: -10, max: 10 },
        y: { min: -5, max: 5 },
        z: { min: -50, max: 35 },
    };

    setupEventListeners({ body, renderer, camera }, limits);
};

// Set up the camera
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(0, 0, 30);
scene.add(camera);

// Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();