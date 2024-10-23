import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import './style.css';
import { PuppetPart3D } from './models/PuppetPartCannon.js';
import { setupEventListeners } from './common/EventHandlersCannon.js';
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

const currentTest = runArmTestSequence;

// Initialize Cannon.js physics world
const physicsWorld = new CANNON.World();
physicsWorld.gravity.set(0, -9.82, 0); // Gravity pointing downward
physicsWorld.broadphase = new CANNON.NaiveBroadphase(); // Broadphase algorithm
physicsWorld.solver.iterations = 10; // Number of iterations to resolve constraints

const defaultMaterial = new CANNON.Material('default');
const contactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: 0.1,
    restitution: 0.7, // Bounciness
});
physicsWorld.addContactMaterial(contactMaterial);

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

        // Initialize body, arm, and hand using data from the JSON
        const body = new PuppetPart3D(
            config.body.path, 
            config.body.material, 
            ...config.body.scale,
            physicsWorld
        );
        const arm = new PuppetPart3D(
            config.arm.path, 
            config.arm.material, 
            ...config.arm.scale,
            physicsWorld
        );
        const hand = new PuppetPart3D(
            config.hand.path, 
            config.hand.material, 
            ...config.hand.scale,
            physicsWorld
        );

        const armPivot = new THREE.Group();
        const handPivot = new THREE.Group();

        const armPivotHelper = new THREE.AxesHelper(0.1);
        const handPivotHelper = new THREE.AxesHelper(0.1);

        if (SHOW_HELPERS) {
            armPivot.add(armPivotHelper);
            handPivot.add(handPivotHelper);
        }

        // Add objects to the scene and physics world
        body.onReady = () => {
            body.addToScene(scene);
            physicsWorld.addBody(body.physicsBody);
            body.setPosition(...config.body.position);
            body.setRotation(...config.body.rotation);

            arm.onReady = () => {
                armPivot.add(arm.mesh);
                arm.mesh.position.set(...config.arm.position);
                armPivot.position.set(...config.arm.pivotPosition);
                arm.setRotation(...config.arm.rotation);
                body.mesh.add(armPivot);
                physicsWorld.addBody(arm.physicsBody); // Add arm to physics world

                hand.onReady = () => {
                    handPivot.add(hand.mesh);
                    hand.mesh.position.set(...config.hand.position);
                    handPivot.position.set(...config.hand.pivotPosition);
                    hand.setRotation(...config.hand.rotation);
                    armPivot.add(handPivot);
                    physicsWorld.addBody(hand.physicsBody); // Add hand to physics world
                };
            };
        };

        // Extract initial positions and rotations from the JSON config
        const initialState = {
            body: { position: config.body.position, rotation: config.body.rotation },
            armPivot: { position: config.arm.pivotPosition, rotation: config.arm.pivotRotation },
            handPivot: { position: config.hand.pivotPosition, rotation: config.hand.pivotRotation }
        };

        setupEventListeners(
            { body, armPivot, handPivot, renderer, camera },
            config.limits,
            initialState
        );
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
    const puppetName = 'puppet_01'; // Default puppet
    init(puppetName);
}

// Setup Three.js scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);

const ambientLight = new THREE.AmbientLight(0xffffff, 2.5); // Color and intensity
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('.webgl') });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 1);
scene.add(camera);

// Animation loop to sync physics and render the scene
function animate() {
    requestAnimationFrame(animate);

    const timeStep = 1 / 60; // 60 FPS

    // Step the physics world
    physicsWorld.step(timeStep);

    // Sync meshes with physics bodies
    body.syncWithPhysics();
    arm.syncWithPhysics();
    hand.syncWithPhysics();

    // Render the scene
    renderer.render(scene, camera);
}
animate();

// Start simulation if active
if (IS_SIMULATION_ACTIVE) {
    window.addEventListener('load', () => {
        setTimeout(currentTest, 1000);
    });
}