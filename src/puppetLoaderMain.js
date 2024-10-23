import * as THREE from 'three';
import './style.css';
import { PuppetPart3D } from './models/PuppetPart3D.js';
import { setupEventListeners } from './common/EventHandlers.js';


// Function to load the JSON configuration
async function loadPuppetConfig(puppetName) {
    const response = await fetch(`./assets/${puppetName}/${puppetName}.json`);
    return await response.json();
}

async function init(puppetName) {
    const config = await loadPuppetConfig(puppetName);

    // Initialize the body, arm, and hand using data from the JSON file
    const body = new PuppetPart3D(config.body.path, config.body.material);
    const arm = new PuppetPart3D(config.arm.path, config.arm.material, ...config.arm.scale);
    const hand = new PuppetPart3D(config.hand.path, config.hand.material, ...config.hand.scale);

    const armPivot = new THREE.Group(); // Pivot for arm
    const handPivot = new THREE.Group(); // Pivot for hand

    const armPivotHelper = new THREE.AxesHelper(0.1);
    armPivot.add(armPivotHelper); 

    const handPivotHelper = new THREE.AxesHelper(0.1);
    handPivot.add(handPivotHelper); 

    body.onReady = () => {
        body.addToScene(scene);
        body.setPosition(...config.body.position);
        body.setRotation(...config.body.rotation);

        arm.onReady = () => {
            armPivot.add(arm.mesh);
            arm.mesh.position.set(...config.arm.position);
            armPivot.position.set(...config.arm.pivotPosition);
            arm.setRotation(...config.arm.rotation);
            body.mesh.add(armPivot);

            hand.onReady = () => {
                handPivot.add(hand.mesh);
                hand.mesh.position.set(...config.hand.position);
                handPivot.position.set(...config.hand.pivotPosition);
                hand.setRotation(...config.hand.rotation);
                armPivot.add(handPivot);
            };
        };
    };

    setupEventListeners({
        body, armPivot, handPivot, renderer, camera
    }, config.limits);
}

// Call the init function with the puppet name
init("puppet_01");

// Set up renderer and camera (existing code remains unchanged)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);

// Add ambient light (general soft light)
const ambientLight = new THREE.AmbientLight(0xffffff, 3); // Color and intensity
scene.add(ambientLight);

// Add directional light (acts like sunlight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('.webgl') });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 1);
scene.add(camera);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();