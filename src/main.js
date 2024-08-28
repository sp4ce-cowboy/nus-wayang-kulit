import * as THREE from 'three';
import './style.css';
import { PuppetPart } from './models/PuppetPart.js';  
import { setupEventListeners } from './common/EventHandlers.js'; 

// Create a scene
const scene = new THREE.Scene();

// Create the body part
const body = new PuppetPart('./assets/puppet_01/body.png');

// When the geometry is ready, add the body to the scene and set its position
body.onReady = () => {
    body.addToScene(scene);
    body.setPosition(0, 0, 0); // Set initial position

    // Movement limits
    const limits = {
        x: { min: -10, max: 10 },
        y: { min: -5, max: 5 },
        z: { min: -50, max: 35 },
    };

    // Pass all necessary components to the event handler
    setupEventListeners({ body, renderer, camera }, limits);
};

// Size of window
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Create a camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 30;

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