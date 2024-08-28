import * as THREE from 'three';
import './style.css';
import { PuppetPart } from './models/PuppetPart.js';  
import { setupEventListeners } from './common/EventHandlers.js'; 

// Create a scene
const scene = new THREE.Scene();

// Create the body part
const body = new PuppetPart('./assets/puppet_01/body.png');

// Create and display axis labels
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

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
// camera.lookAt(mesh.position);
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

/*
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

    // Now create the arm and hand
    const arm = new PuppetPart('./assets/puppet_01/arm.png');
    arm.onReady = () => {
        arm.addToScene(scene);

        // Position arm relative to body
        const bodyWidth = body.width || 1;  // Use body's width to calculate relative position
        const bodyHeight = body.height || 1;
        arm.setPosition(body.mesh.position.x - bodyWidth / 4 - 1,
            body.mesh.position.y + bodyHeight / 8 - 1, 0.5);

        // Create the hand part
        const hand = new PuppetPart('./assets/puppet_01/hand.png');
        hand.onReady = () => {
            hand.addToScene(scene);

            // Position hand relative to arm
            const armHeight = arm.height || 1;  // Use arm's height to calculate relative position
            hand.setPosition(arm.mesh.position.x - 1, arm.mesh.position.y - armHeight / 2 - 1.5, 0.5);
        };
    };
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

// Movement limits
const limits = {
    x: { min: -10, max: 10 },
    y: { min: -5, max: 5 },
    z: { min: -50, max: 35 },
};

// Pass all necessary components to the event handler
setupEventListeners({ body, renderer, camera }, limits);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
*/
