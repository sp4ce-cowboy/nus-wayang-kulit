import * as THREE from 'three';
import './style.css';
import { PuppetPart3D } from './models/PuppetPart3D.js';
import { setupEventListeners } from './common/EventHandlers.js';
import { CCDIKSolver } from 'three/addons/animation/CCDIKSolver.js';

import { 
    runTestSequence,
    runProlongedTestSequence,
    runArmTestSequence
} from '../tests/Simulation.js';

import { 
    IS_SIMULATION_ACTIVE,
    IS_MANUAL_PUPPET_INPUT,
    SHOW_HELPERS
} from './common/ControlPanel.js';

const currentTest = runProlongedTestSequence

// Function to load the JSON configuration
async function loadPuppetConfig(puppetName) {
    const response = await fetch(`./assets/${puppetName}/${puppetName}.json`);
    if (!response.ok) {
        throw new Error(`Failed to load config for puppet: ${puppetName}`);
    }
    return await response.json();
}

async function init(puppetName) {
    try {
        const config = await loadPuppetConfig(puppetName);
        
        // Initialize the body, arm, and hand using data from the JSON file
        const body = new PuppetPart3D(config.body.path, config.body.material, ...config.body.scale);
        const arm = new PuppetPart3D(config.arm.path, config.arm.material, ...config.arm.scale);
        const hand = new PuppetPart3D(config.hand.path, config.hand.material, ...config.hand.scale);
        
        const armPivot = new THREE.Group();
        const handPivot = new THREE.Group();
        const endEffector = new THREE.Group();
        
        const armPivotHelper = new THREE.AxesHelper(0.1);
        const handPivotHelper = new THREE.AxesHelper(0.1);
        const endEffectorHelper = new THREE.AxesHelper(0.1);
        
        if (SHOW_HELPERS) {
            armPivot.add(armPivotHelper);
            handPivot.add(handPivotHelper); 
            endEffector.add(endEffectorHelper);
        }
        
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
                    
                    endEffector.position.set(...config.hand.endEffectorPosition);
                    handPivot.add(endEffector);  // Attach the endEffector to the hand
                };
            };
        };
        
        // Extract initial positions and rotations from the JSON config
        const initialState = {
            body: { position: config.body.position, rotation: config.body.rotation },
            armPivot: { position: config.arm.pivotPosition, rotation: config.arm.pivotRotation },
            handPivot: { position: config.hand.pivotPosition, rotation: config.hand.pivotRotation }
        };
        
        setupEventListeners({ body, armPivot, handPivot, endEffector, renderer, camera }, config.limits, initialState);
        
    } catch (error) {
        console.error(error);
        alert(`Failed to load puppet: ${puppetName}`);
    }
}

if (IS_MANUAL_PUPPET_INPUT) {
    const puppetName = prompt("Enter the puppet name (e.g., 'puppet_01'):");
    
    if (puppetName) {
        init(puppetName);
    } else {
        alert('Puppet name is required!');
    }
    
} else {
    const puppetName = 'puppet_02'; // Default puppet
    init(puppetName)
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xfdf4dc, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 1);
scene.add(camera);

const raycaster = new THREE.Raycaster(); // For future use, if needed

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('.webgl'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

if (IS_SIMULATION_ACTIVE) {
    // Trigger the test sequence 1000 ms after the page loads
    window.addEventListener('load', () => {
        setTimeout(currentTest, 1000);
    });
}