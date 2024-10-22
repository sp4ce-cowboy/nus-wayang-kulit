import * as THREE from 'three';
import './style.css';
import { PuppetPart3D } from './models/PuppetPart3D.js';  
import { PuppetPartGLB } from './models/PuppetPartGLB.js';  
import { setupEventListeners } from './common/EventHandlersIK.js';
import { GLTFLoader } from 'three-stdlib';

// Create a scene
const scene = new THREE.Scene();
//scene.background = new THREE.Color(0x333333); // Dark grey background
scene.background = new THREE.Color(0x000000); // Black background

// Add ambient light (general soft light)
const ambientLight = new THREE.AmbientLight(0xffffff, 3); // Color and intensity
scene.add(ambientLight);

// Add directional light (acts like sunlight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10); // Position the light source
scene.add(directionalLight);

/*
// Add spotlight
const spotLight = new THREE.SpotLight(0xffffff, 1);  // Use white light
spotLight.position.set(0, 0, 5);  // Adjust position
scene.add(spotLight);
*/

// Create the body part with OBJ and MTL files
const body = new PuppetPart3D(
    './assets/puppet_01/body_with_colour.obj',
    './assets/puppet_01/body_with_colour.mtl'
);

const hand = new PuppetPart3D(
    './assets/puppet_01/shadow_obj/Wayang_kulit_puppet_h_1019104325.obj',
    './assets/puppet_01/shadow_obj/model.mtl',
    0.08, 0.08, 0.07
);

const arm = new PuppetPart3D(
    './assets/puppet_01/shadow_obj/Wayang_kulit_puppet_a_1021105200_obj/Wayang_kulit_puppet_a_1021105200.obj',
    './assets/puppet_01/shadow_obj/Wayang_kulit_puppet_a_1021105200_obj/model.mtl',
    0.07, 0.07, 0.05
);

const armPivot = new THREE.Group(); // Group to act as the pivot point for the arm
const handPivot = new THREE.Group(); // Group to act as the pivot point for the hand

body.onReady = () => {
    body.addToScene(scene);

    arm.onReady = () => {
        const pivotHelper = new THREE.AxesHelper(0.1);
        armPivot.add(pivotHelper); 
        armPivot.add(arm.mesh); // Add the arm to the pivot group

        // Move the arm to a position relative to the armPivot mesh
        // (left right; in out; up down)
        arm.mesh.position.set(0, 0, 0.05);

        // Move the arm together with the pivot
        armPivot.position.set(-0.08, 0.01, -0.07);

        body.mesh.add(armPivot); // Attach the pivot group to the body
        arm.setRotation(-1.7, -1.7, -0.2); // Adjust initial rotation of the arm

            // Load the hand and attach it to the arm
        hand.onReady = () => {
            const newPivotHelper = new THREE.AxesHelper(0.1);
            handPivot.add(newPivotHelper)
            handPivot.add(hand.mesh); // Add the hand mesh to its pivot

            // Step 3: Position the hand mesh relative to the arm
            hand.mesh.position.set(-0.025, 0, 0.05); // Adjust relative to arm
            handPivot.position.set(0, 0, 0.12); // Adjust as necessary
            
            // Step 4: Attach the hand pivot to the arm pivot
            armPivot.add(handPivot); // Nest handPivot inside armPivot
            hand.setRotation(-1.7, -1.7, -0.2); // Adjust initial rotation of the hand
        };  
    };

    body.setPosition(0, 0, 0); // Set initial position
    body.setRotation(1.7, 0, 0); // Set initial rotation

    const limits = {
        x: { min: -10, max: 10 },
        y: { min: -5, max: 5 },
        z: { min: -50, max: 35 },
    };

    // Pass the pivot to event listeners
    setupEventListeners({ body, armPivot, handPivot, renderer, camera }, limits);
};

// Set up the camera
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 1);
scene.add(camera);

// Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.outputEncoding = THREE.sRGBEncoding;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();